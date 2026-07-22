'use client';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSensorHistory } from '@/hooks/useSensorHistory';
import { useDashboard } from '@/hooks/useDashboard';
import { fmt, seriesStats } from '@/lib/format';
import type { HistoryPeriod, SeriesKey, SensorKey, TrendsPeriod } from '@/types/dashboard';
import { HISTORY_SENSORS, SENSOR_META } from '@/types/dashboard';

interface ChartCardProps {
  sensor: SeriesKey;
  period: TrendsPeriod;
  className?: string;
}

function isHistorySensor(key: SeriesKey): key is SensorKey {
  return (HISTORY_SENSORS as string[]).includes(key);
}

export function ChartCard({ sensor, period, className = '' }: ChartCardProps) {
  const meta = SENSOR_META[sensor];
  const { data: dash } = useDashboard();

  const historyPeriod: HistoryPeriod =
    period === '12h' ? 'weekly' : period;
  const historyEnabled = period !== '12h' && isHistorySensor(sensor);

  const { data: hist, isLoading: histLoading } = useSensorHistory(
    historyEnabled ? sensor : null,
    historyPeriod,
  );

  let labels: string[] = [];
  let values: (number | null)[] = [];
  let footer = '';

  if (period === '12h') {
    labels = dash?.series?.labels ?? [];
    values = (dash?.series?.[sensor] as (number | null)[] | undefined) ?? [];
    footer = '15-min avg · 12h';
  } else if (!isHistorySensor(sensor)) {
    footer = 'History not available for this sensor';
  } else if (hist?.success) {
    labels = hist.series.labels;
    values = hist.series.values;
    footer =
      period === 'weekly'
        ? 'Daily avg · weekly'
        : period === 'monthly'
          ? 'Weekly avg · monthly'
          : 'Monthly avg · yearly';
  } else {
    footer = hist?.error ?? 'No data';
  }

  const nums = values.filter((v): v is number => v != null);
  const current = nums.length ? nums[nums.length - 1] : null;
  const first = nums.length ? nums[0] : null;
  const delta = current != null && first != null ? current - first : null;
  const { min, max, avg } = seriesStats(values);

  const chartData = labels.map((label, i) => ({
    label,
    value: values[i] ?? null,
  }));

  const deltaClass =
    delta == null ? '' : delta >= 0 ? 'text-[var(--good)]' : 'text-[var(--alarm)]';
  const deltaArrow = delta == null ? '' : delta >= 0 ? '▲' : '▼';
  const loading = period !== '12h' && histLoading && !chartData.length;

  return (
    <div
      className={`rounded-[10px] p-[13px_15px_10px] flex flex-col gap-2 ${className}`}
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className="font-grotesk text-[.72rem] font-semibold tracking-[.08em] uppercase"
            style={{ color: '#ffffff' }}
          >
            {meta.label}
          </div>
          <div className="flex items-baseline gap-1 mt-[2px]">
            <span
              className="font-mono text-[1.15rem] font-semibold"
              style={{ color: 'var(--text-hi)' }}
            >
              {fmt(current, meta.decimals)}
              {meta.unit && (
                <span
                  className="text-[.62rem] ml-[3px] font-sans"
                  style={{ color: 'var(--text-mid)' }}
                >
                  {meta.unit}
                </span>
              )}
            </span>
            {delta != null && (
              <span className={`text-[.66rem] font-sans ${deltaClass}`}>
                {deltaArrow} {Math.abs(delta).toFixed(meta.decimals)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-[10px] text-right">
          {(
            [
              ['MIN', min],
              ['MAX', max],
              ['AVG', avg],
            ] as [string, number | null][]
          ).map(([stat, val]) => (
            <div key={stat} className="flex flex-col">
              <span className="text-[.56rem] tracking-[.06em]" style={{ color: '#ffffff' }}>
                {stat}
              </span>
              <span className="font-mono text-[.7rem]" style={{ color: '#ffffff' }}>
                {fmt(val, meta.decimals)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[88px]">
        {loading ? (
          <div
            className="h-full flex items-center justify-center text-[.65rem]"
            style={{ color: 'var(--text-low)' }}
          >
            Loading…
          </div>
        ) : !chartData.length ? (
          <div
            className="h-full flex items-center justify-center text-[.65rem]"
            style={{ color: 'var(--text-low)' }}
          >
            No series data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-panel-alt)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  color: 'var(--text-hi)',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => [
                  typeof v === 'number' ? v.toFixed(meta.decimals) : '—',
                  meta.label,
                ]}
              />
              <Line
                type="basis"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="text-[.62rem]" style={{ color: 'var(--text-low)' }}>
        {footer}
      </div>
    </div>
  );
}
