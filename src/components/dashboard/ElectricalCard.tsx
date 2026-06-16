'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface ElectricalCardProps {
  label: string;
  value: number | null;
  unit: string;
  series: (number | null)[];
  labels: string[];
  color: string;
}

export function ElectricalCard({
  label,
  value,
  unit,
  series,
  labels,
  color,
}: ElectricalCardProps) {
  const chartData = series.map((v, i) => ({ t: labels[i] ?? '', v }));
  const displayValue = value === null ? '—' : Number(value).toFixed(
    unit === 'A' ? 2 : 1
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900">{displayValue}</span>
        <span className="text-sm text-gray-500 ml-1.5">{unit}</span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`elec-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} width={32} />
            <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [
                v == null ? '—' : Number(v).toFixed(unit === 'A' ? 2 : 1),
                label,
              ]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#elec-${label.replace(/\s/g, '')})`}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
