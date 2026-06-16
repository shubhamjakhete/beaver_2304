'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { SensorHistoryResponse, SensorKey, HistoryPeriod } from '@/types/dashboard';

export function useSensorHistory(
  sensor: SensorKey | null,
  period: HistoryPeriod,
) {
  return useQuery<SensorHistoryResponse>({
    queryKey: ['sensor-history', sensor, period],
    queryFn: () =>
      apiGet<SensorHistoryResponse>('sensor_history.php', {
        sensor: sensor!,
        period,
      }),
    enabled: sensor !== null,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
