import { apiFetch } from './http-client';
import { Lead } from './types';

/**
 * Raw API shape returned by crm-core-server.
 * The server uses snake_case / Prisma naming so we map to the
 * frontend Lead type after fetching.
 */
export interface LeadApiResponse {
    id: string;
    name?: string | null;
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    source?: string | null;
    campaign?: string | null;
    tags?: string[];
    score?: number;
    aiScore?: number;
    predictedLTV?: number;
    nextBestAction?: string | null;
    ownerId?: string | null;
    createdAt?: string;
    lastInteraction?: string;
    status?: string | null;
    dealValue?: number;
    stage?: string | null;
    priority?: string | null;
    nextFollowUp?: string | null;
    course?: string | null;
}

/**
 * Map a raw server response to the frontend Lead type.
 */
function mapLead(raw: LeadApiResponse): Lead {
    return {
        id: raw.id,
        name: raw.name ?? 'Unknown',
        company: raw.company ?? raw.course ?? '',
        email: raw.email ?? '',
        phone: raw.phone ?? '',
        source: (raw.source as Lead['source']) ?? 'Manual',
        campaign: raw.campaign ?? undefined,
        tags: raw.tags ?? [],
        score: raw.score ?? 0,
        aiScore: raw.aiScore ?? 0,
        predictedLTV: raw.predictedLTV ?? 0,
        nextBestAction: raw.nextBestAction ?? 'Follow up',
        ownerId: raw.ownerId ?? '',
        createdAt: raw.createdAt ?? new Date().toISOString(),
        lastInteraction: raw.lastInteraction ?? new Date().toISOString(),
        status: (raw.status as Lead['status']) ?? 'Lead',
        dealValue: raw.dealValue ?? 0,
        stage: (raw.stage as Lead['stage']) ?? 'New Lead',
        priority: (raw.priority as Lead['priority']) ?? 'Medium',
        nextFollowUp: raw.nextFollowUp ?? undefined,
    };
}

export const leadsApi = {
    /**
     * GET /api/v1/get-all-leads
     */
    getAll: async (): Promise<Lead[]> => {
        const data = await apiFetch<LeadApiResponse[]>('/get-all-leads');
        return data.map(mapLead);
    },

    /**
     * GET /api/v1/get-lead-by-id/:id
     */
    getById: async (id: string): Promise<Lead> => {
        const data = await apiFetch<LeadApiResponse>(`/get-lead-by-id/${id}`);
        return mapLead(data);
    },

    /**
     * POST /api/v1/create-lead
     */
    create: async (payload: Partial<LeadApiResponse>): Promise<Lead> => {
        const data = await apiFetch<LeadApiResponse>('/create-lead', {
            method: 'POST',
            body: payload,
        });
        return mapLead(data);
    },

    /**
     * PATCH /api/v1/update-lead/:id
     */
    update: async (id: string, payload: Partial<LeadApiResponse>): Promise<Lead> => {
        const data = await apiFetch<LeadApiResponse>(`/update-lead/${id}`, {
            method: 'PATCH',
            body: payload,
        });
        return mapLead(data);
    },

    /**
     * DELETE /api/v1/delete-lead-by-id/:id
     */
    delete: async (id: string): Promise<void> => {
        await apiFetch<void>(`/delete-lead-by-id/${id}`, { method: 'DELETE' });
    },
};
