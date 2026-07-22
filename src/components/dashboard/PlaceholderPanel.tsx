import { PanelShell } from './PanelShell';

interface PlaceholderPanelProps {
  title: string;
  message?: string;
}

export function PlaceholderPanel({
  title,
  message = 'Coming soon — not built in this prototype yet.',
}: PlaceholderPanelProps) {
  return (
    <PanelShell title={title}>
      <div
        className="flex flex-col items-center justify-center gap-3 py-16 rounded-[8px]"
        style={{ background: 'var(--bg-panel-alt)', border: '1px solid var(--line-soft)' }}
      >
        <div
          className="font-grotesk text-[.9rem] font-semibold tracking-[.08em] uppercase"
          style={{ color: 'var(--text-hi)' }}
        >
          {title}
        </div>
        <div className="text-[.75rem]" style={{ color: 'var(--text-mid)' }}>
          {message}
        </div>
      </div>
    </PanelShell>
  );
}
