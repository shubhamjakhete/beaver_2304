'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from 'recharts';

interface MiniSparklineProps {
  data: (number | null)[];
  color: string;
  fill?: string;
}

export function MiniSparkline({ data, color }: MiniSparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <YAxis domain={['auto', 'auto']} hide />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#fill-${color.replace('#', '')})`}
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
