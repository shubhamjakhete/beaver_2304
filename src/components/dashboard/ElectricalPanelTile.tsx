'use client';

import { fmt } from '@/lib/format';

interface ElectricalPanelTileProps {
  panel: string;
  voltage: number | null;
  current: number | null;
}

export function ElectricalPanelTile({
  panel,
  voltage,
  current,
}: ElectricalPanelTileProps) {
  return (
    <div
      className="rounded-[10px] p-[13px_15px] flex flex-col gap-3"
      style={{ background: 'var(--bg-panel-alt)', border: '1px solid var(--line)' }}
    >
      <div
        className="font-grotesk text-[.72rem] font-semibold tracking-[.08em] uppercase"
        style={{ color: '#ffffff' }}
      >
        {panel} Panel
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[.58rem] tracking-[.06em] uppercase" style={{ color: 'var(--text-mid)' }}>
            Voltage
          </div>
          <div className="font-mono text-[1.15rem] font-semibold" style={{ color: 'var(--text-hi)' }}>
            {fmt(voltage, 1)}
            <span className="text-[.62rem] ml-1 font-sans" style={{ color: 'var(--text-mid)' }}>
              V
            </span>
          </div>
        </div>
        <div>
          <div className="text-[.58rem] tracking-[.06em] uppercase" style={{ color: 'var(--text-mid)' }}>
            Current
          </div>
          <div className="font-mono text-[1.15rem] font-semibold" style={{ color: 'var(--text-hi)' }}>
            {fmt(current, 2)}
            <span className="text-[.62rem] ml-1 font-sans" style={{ color: 'var(--text-mid)' }}>
              A
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
