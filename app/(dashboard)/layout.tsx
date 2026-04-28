import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Role } from '@/lib/types'
import { decodeJwt } from '@/lib/utils'

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value ?? null
    
    if (!token) {
        redirect('/login')
    }

    const decoded = decodeJwt(token)
    
    if (!decoded) {
        redirect('/login')
    }

    if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
            redirect('/login')
        }
    }

    const role = (decoded?.role ?? 'executive') as Role

    return <DashboardLayout userRole={role}>{children}</DashboardLayout>
}
