export interface SeriesData {
  labels: string[];
  orp: (number | null)[];
  ph: (number | null)[];
  do_val: (number | null)[];
  tds: (number | null)[];
  pt100_1: (number | null)[];
  pt100_2: (number | null)[];
  tank_level: (number | null)[];
  ps1_voltage: (number | null)[];
  ps1_current: (number | null)[];
  ps2_voltage: (number | null)[];
  ps2_current: (number | null)[];
  ps3_voltage: (number | null)[];
  ps3_current: (number | null)[];
  flow: (number | null)[];
  total_flow_mg: (number | null)[];
  process_hour: (number | null)[];
}

export interface DashboardSnapshot {
  orp: number | null;
  ph: number | null;
  do_val: number | null;
  tds: number | null;
  pt100_1: number | null;
  pt100_2: number | null;
  tank_level: number | null;
  ps1_voltage: number | null;
  ps1_current: number | null;
  ps2_voltage: number | null;
  ps2_current: number | null;
  ps3_voltage: number | null;
  ps3_current: number | null;
  flow: number | null;
  total_flow_mg: number | null;
  process_hour: number | null;
  created_at: string;
  series: SeriesData;
}

/** Sensors that support sensor_history.php weekly/monthly/yearly. */
export type SensorKey = 'orp' | 'ph' | 'do_val' | 'tds' | 'pt100_1' | 'pt100_2';

/** Extra series keys available only from data.php 12h buckets. */
export type SeriesKey = SensorKey | 'tank_level' | 'flow' | 'total_flow_mg' | 'process_hour';

export type HistoryPeriod = 'weekly' | 'monthly' | 'yearly';
export type TrendsPeriod = '12h' | HistoryPeriod;

export interface SensorHistoryResponse {
  success: boolean;
  sensor: SensorKey;
  period: HistoryPeriod;
  latest_value: number | null;
  series: {
    labels: string[];
    values: number[];
  };
  error?: string;
}

export interface SensorMeta {
  key: SeriesKey;
  label: string;
  unit: string;
  decimals: number;
}

export const HISTORY_SENSORS: SensorKey[] = [
  'ph',
  'orp',
  'tds',
  'do_val',
  'pt100_1',
  'pt100_2',
];

export const TREND_12H_SENSORS: SeriesKey[] = [
  'ph',
  'orp',
  'tds',
  'do_val',
  'pt100_1',
  'pt100_2',
  'tank_level',
  'flow',
  'total_flow_mg',
];

export const SENSOR_META: Record<SeriesKey, SensorMeta> = {
  ph: { key: 'ph', label: 'pH', unit: '', decimals: 2 },
  orp: { key: 'orp', label: 'ORP', unit: 'mV', decimals: 0 },
  tds: { key: 'tds', label: 'TDS', unit: 'ppm', decimals: 0 },
  do_val: { key: 'do_val', label: 'DO', unit: 'mg/L', decimals: 2 },
  pt100_1: { key: 'pt100_1', label: 'PT1', unit: 'PSI', decimals: 1 },
  pt100_2: { key: 'pt100_2', label: 'PT2', unit: 'PSI', decimals: 1 },
  tank_level: { key: 'tank_level', label: 'Tank Level', unit: '%', decimals: 1 },
  flow: { key: 'flow', label: 'Flow', unit: 'GPM', decimals: 1 },
  total_flow_mg: { key: 'total_flow_mg', label: 'Total Flow', unit: 'MG', decimals: 1 },
  process_hour: { key: 'process_hour', label: 'Process Hours', unit: 'h', decimals: 2 },
};

/**
 * LIVE is browser-clock-dependent (unlike 2403's server-side is_live).
 * Treat data as live when created_at is within the last 600 seconds.
 */
export function computeIsLive(createdAt: string | null | undefined): boolean {
  if (!createdAt) return false;
  const ts = Date.parse(createdAt.replace(' ', 'T'));
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < 600_000;
}
