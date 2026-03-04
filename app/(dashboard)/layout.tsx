import React from 'react'
import { cookies } from 'next/headers'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Role } from '@/lib/types'

// Decode JWT payload server-side (no verification — claims only)
function decodeJwtServer(token: string): Record<string, any> | null {
    try {
        const base64 = token.split('.')[1]
        if (!base64) return null
        const json = Buffer.from(base64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
        return JSON.parse(json)
    } catch {
        return null
    }
}

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value ?? null
    const decoded = token ? decodeJwtServer(token) : null
    const role = (decoded?.role ?? 'executive') as Role

    return <DashboardLayout userRole={role}>{children}</DashboardLayout>
}
