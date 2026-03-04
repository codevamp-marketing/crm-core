import { NextRequest, NextResponse } from 'next/server';
import { getRoleDashboardPath, isAllowedForRole } from '@/lib/rbac';

/* ── Lightweight JWT decoder (Edge-safe, no Node.js APIs) ────────────────── */
function decodeJwtEdge(token: string): Record<string, any> | null {
    try {
        const base64 = token.split('.')[1];
        if (!base64) return null;
        // atob is available in the Edge runtime
        const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/* ── Middleware ──────────────────────────────────────────────────────────── */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Read the auth token from cookies
    const token = request.cookies.get('token')?.value;

    // ── 1. No token at all → send to login ───────────────────────────────────
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname); // preserve original URL
        return NextResponse.redirect(loginUrl);
    }

    // ── 2. Decode token to extract role ──────────────────────────────────────
    const decoded = decodeJwtEdge(token);
    const role = decoded?.role as string | undefined;

    // If token is malformed or has no role → send to login
    if (!role) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // ── 3. RBAC check — is this role allowed on this path? ───────────────────
    if (!isAllowedForRole(role, pathname)) {
        // Redirect to the role's own dashboard instead of a 403
        const dashboardUrl = new URL(getRoleDashboardPath(role), request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // ── 4. All checks passed — allow through ─────────────────────────────────
    return NextResponse.next();
}

/* ── Matcher — only run middleware on protected routes ──────────────────── */
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/leads/:path*',
        '/feeds/:path*',
        '/kanban/:path*',
        '/ai-campaigns/:path*',
        '/reports/:path*',
        '/settings/:path*',
    ],
};
