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
        list: () => [...queryKeys.leads.all, 'list'] as const,
        detail: (id: string) => [...queryKeys.leads.all, 'detail', id] as const,
    },
    campaigns: {
        all: ['campaigns'] as const,
        list: () => [...queryKeys.campaigns.all, 'list'] as const,
    },
    feeds: {
        all: ['feeds'] as const,
        list: () => [...queryKeys.feeds.all, 'list'] as const,
    },
} as const;

