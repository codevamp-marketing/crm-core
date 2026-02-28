import { apiFetch } from './http-client';
import { setCookie } from './utils';
import { CreateUserPayload, User } from './types';

/* ── Types ──────────────────────────────────────────────────── */
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    message?: string;
    user?: Omit<User, 'password'>;
}

/* ── Auth API ───────────────────────────────────────────────── */
export const authApi = {
    /**
     * POST /api/v1/login
     * Returns a JWT access_token on success.
     */
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        return apiFetch<LoginResponse>('/login', {
            method: 'POST',
            body: payload,
        });
    },

    /**
     * POST /api/v1/create-user
     * Creates a new user account and returns the safe user object (no password).
     */
    signup: async (payload: CreateUserPayload): Promise<User> => {
        return apiFetch<User>('/create-user', {
            method: 'POST',
            body: payload,
        });
    },

    /**
     * POST /api/v1/logout  (optional — clears server-side session if any)
     */
    logout: async (): Promise<void> => {
        await apiFetch<void>('/logout', { method: 'POST' }).catch(() => {
            // fire-and-forget — always clear client cookie
        });
        setCookie('token', '', -1); // expire the cookie
    },
};
