import { NextRequest, NextResponse } from 'next/server';
import { getRoleDashboardPath, isAllowedForRole } from '@/lib/rbac';
import { decodeJwt } from '@/lib/utils';

/* ── Proxy ───────────────────────────────────────────────────────────────── */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Read the auth token from cookies
    const token = request.cookies.get('token')?.value;

    // ── 1. No token at all → send to login ───────────────────────────────────
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname); // preserve original URL
        return NextResponse.redirect(loginUrl);
    }

    // ── 2. Decode token to extract role and check expiration ─────────────────
    const decoded = decodeJwt(token);
    
    if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

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

/* ── Matcher — only run on protected routes ─────────────────────────────── */
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
