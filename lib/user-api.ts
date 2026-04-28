import { apiFetch } from './http-client';
import { User } from './types';

/** Fields an executive is allowed to update on their own profile */
export interface UpdateProfilePayload {
    username?: string;
    email?: string;
    password?: string;
    contact?: string;
    designation?: string;
    gender?: 'male' | 'female' | 'other';
    // role / status are intentionally excluded — executive cannot change these
}

export const userApi = {
    /**
     * GET /api/v1/get-user-by-id/:userId
     * Returns the safe user object (no password).
     */
    getById: (userId: string): Promise<User> =>
        apiFetch<User>(`/get-user-by-id/${userId}`),

    /**
     * PATCH /api/v1/update-user/:userId
     * Updates only safe, executive-visible fields.
     * role / status / email / password are intentionally excluded from this payload.
     */
    updateById: (userId: string, payload: UpdateProfilePayload): Promise<User> =>
        apiFetch<User>(`/update-user/${userId}`, {
            method: 'PATCH',
            body: payload,
        }),
};
