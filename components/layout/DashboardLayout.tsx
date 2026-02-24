"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Settings,
  Users,
  BarChart3,
  Bell,
  LogOut,
  User,
  Search,
  Rocket,
  PanelLeft,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

import { Role } from '@/lib/types'
import { useLogout } from '@/lib/logout'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { navigationPaths } from '@/lib/navigation'
import { getCookie, decodeJwt } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: Role | string
}

const navItems = [
  { title: "Marketing Hub", url: navigationPaths.dashboard, icon: LayoutDashboard },
  { title: "Content Feeds", url: navigationPaths.feeds, icon: FileText },
  { title: "Leads", url: navigationPaths.leads, icon: Users },
  { title: "Pipeline", url: navigationPaths.kanban, icon: TrendingUp },
  { title: "AI Campaigns", url: navigationPaths.aiCampaigns, icon: Rocket },
  { title: "Analytics", url: navigationPaths.reports, icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const logout = useLogout()
  const token = getCookie("token")
  const decoded = decodeJwt(token)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const displayName = decoded?.username || decoded?.email || 'Dr. Amit Sharma'
  const roleLabel = userRole || 'Admin'
  const initials = (displayName as string)
    .split(' ')
    .map((s: string) => s.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden text-zinc-900">

      {/* ───── Sidebar ───── */}
      <aside className={clsx(
        "bg-white border-r border-zinc-100 flex flex-col fixed inset-y-0 left-0 z-30",
        "shadow-[2px_0_8px_rgba(0,0,0,0.06)] transition-[width] duration-200 ease-linear overflow-hidden",
        sidebarOpen ? "w-64" : "w-0 md:w-14"
      )}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 shrink-0">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          {sidebarOpen && (
            <span className="text-base font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              Nexus AI
            </span>
          )}
        </div>

        {/* Nav items — exact qdmx style */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.url ||
              (item.url !== '/' && item.url !== '/dashboard' && pathname.startsWith(item.url)) ||
              (pathname === '/dashboard' && item.url === navigationPaths.dashboard)
            return (
              <Link
                key={item.url}
                href={item.url}
                title={!sidebarOpen ? item.title : undefined}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <item.icon className={clsx(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-zinc-700" : "text-zinc-400"
                )} />
                {sidebarOpen && <span className="truncate">{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Footer — qdmx style */}
        <div className="p-3 border-t border-zinc-100 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={clsx(
                "w-full flex items-center gap-3 px-2 py-2 rounded-lg",
                "hover:bg-zinc-50 transition-colors cursor-pointer",
                !sidebarOpen && "justify-center"
              )}>
                <Avatar className="h-8 w-8 rounded-full shrink-0">
                  <AvatarFallback className="rounded-full bg-zinc-200 text-zinc-700 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{displayName as string}</p>
                    <p className="text-xs text-zinc-500 truncate">{roleLabel as string}</p>
                  </div>
                )}
                {sidebarOpen && <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-lg" side="top" align="end" sideOffset={4}>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()} className="text-rose-600 focus:text-rose-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <div className={clsx(
        "flex flex-col flex-1 min-w-0 transition-[margin-left] duration-200 ease-linear",
        sidebarOpen ? "ml-64" : "ml-0 md:ml-14"
      )}>

        {/* Header — matches qdmx exactly */}
        <header className="h-16 flex items-center justify-between gap-4 px-6 sticky top-0 z-20 bg-white border-b border-zinc-100 shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className="relative w-full group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
              <input
                type="text"
                placeholder="Search (Cmd+K)"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border-none text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <button className="relative p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
