'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Header } from '@/components/dashboard/Header';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ElectricalCard } from '@/components/dashboard/ElectricalCard';
import { StatusAlerts } from '@/components/dashboard/StatusAlerts';
import { SensorDrawer } from '@/components/dashboard/SensorDrawer';
import { MiniSparkline } from '@/components/dashboard/MiniSparkline';
import { Skeleton } from '@/components/ui/skeleton';
import type { SensorKey, SensorMeta } from '@/types/dashboard';
import { SENSOR_META } from '@/types/dashboard';

interface DrawerState {
  sensor: SensorKey;
  meta: SensorMeta;
  currentValue: number | null;
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();
  const [drawer, setDrawer] = useState<DrawerState | null>(null);

  const openDrawer = (sensor: SensorKey, currentValue: number | null) => {
    setDrawer({ sensor, meta: SENSOR_META[sensor], currentValue });
  };

  const series = data?.series;
  const labels = series?.labels ?? [];

  const isProcessOn = data ? (data.pt100_2 !== null && data.pt100_2 >= 5) : false;
  const isDataDelayed = isError;

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header isProcessOn={false} isDataDelayed={false} />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div>
            <Skeleton className="h-9 w-80 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header isProcessOn={isProcessOn} isDataDelayed={isDataDelayed} />

      <main className="container mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            IndianTown STP Water Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Last Updated:{' '}
            <span className="font-medium text-gray-700">
              {data?.created_at ?? '—'}
            </span>
          </p>
        </div>

        {/* Alerts */}
        {data && (
          <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
            <StatusAlerts data={data} />
          </div>
        )}

        {/* ── KPIs ──────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Key Performance Indicators
          </h2>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
            {/* Total Flow — not clickable */}
            <KpiCard
              label="Total Flow"
              value={data?.total_flow_mg ?? null}
              unit="GPM"
              precision={1}
              series={series?.total_flow_mg ?? []}
              color="#0ea5e9"
              fill="#0ea5e920"
            />

            {/* pH — clickable */}
            <KpiCard
              label="pH Level"
              value={data?.ph ?? null}
              precision={2}
              series={series?.ph ?? []}
              color={SENSOR_META.ph.color}
              fill={SENSOR_META.ph.fill}
              clickable
              onClick={() => openDrawer('ph', data?.ph ?? null)}
            />

            {/* TDS — clickable */}
            <KpiCard
              label="TDS"
              value={data?.tds ?? null}
              unit="ppm"
              precision={0}
              series={series?.tds ?? []}
              color={SENSOR_META.tds.color}
              fill={SENSOR_META.tds.fill}
              clickable
              onClick={() => openDrawer('tds', data?.tds ?? null)}
            />

            {/* ORP — clickable */}
            <KpiCard
              label="ORP"
              value={data?.orp ?? null}
              unit="mV"
              precision={0}
              series={series?.orp ?? []}
              color={SENSOR_META.orp.color}
              fill={SENSOR_META.orp.fill}
              clickable
              onClick={() => openDrawer('orp', data?.orp ?? null)}
            />
          </div>
        </section>

        {/* ── Water Quality ─────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Water Quality
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {/* DO — clickable */}
            <button
              onClick={() => openDrawer('do_val', data?.do_val ?? null)}
              className="text-left"
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full">
                <p className="text-sm font-medium text-gray-500 mb-3">
                  Dissolved Oxygen
                </p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {data?.do_val == null ? '—' : Number(data.do_val).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1.5">mg/L</span>
                </div>
                <div className="h-16">
                  <MiniSparkline
                    data={series?.do_val ?? []}
                    color={SENSOR_META.do_val.color}
                  />
                </div>
              </div>
            </button>

            {/* Tank Level — not clickable */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-3">
                Tank Level
              </p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {data?.tank_level == null ? '—' : Number(data.tank_level).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1.5">%</span>
              </div>
              <div className="h-16">
                <MiniSparkline
                  data={series?.tank_level ?? []}
                  color="#0ea5e9"
                />
              </div>
            </div>

            {/* PT1 — clickable */}
            <button
              onClick={() => openDrawer('pt100_1', data?.pt100_1 ?? null)}
              className="text-left"
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full">
                <p className="text-sm font-medium text-gray-500 mb-3">PT1</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {data?.pt100_1 == null ? '—' : Number(data.pt100_1).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1.5">°PSI</span>
                </div>
                <div className="h-16">
                  <MiniSparkline
                    data={series?.pt100_1 ?? []}
                    color={SENSOR_META.pt100_1.color}
                  />
                </div>
              </div>
            </button>

            {/* PT2 — clickable */}
            <button
              onClick={() => openDrawer('pt100_2', data?.pt100_2 ?? null)}
              className="text-left"
            >
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full">
                <p className="text-sm font-medium text-gray-500 mb-3">PT2</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {data?.pt100_2 == null ? '—' : Number(data.pt100_2).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1.5">°PSI</span>
                </div>
                <div className="h-16">
                  <MiniSparkline
                    data={series?.pt100_2 ?? []}
                    color={SENSOR_META.pt100_2.color}
                  />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* ── Electrical Panels ─────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Electrical Panels
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ElectricalCard label="PS1 Voltage" value={data?.ps1_voltage ?? null} unit="V" series={series?.ps1_voltage ?? []} labels={labels} color="#0ea5e9" />
            <ElectricalCard label="PS1 Current" value={data?.ps1_current ?? null} unit="A" series={series?.ps1_current ?? []} labels={labels} color="#10b981" />
            <ElectricalCard label="PS2 Voltage" value={data?.ps2_voltage ?? null} unit="V" series={series?.ps2_voltage ?? []} labels={labels} color="#0ea5e9" />
            <ElectricalCard label="PS2 Current" value={data?.ps2_current ?? null} unit="A" series={series?.ps2_current ?? []} labels={labels} color="#10b981" />
            <ElectricalCard label="PS3 Voltage" value={data?.ps3_voltage ?? null} unit="V" series={series?.ps3_voltage ?? []} labels={labels} color="#0ea5e9" />
            <ElectricalCard label="PS3 Current" value={data?.ps3_current ?? null} unit="A" series={series?.ps3_current ?? []} labels={labels} color="#10b981" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 IndianTown Water Monitoring System. All rights reserved.
        </div>
      </footer>

      {/* Sensor detail drawer */}
      <SensorDrawer
        sensor={drawer?.sensor ?? null}
        meta={drawer?.meta ?? null}
        currentValue={drawer?.currentValue ?? null}
        open={drawer !== null}
        onClose={() => setDrawer(null)}
      />
    </div>
  );
}
