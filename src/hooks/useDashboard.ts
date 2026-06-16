'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { DashboardSnapshot } from '@/types/dashboard';

const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export function useDashboard() {
  return useQuery<DashboardSnapshot>({
    queryKey: ['dashboard'],
    queryFn: () => apiGet<DashboardSnapshot>('data.php'),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: POLL_INTERVAL_MS,
    retry: 2,
  });
}
