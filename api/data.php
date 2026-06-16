<?php
require __DIR__ . '/cors.php';
require __DIR__ . '/credentials.php';

$TABLE = DB_TABLE;

// Latest timestamp in the table
$endTs = pdo()->query("
    SELECT MAX(STR_TO_DATE(CONCAT(`DATE`,' ',`TIME`), '%Y-%m-%d %H:%i:%s'))
    FROM `$TABLE`
")->fetchColumn();

if (!$endTs) {
    echo json_encode(['error' => 'No data found']);
    exit;
}

$end   = new DateTime($endTs);
$start = (clone $end)->modify('-12 hours');

// Base subquery — backtick all spaced column names, map to clean keys
$base = "
    SELECT
        STR_TO_DATE(CONCAT(`DATE`,' ',`TIME`), '%Y-%m-%d %H:%i:%s') AS ts,
        `ORP`            AS orp,
        `PH`             AS ph,
        `DO`             AS do_val,
        `TDS`            AS tds,
        `PT100 1`        AS pt100_1,
        `PT100 2`        AS pt100_2,
        `TANK LEVEL`     AS tank_level,
        `PS1 VOLTAGE`    AS ps1_voltage,
        `PS1 CURRENT`    AS ps1_current,
        `PS2 VOLTAGE`    AS ps2_voltage,
        `PS2 CURRENT`    AS ps2_current,
        `PS3 VOLTAGE`    AS ps3_voltage,
        `PS3 CURRENT`    AS ps3_current,
        `FLOW`           AS flow,
        `TOTAL FLOW MG`  AS total_flow_mg,
        `PROCESS HOURS`  AS process_hour
    FROM `$TABLE`
";

// Latest single row
$latestStmt = pdo()->prepare("
    SELECT * FROM ($base) x
    WHERE x.ts BETWEEN :s AND :e
    ORDER BY x.ts DESC
    LIMIT 1
");
$latestStmt->execute([':s' => $start->format('Y-m-d H:i:s'), ':e' => $end->format('Y-m-d H:i:s')]);
$L = $latestStmt->fetch() ?: [];

// 12-hour series in 15-minute buckets
$seriesStmt = pdo()->prepare("
    SELECT
        FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(ts)/900)*900) AS bucket,
        AVG(orp)          AS orp,
        AVG(ph)           AS ph,
        AVG(do_val)       AS do_val,
        AVG(tds)          AS tds,
        AVG(pt100_1)      AS pt100_1,
        AVG(pt100_2)      AS pt100_2,
        AVG(tank_level)   AS tank_level,
        AVG(ps1_voltage)  AS ps1_voltage,
        AVG(ps1_current)  AS ps1_current,
        AVG(ps2_voltage)  AS ps2_voltage,
        AVG(ps2_current)  AS ps2_current,
        AVG(ps3_voltage)  AS ps3_voltage,
        AVG(ps3_current)  AS ps3_current,
        AVG(flow)         AS flow,
        AVG(total_flow_mg) AS total_flow_mg,
        AVG(process_hour) AS process_hour
    FROM ($base) d
    WHERE d.ts BETWEEN :s AND :e
    GROUP BY bucket
    ORDER BY bucket ASC
");
$seriesStmt->execute([':s' => $start->format('Y-m-d H:i:s'), ':e' => $end->format('Y-m-d H:i:s')]);
$rows = $seriesStmt->fetchAll();

// Build exactly 48 points (12h ÷ 15min)
$POINTS      = 48;
$STEP        = 900;
$endAligned  = (int) floor($end->getTimestamp() / $STEP) * $STEP;

$byTs = [];
foreach ($rows as $r) {
    $byTs[strtotime($r['bucket'])] = $r;
}

$keys = [
    'orp','ph','do_val','tds','pt100_1','pt100_2','tank_level',
    'ps1_voltage','ps1_current',
    'ps2_voltage','ps2_current',
    'ps3_voltage','ps3_current',
    'flow','total_flow_mg','process_hour',
];
$S      = array_fill_keys($keys, []);
$labels = [];

for ($i = $POINTS - 1; $i >= 0; $i--) {
    $t        = $endAligned - $i * $STEP;
    $labels[] = date('H:i', $t);
    $r        = $byTs[$t] ?? null;
    foreach ($keys as $k) {
        $S[$k][] = ($r && $r[$k] !== null) ? (float) $r[$k] : null;
    }
}

// Float helper — preserve null for "no data" rather than forcing 0
function flt(array $row, string $key): ?float {
    return isset($row[$key]) && $row[$key] !== null ? (float) $row[$key] : null;
}

echo json_encode([
    'orp'          => flt($L, 'orp'),
    'ph'           => flt($L, 'ph'),
    'do_val'       => flt($L, 'do_val'),
    'tds'          => flt($L, 'tds'),
    'pt100_1'      => flt($L, 'pt100_1'),
    'pt100_2'      => flt($L, 'pt100_2'),
    'tank_level'   => flt($L, 'tank_level'),
    'ps1_voltage'  => flt($L, 'ps1_voltage'),
    'ps1_current'  => flt($L, 'ps1_current'),
    'ps2_voltage'  => flt($L, 'ps2_voltage'),
    'ps2_current'  => flt($L, 'ps2_current'),
    'ps3_voltage'  => flt($L, 'ps3_voltage'),
    'ps3_current'  => flt($L, 'ps3_current'),
    'flow'         => flt($L, 'flow'),
    'total_flow_mg'=> flt($L, 'total_flow_mg'),
    'process_hour' => flt($L, 'process_hour'),
    'created_at'   => $end->format('Y-m-d H:i:s'),
    'series'       => array_merge(['labels' => $labels], $S),
], JSON_UNESCAPED_SLASHES);
