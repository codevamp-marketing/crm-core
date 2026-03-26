import { apiFetch } from './http-client';
import { Lead, PipelineStage } from './types';

/**
 * Raw shape returned by crm-core-server (Prisma output).
 * Field names match the schema exactly.
 */
export interface LeadApiResponse {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    course?: string | null;
    specialization?: string | null;
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
    qualificationStatus?: string | null;
    pipelineStage?: string | null;
    dealValue?: number;
    type?: string | null;
    nextFollowUp?: string | null;
    owner?: { id: string; username?: string | null; avatar?: string | null } | null;
}

/** Paginated response shape for GET /get-all-leads */
export interface LeadsPageResponse {
    data: LeadApiResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

function mapLead(raw: LeadApiResponse): Lead {
    return {
        id: raw.id,
        name: raw.name ?? 'Unknown',
        email: raw.email ?? '',
        phone: raw.phone ?? '',
        course: raw.course ?? '',
        specialization: raw.specialization ?? undefined,
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
        qualificationStatus: (raw.qualificationStatus as Lead['qualificationStatus']) ?? 'New_Lead',
        pipelineStage: (raw.pipelineStage as Lead['pipelineStage']) ?? 'New_Lead',
        type: (raw.type as Lead['type']) ?? 'Cold',
        dealValue: raw.dealValue ?? 0,
        nextFollowUp: raw.nextFollowUp ?? undefined,
        owner: raw.owner ?? null,
    };
}

export interface GetAllLeadsParams {
    page?: number;
    pageSize?: number;
    stage?: PipelineStage;
    source?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const leadsApi = {
    /**
     * GET /api/v1/get-all-leads
     * Returns paginated leads. Without params: page=1, pageSize=50.
     */
    getAll: async (params?: GetAllLeadsParams): Promise<{ leads: Lead[]; total: number; totalPages: number }> => {
        const qs = new URLSearchParams();
        if (params?.page) qs.set('page', String(params.page));
        if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
        if (params?.stage) qs.set('stage', params.stage);
        if (params?.source) qs.set('source', params.source);
        if (params?.type) qs.set('type', params.type);
        if (params?.search) qs.set('search', params.search);
        if (params?.sortBy) qs.set('sortBy', params.sortBy);
        if (params?.sortOrder) qs.set('sortOrder', params.sortOrder);

        const query = qs.toString() ? `?${qs.toString()}` : '';
        const res = await apiFetch<LeadsPageResponse>(`/get-all-leads${query}`);
        return {
            leads: res.data.map(mapLead),
            total: res.total,
            totalPages: res.totalPages,
        };
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
     * General-purpose update (AI agent, edit form).
     */
    update: async (id: string, payload: Partial<LeadApiResponse>): Promise<Lead> => {
        const data = await apiFetch<LeadApiResponse>(`/update-lead/${id}`, {
            method: 'PATCH',
            body: payload,
        });
        return mapLead(data);
    },

    /**
     * PATCH /api/v1/leads/:id/stage
     * Dedicated Kanban drag-end — moves the lead to a new pipeline stage.
     */
    moveStage: async (id: string, stage: PipelineStage): Promise<Lead> => {
        const data = await apiFetch<LeadApiResponse>(`/leads/${id}/stage`, {
            method: 'PATCH',
            body: { stage },
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
