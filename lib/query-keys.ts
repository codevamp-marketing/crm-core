/**
 * Centralised React Query key factory.
 * Keeps cache keys consistent and easy to invalidate.
 */
export const queryKeys = {
    auth: {
        session: ['auth', 'session'] as const,
    },
    leads: {
        all: ['leads'] as const,
        list: (params?: unknown) => [...queryKeys.leads.all, 'list', params ?? {}] as const,
        detail: (id: string) => [...queryKeys.leads.all, 'detail', id] as const,
    },
    activities: {
        all: ['activities'] as const,
        byLead: (leadId: string) => [...queryKeys.activities.all, 'lead', leadId] as const,
    },
    campaigns: {
        all: ['campaigns'] as const,
        list: () => [...queryKeys.campaigns.all, 'list'] as const,
    },
    feeds: {
        all: ['feeds'] as const,
        list: () => [...queryKeys.feeds.all, 'list'] as const,
    },
    dashboard: {
        all: ['dashboard'] as const,
        stats: (period: string) => [...queryKeys.dashboard.all, 'stats', period] as const,
    },
    users: {
        all: ['users'] as const,
        profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
    },
} as const;
