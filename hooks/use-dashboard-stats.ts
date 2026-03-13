import { useQuery } from '@tanstack/react-query';
import { dashboardApi, DashboardPeriod, DashboardStatsResponse } from '@/lib/dashboard-api';
import { queryKeys } from '@/lib/query-keys';

/**
 * Fetches dashboard statistics from GET /api/v1/dashboard/stats?period=<period>.
 * Data is cached for 60 s and re-fetched on window focus.
 *
 * @param period  '7d' | '30d' | '90d' | 'year'  (default: '30d')
 */
export function useDashboardStats(period: DashboardPeriod = '30d') {
    return useQuery<DashboardStatsResponse>({
        queryKey: queryKeys.dashboard.stats(period),
        queryFn: () => dashboardApi.getStats(period),
        staleTime: 60_000,          // 1 minute — acceptable for an analytics dashboard
        refetchOnWindowFocus: true,
        retry: 2,
    });
}
