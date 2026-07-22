'use client';

import { forwardRef, type KeyboardEvent } from 'react';

interface LcdCardProps {
  label: string;
  value: string | number | null;
  unit?: string;
  variant?: 'good' | 'accent';
  color?: string;
  onActivate?: () => void;
}

export const LcdCard = forwardRef<HTMLDivElement, LcdCardProps>(function LcdCard(
  { label, value, unit, variant = 'good', color, onActivate },
  ref,
) {
  const isAccent = variant === 'accent';
  const valueColor = color ?? 'var(--text-hi)';
  const valueShadow = isAccent
    ? '0 0 9px rgba(53,197,240,.2)'
    : '0 0 9px rgba(47,226,160,.2)';
  const interactive = typeof onActivate === 'function';
  const display = value == null ? '—' : String(value);

  return (
    <div
      ref={ref}
      className={`rounded-[7px] p-[9px_11px] flex flex-col justify-center ${
        isAccent ? 'lcd-accent' : 'lcd-good'
      }${
        interactive
          ? ' cursor-pointer transition-[border-color,transform] duration-150 hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2'
          : ''
      }`}
      {...(interactive
        ? {
            role: 'button' as const,
            tabIndex: 0,
            'aria-label': `Open ${label} detail`,
            onClick: onActivate,
            onKeyDown: (e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onActivate();
              }
            },
          }
        : {})}
    >
      <div
        className="text-[.62rem] tracking-[.07em] uppercase mb-[3px]"
        style={{ color: '#ffffff' }}
      >
        {label}
      </div>
      <div
        className="font-mono text-[1.2rem] font-semibold"
        style={{ color: valueColor, textShadow: valueShadow }}
      >
        {display}
        {unit && (
          <span
            className="text-[.62rem] ml-[3px]"
            style={{ color: 'var(--text-mid)', textShadow: 'none' }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
});
