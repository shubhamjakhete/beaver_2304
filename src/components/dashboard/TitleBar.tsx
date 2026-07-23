'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { computeIsLive } from '@/types/dashboard';

export function TitleBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const { data, isError } = useDashboard();

  // LIVE is browser-clock-dependent (unlike 2403's server-side is_live).
  const isLive = !isError && computeIsLive(data?.created_at);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDate(
        now.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      style={{ background: 'var(--bg-header)', borderColor: 'var(--line)' }}
      className="flex items-center justify-between border rounded-[10px] px-[18px] py-[10px] gap-3"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="images/village.jpg"
          alt="Village of Indiantown"
          width={48}
          height={48}
          className="rounded flex-shrink-0 object-cover"
          style={{ background: '#ffffff', padding: '2px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <div
            className="font-grotesk font-bold text-[1.05rem] tracking-[.06em] truncate"
            style={{ color: 'var(--text-hi)' }}
          >
            Beaver Project — 2304
          </div>
          <div
            className="text-[.72rem] tracking-[.03em] truncate"
            style={{ color: 'var(--text-mid)' }}
          >
            IndianTown STP Water Monitoring · Beaver EcoWorks
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <div
            className="font-mono text-[.95rem] tracking-[.02em]"
            style={{ color: 'var(--text-hi)' }}
          >
            {time}
          </div>
          <div className="text-[.7rem]" style={{ color: 'var(--text-mid)' }}>
            {date}
          </div>
        </div>

        <div className="w-px h-[26px] hidden sm:block" style={{ background: 'var(--line)' }} />

        <div
          style={{
            background: 'var(--bg-panel-alt)',
            borderColor: 'var(--line)',
            color: isLive ? 'var(--text-mid)' : 'var(--warn)',
          }}
          className="flex items-center gap-2 border rounded-[20px] px-3 py-[6px] text-[.75rem]"
        >
          <span
            className={`w-2 h-2 rounded-full ${isLive ? 'animate-pulse' : ''}`}
            style={{
              background: isLive ? 'var(--good)' : 'var(--warn)',
              boxShadow: isLive ? '0 0 8px var(--good)' : '0 0 8px var(--warn)',
            }}
          />
          {isLive ? '_SystemOperator · LIVE' : 'Data Delayed'}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="images/beaver-logo.png"
          alt="Beaver EcoWorks"
          width={48}
          height={48}
          className="rounded flex-shrink-0 object-contain"
          style={{ background: '#ffffff', padding: '2px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    </header>
  );
}
