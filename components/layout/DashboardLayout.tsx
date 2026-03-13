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
  userRole?: Role
}

const navigationConfig = {
  admin: [
    { title: "Marketing Hub", url: navigationPaths.dashboard, icon: LayoutDashboard },
    { title: "Content Feeds", url: navigationPaths.feeds, icon: FileText },
    { title: "Leads", url: navigationPaths.leads, icon: Users },
    { title: "Pipeline", url: navigationPaths.kanban, icon: TrendingUp },
    { title: "AI Campaigns", url: navigationPaths.aiCampaigns, icon: Rocket },
    { title: "Analytics", url: navigationPaths.reports, icon: BarChart3 },
    { title: "Settings", url: navigationPaths.settings, icon: Settings },
  ],
  manager: [
    { title: "Marketing Hub", url: navigationPaths.dashboard, icon: LayoutDashboard },
    { title: "Content Feeds", url: navigationPaths.feeds, icon: FileText },
    { title: "Leads", url: navigationPaths.leads, icon: Users },
    { title: "Pipeline", url: navigationPaths.kanban, icon: TrendingUp },
    { title: "AI Campaigns", url: navigationPaths.aiCampaigns, icon: Rocket },
    { title: "Analytics", url: navigationPaths.reports, icon: BarChart3 },
    { title: "Settings", url: navigationPaths.settings, icon: Settings },
  ],
  executive: [
    { title: "Marketing Hub", url: navigationPaths.dashboard, icon: LayoutDashboard },
    { title: "Content Feeds", url: navigationPaths.feeds, icon: FileText },
    { title: "Leads", url: navigationPaths.leads, icon: Users },
    { title: "Pipeline", url: navigationPaths.kanban, icon: TrendingUp },
    { title: "AI Campaigns", url: navigationPaths.aiCampaigns, icon: Rocket },
  ]
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const logout = useLogout()
  const token = getCookie("token")
  const decoded = decodeJwt(token)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const displayName = decoded?.username || decoded?.email || 'User'
  const roleLabel = userRole
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
    : 'Admin'
  const initials = (displayName as string)
    .split(' ')
    .map((s: string) => s.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const navItems = navigationConfig[userRole || 'admin']

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden text-[var(--text-primary)]">

      {/* ───── Sidebar ───── */}
      <aside className={clsx(
        "bg-[var(--bg-card)] border-r border-[var(--border-subtle)] flex flex-col fixed inset-y-0 left-0 z-30",
        "shadow-[2px_0_8px_rgba(0,0,0,0.06)] transition-[width] duration-200 ease-linear overflow-hidden",
        sidebarOpen ? "w-64" : "w-0 md:w-14"
      )}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 shrink-0">
          <div className="w-8 h-8 bg-[var(--text-primary)] rounded-lg flex items-center justify-center shadow-sm shrink-0">
            <span className="text-[var(--bg-card)] font-bold text-sm">N</span>
          </div>
          {sidebarOpen && (
            <span className="text-base font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
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
                    ? "bg-zinc-100 dark:bg-zinc-800 text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[var(--text-primary)]"
                )}
              >
                <item.icon className={clsx(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                )} />
                {sidebarOpen && <span className="truncate">{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Footer — qdmx style */}
        <div className="p-3 border-t border-[var(--border-subtle)] shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={clsx(
                "w-full flex items-center gap-3 px-2 py-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
                !sidebarOpen && "justify-center"
              )}>
                <Avatar className="h-8 w-8 rounded-full shrink-0">
                  <AvatarFallback className="rounded-full bg-zinc-200 dark:bg-zinc-700 text-[var(--text-primary)] text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{displayName as string}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{roleLabel as string}</p>
                  </div>
                )}
                {sidebarOpen && <ChevronUp className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />}
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

        {/* Header */}
        <header className="h-16 flex items-center justify-between gap-4 px-6 sticky top-0 z-20 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className="relative w-full group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--text-primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/10 transition-all"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[var(--bg-card)]" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
