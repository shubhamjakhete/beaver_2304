'use client';

import { useState } from 'react';
import { PanelShell } from '@/components/dashboard/PanelShell';
import { ChartCard } from '@/components/dashboard/ChartCard';
import type { TrendsPeriod } from '@/types/dashboard';
import { HISTORY_SENSORS, TREND_12H_SENSORS } from '@/types/dashboard';

const PERIODS: { value: TrendsPeriod; label: string }[] = [
  { value: '12h', label: '12H' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export default function TrendsPage() {
  const [period, setPeriod] = useState<TrendsPeriod>('12h');
  const sensors = period === '12h' ? TREND_12H_SENSORS : HISTORY_SENSORS;

  return (
    <>
      <PanelShell
        title="Trends"
        note={`${sensors.length} of ${TREND_12H_SENSORS.length} tracked tags shown`}
      >
        <div className="flex flex-wrap gap-2 mb-1">
          {PERIODS.map((p) => {
            const active = period === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                style={
                  active
                    ? {
                        borderColor: 'var(--accent)',
                        color: 'var(--accent)',
                        background: 'var(--bg-panel-alt)',
                        boxShadow: 'inset 0 0 0 1px var(--accent)',
                      }
                    : {
                        borderColor: 'var(--line)',
                        color: 'var(--text-mid)',
                        background: 'var(--bg-panel-alt)',
                      }
                }
                className="px-3 py-[6px] rounded-[20px] text-[.7rem] tracking-[.06em] uppercase border transition-colors"
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </PanelShell>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
        {sensors.map((sensor) => (
          <ChartCard key={`${sensor}-${period}`} sensor={sensor} period={period} />
        ))}
      </div>
    </>
  );
}
