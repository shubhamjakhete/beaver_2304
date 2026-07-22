'use client';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import { PanelShell } from '@/components/dashboard/PanelShell';
import { RadialGauge } from '@/components/dashboard/RadialGauge';
import { LcdCard } from '@/components/dashboard/LcdCard';
import { TankCapsule } from '@/components/dashboard/TankCapsule';
import { ElectricalPanelTile } from '@/components/dashboard/ElectricalPanelTile';
import { fmt, fmtProcessHour, fmtSigned, seriesStats } from '@/lib/format';

export default function OverviewPage() {
  const { data, isError, isLoading } = useDashboard();

  const tankSeries = data?.series?.tank_level ?? [];
  const tankStats = seriesStats(tankSeries);
  const tankCurrent = data?.tank_level ?? null;
  const tankFirst = tankSeries.find((v): v is number => v != null) ?? null;
  const tankDelta =
    tankCurrent != null && tankFirst != null ? tankCurrent - tankFirst : null;
  const tankDeltaClass =
    tankDelta == null ? '' : tankDelta >= 0 ? 'text-[var(--good)]' : 'text-[var(--alarm)]';
  const tankDeltaArrow = tankDelta == null ? '' : tankDelta >= 0 ? '▲' : '▼';

  const tankChartData = (data?.series?.labels ?? []).map((label, i) => ({
    ts: label,
    value: tankSeries[i] ?? null,
  }));

  const flowSeries = data?.series?.flow ?? [];
  const flowStats = seriesStats(flowSeries);
  const flowChartData = (data?.series?.labels ?? []).map((label, i) => ({
    ts: label,
    value: flowSeries[i] ?? null,
  }));
  const flowCurrent = data?.flow ?? null;
  const flowFirst = flowSeries.find((v): v is number => v != null) ?? null;
  const flowDelta =
    flowCurrent != null && flowFirst != null ? flowCurrent - flowFirst : null;

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-[10px] animate-pulse"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {isError && (
        <div
          className="text-[.75rem] rounded-[8px] px-3 py-2"
          style={{
            background: 'rgba(255,84,104,.08)',
            border: '1px solid rgba(255,84,104,.3)',
            color: 'var(--alarm)',
          }}
        >
          Unable to reach API — showing last cached values.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
        <PanelShell title="Pressure">
          <div className="flex justify-between gap-[6px]">
            <RadialGauge
              value={data?.pt100_1 ?? null}
              min={0}
              max={150}
              unit="PSI"
              label="PT‑1"
              sublabel="System Pressure"
              decimals={1}
            />
            <RadialGauge
              value={data?.pt100_2 ?? null}
              min={0}
              max={50}
              unit="PSI"
              label="PT‑2"
              sublabel="Process Pressure"
              decimals={1}
            />
          </div>
        </PanelShell>

        <PanelShell title="Water Quality">
          <div className="grid grid-cols-2 gap-[8px]">
            <LcdCard label="pH" value={fmt(data?.ph, 2)} variant="accent" />
            <LcdCard
              label="ORP"
              value={fmtSigned(data?.orp, 0)}
              unit="mV"
              variant="accent"
            />
            <LcdCard
              label="TDS"
              value={fmt(data?.tds, 0)}
              unit="ppm"
              variant="accent"
            />
            <LcdCard
              label="DO"
              value={fmt(data?.do_val, 2)}
              unit="mg/L"
              variant="accent"
            />
          </div>
        </PanelShell>

        <PanelShell title="Process Readouts">
          <div className="grid grid-cols-2 gap-[8px]">
            <LcdCard
              label="Flow Sensor"
              value={fmt(data?.flow, 1)}
              unit="GPM"
              variant="good"
            />
            <LcdCard
              label="Total Flow"
              value={fmt(data?.total_flow_mg, 1)}
              unit="MG"
              variant="good"
            />
            <LcdCard
              label="Process Hours"
              value={fmtProcessHour(data?.process_hour)}
              variant="good"
            />
            <LcdCard
              label="Last Updated"
              value={data?.created_at?.slice(11, 19) ?? '—'}
              variant="good"
            />
          </div>
        </PanelShell>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
        <PanelShell title="Tank Levels / Process Tank">
          <div className="flex gap-4 items-stretch">
            <TankCapsule name="Tank Level" pct={data?.tank_level ?? null} variant="bento" />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div
                    className="font-grotesk text-[.72rem] font-semibold tracking-[.08em] uppercase"
                    style={{ color: '#ffffff' }}
                  >
                    Process Tank
                  </div>
                  <div className="flex items-baseline gap-1 mt-[2px]">
                    <span className="font-mono text-[1.15rem] font-semibold" style={{ color: 'var(--text-hi)' }}>
                      {fmt(tankCurrent, 1)}
                      <span className="text-[.62rem] ml-[3px] font-sans" style={{ color: 'var(--text-mid)' }}>
                        %
                      </span>
                    </span>
                    {tankDelta != null && (
                      <span className={`text-[.66rem] ${tankDeltaClass}`}>
                        {tankDeltaArrow} {Math.abs(tankDelta).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-[10px] text-right">
                  {(
                    [
                      ['MIN', tankStats.min],
                      ['MAX', tankStats.max],
                      ['AVG', tankStats.avg],
                    ] as [string, number | null][]
                  ).map(([stat, val]) => (
                    <div key={stat} className="flex flex-col">
                      <span className="text-[.56rem] tracking-[.06em]" style={{ color: '#ffffff' }}>
                        {stat}
                      </span>
                      <span className="font-mono text-[.7rem]" style={{ color: '#ffffff' }}>
                        {fmt(val, 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-[88px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tankChartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="ts" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-panel-alt)',
                        border: '1px solid var(--line)',
                        borderRadius: 6,
                        fontSize: '0.7rem',
                        color: 'var(--text-hi)',
                      }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(v: any) => [typeof v === 'number' ? v.toFixed(1) : '—', 'Tank']}
                    />
                    <Line
                      type="basis"
                      dataKey="value"
                      stroke="var(--accent)"
                      strokeWidth={1.8}
                      dot={false}
                      isAnimationActive={false}
                      connectNulls
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[.62rem] mt-1" style={{ color: 'var(--text-low)' }}>
                15-min avg · 12h
              </div>
            </div>
          </div>
        </PanelShell>

        <PanelShell title="Flow Sensor">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-mono text-[1.35rem] font-semibold" style={{ color: 'var(--text-hi)' }}>
                {fmt(flowCurrent, 1)}
                <span className="text-[.7rem] ml-1 font-sans" style={{ color: 'var(--text-mid)' }}>
                  GPM
                </span>
              </div>
              {flowDelta != null && (
                <span
                  className={`text-[.66rem] ${
                    flowDelta >= 0 ? 'text-[var(--good)]' : 'text-[var(--alarm)]'
                  }`}
                >
                  {flowDelta >= 0 ? '▲' : '▼'} {Math.abs(flowDelta).toFixed(1)}
                </span>
              )}
            </div>
            <div className="flex gap-[10px] text-right">
              {(
                [
                  ['MIN', flowStats.min],
                  ['MAX', flowStats.max],
                  ['AVG', flowStats.avg],
                ] as [string, number | null][]
              ).map(([stat, val]) => (
                <div key={stat} className="flex flex-col">
                  <span className="text-[.56rem] tracking-[.06em]" style={{ color: '#ffffff' }}>
                    {stat}
                  </span>
                  <span className="font-mono text-[.7rem]" style={{ color: '#ffffff' }}>
                    {fmt(val, 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[88px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flowChartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="ts" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-panel-alt)',
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    color: 'var(--text-hi)',
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [typeof v === 'number' ? v.toFixed(1) : '—', 'Flow']}
                />
                <Line
                  type="basis"
                  dataKey="value"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[.62rem] mt-1" style={{ color: 'var(--text-low)' }}>
            15-min avg · 12h
          </div>
        </PanelShell>

        <PanelShell title="Electrical Panels" note="PS1–PS3">
          <div className="flex flex-col gap-[8px]">
            <ElectricalPanelTile
              panel="PS1"
              voltage={data?.ps1_voltage ?? null}
              current={data?.ps1_current ?? null}
            />
            <ElectricalPanelTile
              panel="PS2"
              voltage={data?.ps2_voltage ?? null}
              current={data?.ps2_current ?? null}
            />
            <ElectricalPanelTile
              panel="PS3"
              voltage={data?.ps3_voltage ?? null}
              current={data?.ps3_current ?? null}
            />
          </div>
        </PanelShell>
      </div>
    </>
  );
}
