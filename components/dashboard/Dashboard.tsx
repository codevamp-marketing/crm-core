'use client';

import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Target, Brain } from 'lucide-react';
import { clsx } from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import type { DashboardPeriod } from '@/lib/dashboard-api';

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ title, value, delta, icon: Icon }: {
    title: string;
    value: string;
    delta: number;
    icon: React.ElementType;
}) => {
    const trendUp = delta >= 0;
    const trend = `${Math.abs(delta)}%`;
    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-[var(--border-subtle)]">
                    <Icon className="w-5 h-5 text-[var(--text-primary)]" />
                </div>
                <span className={clsx(
                    "text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                    trendUp
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400"
                )}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </span>
            </div>
            <div>
                <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
            </div>
        </div>
    );
};

// ─── Skeleton state ───────────────────────────────────────────────────────────

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-36 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-subtle)] space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-11 w-11 rounded-xl" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)]">
                    <Skeleton className="h-6 w-64 mb-8" />
                    <Skeleton className="h-72 w-full rounded-xl" />
                </div>
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)]">
                    <Skeleton className="h-6 w-48 mb-8" />
                    <Skeleton className="h-72 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const COLORS = ['#18181B', '#52525B', '#71717A', '#A1A1AA', '#E4E4E7'];

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'This Quarter',
    'year': 'This Year',
};

export default function Dashboard() {
    const [period, setPeriod] = useState<DashboardPeriod>('30d');
    const { data, isLoading, isError } = useDashboardStats(period);

    if (isLoading) return <DashboardSkeleton />;

    if (isError || !data) {
        return (
            <div className="flex items-center justify-center h-64 text-[var(--text-secondary)]">
                <p>Could not load dashboard data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Admission Marketing Hub</h1>
                    <p className="text-[var(--text-secondary)] mt-1">AI-powered student admission insights &amp; performance metrics – Invertis University.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as DashboardPeriod)}
                        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                    >
                        {(Object.keys(PERIOD_LABELS) as DashboardPeriod[]).map((p) => (
                            <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Avg. Campaign ROI"
                    value={`${data.avgCampaignRoi.toFixed(1)}x`}
                    delta={data.roiDelta}
                    icon={TrendingUp}
                />
                <StatCard
                    title="AI Lead Quality Score"
                    value={`${data.aiLeadQualityScore}/100`}
                    delta={data.scoreDelta}
                    icon={Brain}
                />
                <StatCard
                    title="Total Ad Spend"
                    value={`₹${data.totalAdSpend.toLocaleString('en-IN')}`}
                    delta={data.spendDelta}
                    icon={DollarSign}
                />
                <StatCard
                    title="Predicted Fee Revenue"
                    value={`₹${data.predictedFeeRevenue.toLocaleString('en-IN')}`}
                    delta={data.revenueDelta}
                    icon={Target}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Forecast */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Enrollment Revenue Forecast</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                            <span className="text-xs text-[var(--text-secondary)]">Deal Value</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181B" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#18181B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                                    formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel Analysis */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8">Admission Funnel Conversion</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.funnelData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-subtle)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12, fontWeight: 500 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24}>
                                    {data.funnelData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Performance */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm col-span-2">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8">Admission Campaign Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.campaignPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(v: number) => [`${v}x`, 'ROI']}
                                />
                                <Bar dataKey="roi" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8">Traffic Sources</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.sourceBreakdown}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.sourceBreakdown.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {data.sourceBreakdown.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs font-medium text-[var(--text-secondary)]">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
