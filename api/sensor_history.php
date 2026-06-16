<?php
require __DIR__ . '/cors.php';
require __DIR__ . '/credentials.php';

$TABLE  = DB_TABLE;
$period = isset($_GET['period']) ? strtolower($_GET['period']) : 'weekly';
$sensor = isset($_GET['sensor']) ? strtolower($_GET['sensor']) : '';

// Allowed sensors: maps clean key → original backtick-quoted column
$allowed = [
    'orp'     => '`ORP`',
    'ph'      => '`PH`',
    'do_val'  => '`DO`',
    'tds'     => '`TDS`',
    'pt100_1' => '`PT100 1`',
    'pt100_2' => '`PT100 2`',
];

if (!array_key_exists($sensor, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => "Unknown sensor: $sensor"]);
    exit;
}

$col = $allowed[$sensor];

try {
    $pdo = pdo();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

$tsExpr = "STR_TO_DATE(CONCAT(`DATE`,' ',`TIME`), '%Y-%m-%d %H:%i:%s')";

$endTs = $pdo->query("SELECT MAX($tsExpr) FROM `$TABLE`")->fetchColumn();
if (!$endTs) {
    echo json_encode(['success' => false, 'error' => 'No data found']);
    exit;
}

$end = new DateTime($endTs);

switch ($period) {
    case 'yearly':
        $start = (clone $end)->modify('-1 year');
        break;
    case 'monthly':
        $start = (clone $end)->modify('-1 month');
        break;
    default:
        $start  = (clone $end)->modify('-1 week');
        $period = 'weekly';
}

$stmt = $pdo->prepare("
    SELECT
        $tsExpr      AS ts,
        $col         AS val
    FROM `$TABLE`
    WHERE $tsExpr BETWEEN :s AND :e
      AND $col IS NOT NULL
    ORDER BY ts ASC
");
$stmt->execute([':s' => $start->format('Y-m-d H:i:s'), ':e' => $end->format('Y-m-d H:i:s')]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$rows) {
    echo json_encode(['success' => false, 'error' => "No data for $sensor in $period period"]);
    exit;
}

// Group into daily (weekly), weekly (monthly), or monthly (yearly) averages
$rawLabels = array_map(fn($r) => new DateTime($r['ts']), $rows);
$rawValues = array_map(fn($r) => (float) $r['val'], $rows);

$labels = [];
$values = [];

if ($period === 'weekly') {
    $groups = [];
    foreach ($rawLabels as $i => $dt) {
        $key = $dt->format('Y-m-d');
        $groups[$key][] = $rawValues[$i];
    }
    ksort($groups);
    $days = array_slice(array_keys($groups), -7);
    foreach ($days as $day) {
        $vals = $groups[$day];
        $labels[] = $day;
        $values[] = round(array_sum($vals) / count($vals), 4);
    }
} elseif ($period === 'monthly') {
    $weekGroups = [[], [], [], []];
    foreach ($rawLabels as $i => $dt) {
        $diffDays  = (int) floor(($end->getTimestamp() - $dt->getTimestamp()) / 86400);
        $weekIndex = (int) floor($diffDays / 7);
        if ($weekIndex >= 0 && $weekIndex < 4) {
            $weekGroups[3 - $weekIndex][] = $rawValues[$i];
        }
    }
    for ($w = 0; $w < 4; $w++) {
        if (!empty($weekGroups[$w])) {
            $labels[] = "Week " . ($w + 1);
            $values[] = round(array_sum($weekGroups[$w]) / count($weekGroups[$w]), 4);
        }
    }
} else {
    // yearly → monthly averages
    $groups = [];
    foreach ($rawLabels as $i => $dt) {
        $key = $dt->format('Y-m');
        $groups[$key][] = $rawValues[$i];
    }
    ksort($groups);
    $months     = array_slice(array_keys($groups), -12);
    $monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    foreach ($months as $key) {
        [$y, $m] = explode('-', $key);
        $labels[] = $monthNames[(int)$m - 1] . ' ' . $y;
        $vals     = $groups[$key];
        $values[] = round(array_sum($vals) / count($vals), 4);
    }
}

echo json_encode([
    'success'      => true,
    'sensor'       => $sensor,
    'period'       => $period,
    'latest_value' => !empty($rawValues) ? (float) end($rawValues) : null,
    'series'       => ['labels' => $labels, 'values' => $values],
], JSON_UNESCAPED_SLASHES);
