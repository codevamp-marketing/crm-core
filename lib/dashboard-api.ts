import { apiFetch } from './http-client';

// ─── Response shape mirroring DashboardStats from the server ─────────────────

export interface ChartPoint {
    name: string;
    value: number;
}

export interface CampaignPerformancePoint {
    name: string;
    roi: number;
}

export interface DashboardStatsResponse {
    // Stat cards
    avgCampaignRoi: number;
    aiLeadQualityScore: number;
    totalAdSpend: number;
    predictedFeeRevenue: number;

    // Trend deltas (percentage vs previous period)
    roiDelta: number;
    scoreDelta: number;
    spendDelta: number;
    revenueDelta: number;

    // Charts
    revenueTrend: ChartPoint[];
    funnelData: ChartPoint[];
    campaignPerformance: CampaignPerformancePoint[];
    sourceBreakdown: ChartPoint[];
}

export type DashboardPeriod = '7d' | '30d' | '90d' | 'year';

// ─── API call ─────────────────────────────────────────────────────────────────

export const dashboardApi = {
    /**
     * GET /api/v1/dashboard/stats?period=30d
     * Requires a valid JWT token (sent automatically by apiFetch).
     */
    getStats: (period: DashboardPeriod = '30d'): Promise<DashboardStatsResponse> =>
        apiFetch<DashboardStatsResponse>(`/dashboard/stats?period=${period}`),
};
