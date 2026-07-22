'use client';

interface RadialGaugeProps {
  value: number | null;
  min: number;
  max: number;
  unit: string;
  label: string;
  sublabel?: string;
  decimals?: number;
}

const CIRC = 251.3;
const TRACK = 188.5;
const CX = 50;
const CY = 50;
const R = 40;

function arcTip(frac: number): { x: number; y: number } {
  const theta = ((135 + frac * 270) * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(theta),
    y: CY + R * Math.sin(theta),
  };
}

export function RadialGauge({
  value,
  min,
  max,
  unit,
  label,
  sublabel,
  decimals = 0,
}: RadialGaugeProps) {
  const frac =
    value == null ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const arcLen = (TRACK * frac).toFixed(1);
  const displayVal =
    value == null ? '—' : value.toFixed(decimals);
  const tip = arcTip(frac);

  return (
    <div className="flex flex-col items-center flex-1">
      <svg viewBox="0 0 100 100" className="w-[84px] h-[84px]" style={{ overflow: 'visible' }}>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--line-soft)"
          strokeWidth="7"
          transform="rotate(135 50 50)"
          strokeDasharray={`${TRACK} ${CIRC}`}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="7"
          strokeLinecap="round"
          transform="rotate(135 50 50)"
          strokeDasharray={`${arcLen} ${CIRC}`}
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
        <circle
          cx={tip.x}
          cy={tip.y}
          r="6.5"
          fill="var(--accent)"
          stroke="#fff"
          strokeWidth="2"
          className="animate-pulse motion-reduce:animate-none"
          style={{
            filter: 'drop-shadow(0 0 8px var(--accent))',
            transition: 'cx .6s ease, cy .6s ease',
          }}
        />
        <text
          x="50"
          y="44"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="13"
          fontWeight="600"
          fill="var(--text-hi)"
        >
          {displayVal}
        </text>
        <text
          x="50"
          y="66"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          fill="var(--text-mid)"
          letterSpacing="0.5"
        >
          {unit}
        </text>
      </svg>
      <div className="text-[.62rem] tracking-[.05em] mt-[2px]" style={{ color: 'var(--text-mid)' }}>
        {label}
      </div>
      {sublabel && (
        <div
          className="text-[.58rem] tracking-[.03em] mt-[1px] text-center"
          style={{ color: '#ffffff' }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}
