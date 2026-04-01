import { apiFetch } from './http-client';
import { Activity } from './types';

export interface ActivityApiResponse {
    id: string;
    leadId: string | null;
    userId: string | null;
    type: Activity['type'];
    description: string | null;
    timestamp: string;
    user?: { id: string; username?: string | null; avatar?: string | null } | null;
}

export interface CreateActivityPayload {
    leadId: string;
    userId?: string;
    type: Activity['type'];
    description?: string;
}

export interface ActivitiesPageResponse {
    data: ActivityApiResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

function mapActivity(raw: ActivityApiResponse): Activity {
    return {
        id: raw.id,
        leadId: raw.leadId ?? '',
        userId: raw.userId ?? 'system',
        type: raw.type,
        description: raw.description ?? '',
        timestamp: raw.timestamp,
    };
}

export const activitiesApi = {
    /**
     * GET /api/v1/activities?leadId=xxx&page=1&pageSize=50
     * Activity timeline for a specific lead.
     */
    getByLead: async (leadId: string, page = 1, pageSize = 50): Promise<Activity[]> => {
        const qs = new URLSearchParams({
            leadId,
            page: String(page),
            pageSize: String(pageSize),
        });
        const res = await apiFetch<ActivitiesPageResponse>(`/activities?${qs}`);
        return res.data.map(mapActivity);
    },

    /**
     * POST /api/v1/activities
     * Manually log a note, call, WhatsApp etc.
     */
    create: async (payload: CreateActivityPayload): Promise<Activity> => {
        const raw = await apiFetch<ActivityApiResponse>('/activities', {
            method: 'POST',
            body: payload,
        });
        return mapActivity(raw);
    },
};
