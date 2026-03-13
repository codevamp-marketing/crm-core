'use client';

import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Download, Calendar, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_TEAM = [
    { name: 'Dr. Amit Sharma', role: 'Sales Manager' },
    { name: 'Ms. Priya Verma', role: 'Sales Executive' },
    { name: 'Mr. Rahul Singh', role: 'Sales Executive' },
];

const salesPerformanceData = [
    { name: 'Week 1', revenue: 12000, target: 10000 },
    { name: 'Week 2', revenue: 15000, target: 12000 },
    { name: 'Week 3', revenue: 8000, target: 12000 },
    { name: 'Week 4', revenue: 18000, target: 15000 },
];

const revenueData = [
    { name: 'Aug', value: 320000 },
    { name: 'Sep', value: 510000 },
    { name: 'Oct', value: 480000 },
    { name: 'Nov', value: 390000 },
    { name: 'Dec', value: 275000 },
    { name: 'Jan', value: 640000 },
    { name: 'Feb', value: 820000 },
];

const conversionBySourceData = [
    { name: 'Google Ads', leads: 400, won: 45 },
    { name: 'Facebook', leads: 300, won: 25 },
    { name: 'LinkedIn', leads: 150, won: 18 },
    { name: 'Email', leads: 200, won: 30 },
    { name: 'Organic', leads: 250, won: 40 },
];

const teamPerformanceData = MOCK_TEAM.map((user) => ({
    name: user.name,
    leads: Math.floor(Math.random() * 50) + 20,
    deals: Math.floor(Math.random() * 10) + 2,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    conversion: Math.floor(Math.random() * 20) + 5,
}));

const kpiCards = [
    { label: 'Total Revenue', value: '₹4,65,692', trend: '+12.5%', up: true, icon: DollarSign },
    { label: 'Avg. Deal Size', value: '₹42,000', trend: '+5.2%', up: true, icon: TrendingUp },
    { label: 'Sales Cycle', value: '18 Days', trend: '-2 Days', up: true, icon: Target },
    { label: 'Win Rate', value: '24.8%', trend: '-1.2%', up: false, icon: Users },
];

export default function Reports() {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const COLORS = ['#18181B', '#52525B', '#71717A', '#A1A1AA', '#E4E4E7'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Analytics &amp; Reports</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Deep dive into sales performance and admission marketing ROI.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {dateRange}
                    </button>
                    <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kpiCards.map(({ label, value, trend, up, icon: Icon }) => (
                    <div key={label} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-[var(--border-subtle)]">
                                <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                            <span className={clsx(
                                'text-xs font-semibold px-2 py-0.5 rounded-full',
                                up ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                            )}>
                                {trend}
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Trend */}
            <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Enrollment Revenue Trend</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                        <span className="text-xs text-[var(--text-secondary)]">Predicted</span>
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="rptRevGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#18181B" stopOpacity={0.12} />
                                    <stop offset="95%" stopColor="#18181B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#18181B" strokeWidth={2} fillOpacity={1} fill="url(#rptRevGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sales Performance vs Target */}
            <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Sales Performance vs Target</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                            <span className="text-xs text-[var(--text-secondary)]">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                            <span className="text-xs text-[var(--text-secondary)]">Target</span>
                        </div>
                    </div>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="revenue" name="Revenue" fill="#18181B" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="target" name="Target" fill="#E4E4E7" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Conversion + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Conversion by Source */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8">Lead Conversion by Source</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={conversionBySourceData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="var(--border-subtle)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12, fontWeight: 500 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="leads" name="Total Leads" fill="#E4E4E7" radius={[0, 4, 4, 0]} barSize={12} />
                                <Bar dataKey="won" name="Won Deals" fill="#18181B" radius={[0, 4, 4, 0]} barSize={12} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Leaderboard */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Team Leaderboard</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)]">
                                    <th className="pb-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Rep</th>
                                    <th className="pb-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider text-right">Revenue</th>
                                    <th className="pb-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider text-right">Deals</th>
                                    <th className="pb-3 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider text-right">Conv.%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {teamPerformanceData.map((member, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-3 font-medium text-[var(--text-primary)]">{member.name}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)]">₹{member.revenue.toLocaleString()}</td>
                                        <td className="py-3 text-right text-[var(--text-secondary)]">{member.deals}</td>
                                        <td className="py-3 text-right">
                                            <span className={clsx(
                                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                                member.conversion > 15
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                            )}>
                                                {member.conversion}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}