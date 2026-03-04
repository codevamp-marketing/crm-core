import { Role } from './types';

/* ── Role → allowed route prefixes ──────────────────────────────────────────
 * Add any new protected route prefix here as the app grows.
 * Middleware and the DashboardLayout both consume this config.
 * ─────────────────────────────────────────────────────────────────────────── */
export const ROLE_ALLOWED_PATHS: Record<Role, string[]> = {
    admin: [
        '/dashboard',
        '/leads',
        '/feeds',
        '/kanban',
        '/ai-campaigns',
        '/reports',
        '/settings',
    ],
    manager: [
        '/dashboard',
        '/leads',
        '/feeds',
        '/kanban',
        '/ai-campaigns',
        '/reports',
        '/settings',
    ],
    executive: [
        '/dashboard',
        '/leads',
        '/feeds',
        '/kanban',
        '/ai-campaigns',
        // executives do NOT have /reports or /settings by default
    ],
};

/** All routes that require authentication (used by middleware matcher). */
export const PROTECTED_PREFIXES = [
    '/dashboard',
    '/leads',
    '/feeds',
    '/kanban',
    '/ai-campaigns',
    '/reports',
    '/settings',
];

/** Returns the landing path for a given role after login. */
export function getRoleDashboardPath(role: Role | string | null | undefined): string {
    // All roles land on /dashboard for now; extend this to give each role a
    // unique starting page if required (e.g. executive → /leads).
    switch (role) {
        case 'admin':
            return '/dashboard';
        case 'manager':
            return '/dashboard';
        case 'executive':
            return '/dashboard';
        default:
            return '/login';
    }
}

/**
 * Returns true if the given role is allowed to access the pathname.
 * Falls back to false for unknown roles.
 */
export function isAllowedForRole(
    role: Role | string | null | undefined,
    pathname: string,
): boolean {
    if (!role || !(role in ROLE_ALLOWED_PATHS)) return false;
    const allowed = ROLE_ALLOWED_PATHS[role as Role];
    return allowed.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}
