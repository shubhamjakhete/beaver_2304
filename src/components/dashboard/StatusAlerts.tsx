'use client';

import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { DashboardSnapshot } from '@/types/dashboard';

interface Alert {
  message: string;
  severity: 'critical' | 'warning';
}

function buildAlerts(d: DashboardSnapshot): Alert[] {
  const alerts: Alert[] = [];

  if (d.ph !== null) {
    if (d.ph < 6.5 || d.ph > 8.5)
      alerts.push({ message: `pH ${d.ph.toFixed(2)} is outside normal range (6.5 – 8.5)`, severity: 'warning' });
  }
  if (d.tds !== null && d.tds > 500)
    alerts.push({ message: `TDS ${d.tds.toFixed(0)} ppm exceeds threshold (500 ppm)`, severity: 'warning' });
  if (d.orp !== null && d.orp < 200)
    alerts.push({ message: `ORP ${d.orp.toFixed(0)} mV is below threshold (200 mV)`, severity: 'warning' });
  if (d.do_val !== null && d.do_val < 5)
    alerts.push({ message: `Dissolved oxygen ${d.do_val.toFixed(2)} mg/L is below threshold (5 mg/L)`, severity: 'critical' });
  if (d.tank_level !== null && d.tank_level < 20)
    alerts.push({ message: `Tank level ${d.tank_level.toFixed(1)}% is critically low`, severity: 'critical' });

  return alerts;
}

interface StatusAlertsProps {
  data: DashboardSnapshot;
}

export function StatusAlerts({ data }: StatusAlertsProps) {
  const alerts = buildAlerts(data);

  if (!alerts.length) {
    return (
      <div className="flex items-center space-x-2 text-green-700">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">All systems normal</span>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {alerts.map((a, i) => (
        <li key={i} className={`flex items-start space-x-2 text-sm ${
          a.severity === 'critical' ? 'text-red-700' : 'text-yellow-700'
        }`}>
          {a.severity === 'critical' ? (
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          <span>{a.message}</span>
        </li>
      ))}
    </ul>
  );
}
