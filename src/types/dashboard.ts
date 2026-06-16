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

export type SensorKey = 'orp' | 'ph' | 'do_val' | 'tds' | 'pt100_1' | 'pt100_2';
export type HistoryPeriod = 'weekly' | 'monthly' | 'yearly';

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
  key: SensorKey;
  label: string;
  unit: string;
  color: string;
  /** Recharts area fill (hex with opacity appended or rgba) */
  fill: string;
}

export const SENSOR_META: Record<SensorKey, SensorMeta> = {
  ph: {
    key: 'ph',
    label: 'pH Level',
    unit: '',
    color: '#10b981',
    fill: '#10b98120',
  },
  tds: {
    key: 'tds',
    label: 'TDS',
    unit: 'ppm',
    color: '#f59e0b',
    fill: '#f59e0b20',
  },
  orp: {
    key: 'orp',
    label: 'ORP',
    unit: 'mV',
    color: '#8b5cf6',
    fill: '#8b5cf620',
  },
  do_val: {
    key: 'do_val',
    label: 'Dissolved Oxygen',
    unit: 'mg/L',
    color: '#06b6d4',
    fill: '#06b6d420',
  },
  pt100_1: {
    key: 'pt100_1',
    label: 'PT1',
    unit: '°PSI',
    color: '#ef4444',
    fill: '#ef444420',
  },
  pt100_2: {
    key: 'pt100_2',
    label: 'PT2',
    unit: '°PSI',
    color: '#10b981',
    fill: '#10b98120',
  },
};
