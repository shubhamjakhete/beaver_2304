'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useSensorHistory } from '@/hooks/useSensorHistory';
import type { SensorKey, HistoryPeriod, SensorMeta } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface SensorDrawerProps {
  sensor: SensorKey | null;
  meta: SensorMeta | null;
  currentValue: number | null;
  open: boolean;
  onClose: () => void;
}

const PERIODS: { value: HistoryPeriod; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function SensorDrawer({
  sensor,
  meta,
  currentValue,
  open,
  onClose,
}: SensorDrawerProps) {
  const [period, setPeriod] = useState<HistoryPeriod>('weekly');
  const { data, isLoading, isError } = useSensorHistory(sensor, period);

  const chartData =
    data?.success && data.series
      ? data.series.labels.map((label, i) => ({
          label,
          value: data.series.values[i] ?? null,
        }))
      : [];

  const latestVal = data?.latest_value ?? currentValue;
  const displayCurrent =
    latestVal === null ? '—' : Number(latestVal).toFixed(2);

  const periodTitle =
    period.charAt(0).toUpperCase() + period.slice(1);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>
            {meta?.label ?? sensor} — Historical Trend
          </DialogTitle>
        </DialogHeader>

        {/* Current value */}
        <div className="mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {displayCurrent}
          </span>
          {meta?.unit && (
            <span className="text-lg text-gray-500 ml-2">{meta.unit}</span>
          )}
        </div>

        {/* Period toggle */}
        <div className="flex gap-2 mb-4">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-72 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : isError || !data?.success ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              {data?.error ?? 'No data available for this period.'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="drawerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={meta?.color ?? '#2563eb'}
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="95%"
                      stopColor={meta?.color ?? '#2563eb'}
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: meta?.unit ?? '',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: { fontSize: 11, fill: '#9ca3af' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    padding: '6px 12px',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [
                    v == null ? '—' : Number(v).toFixed(4),
                    meta?.label ?? sensor,
                  ]}
                  labelFormatter={(l) => String(l)}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={meta?.color ?? '#2563eb'}
                  strokeWidth={2}
                  fill="url(#drawerFill)"
                  dot={{ r: 3, fill: meta?.color ?? '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-xs text-gray-400 text-right mt-1">
          {periodTitle} Historical {meta?.label ?? ''} Trend
        </p>
      </DialogContent>
    </Dialog>
  );
}
