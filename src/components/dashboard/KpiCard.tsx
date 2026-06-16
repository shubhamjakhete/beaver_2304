'use client';

import { motion } from 'framer-motion';
import { MiniSparkline } from './MiniSparkline';

interface KpiCardProps {
  label: string;
  value: number | null;
  unit?: string;
  precision?: number;
  series: (number | null)[];
  color: string;
  fill: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function KpiCard({
  label,
  value,
  unit,
  precision = 2,
  series,
  color,
  fill,
  onClick,
  clickable = false,
}: KpiCardProps) {
  const displayValue =
    value === null ? '—' : Number(value).toFixed(precision);

  const card = (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col ${
        clickable ? 'cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''
      }`}
    >
      <p className="text-sm font-medium text-gray-500 mb-3">{label}</p>
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">{displayValue}</span>
        {unit && (
          <span className="text-sm text-gray-500 ml-1.5">{unit}</span>
        )}
      </div>
      <div className="h-16 flex-1 min-h-0">
        <MiniSparkline data={series} color={color} fill={fill} />
      </div>
    </div>
  );

  if (clickable && onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className="block w-full text-left h-full"
      >
        {card}
      </motion.button>
    );
  }

  return card;
}
