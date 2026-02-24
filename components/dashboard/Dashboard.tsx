'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Target, Brain } from 'lucide-react';
import { clsx } from 'clsx';

const MOCK_CAMPAIGNS = [
    { spent: 74500, roi: 4.2 },
    { spent: 51200, roi: 3.1 },
    { spent: 38700, roi: 2.8 },
    { spent: 18300, roi: 1.1 },
    { spent: 29800, roi: 2.4 },
    { spent: 42000, roi: 3.5 },
];

const MOCK_LEADS_COUNT = 50;
const MOCK_AVG_AI_SCORE = 74;

const StatCard = ({ title, value, trend, trendUp, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Icon className="w-5 h-5 text-zinc-900" />
            </div>
            <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                trendUp ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700")}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
            </span>
        </div>
        <div>
            <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-zinc-900 tracking-tight">{value}</p>
        </div>
    </div>
);


export default function Dashboard() {
    const totalAdSpend = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.spent, 0);
    const avgRoi = (MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.roi, 0) / MOCK_CAMPAIGNS.length).toFixed(1);

    const funnelData = [
        { name: 'Ad Impressions', value: 420000 },
        { name: 'Clicks', value: 63500 },
        { name: 'Enquiries', value: 18400 },
        { name: 'AI Qualified', value: 9200 },
        { name: 'Applications', value: 3100 },
        { name: 'Admissions', value: 1240 },
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

    const sourceData = [
        { name: 'Google Ads', value: 520 },
        { name: 'Facebook', value: 410 },
        { name: 'Instagram', value: 340 },
        { name: 'Referral', value: 180 },
        { name: 'Website', value: 250 },
    ];

    const COLORS = ['#18181B', '#52525B', '#71717A', '#A1A1AA', '#E4E4E7'];

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Admission Marketing Hub</h1>
                    <p className="text-zinc-500 mt-1">AI-powered student admission insights &amp; performance metrics – Invertis University.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900/10">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Avg. Campaign ROI" value={`${avgRoi}x`} trend="12.5%" trendUp={true} icon={TrendingUp} />
                <StatCard title="AI Lead Quality Score" value={`${MOCK_AVG_AI_SCORE}/100`} trend="5.2%" trendUp={true} icon={Brain} />
                <StatCard title="Total Ad Spend" value={`₹${totalAdSpend.toLocaleString()}`} trend="2.4%" trendUp={false} icon={DollarSign} />
                <StatCard title="Predicted Fee Revenue" value="₹4,65,692" trend="18.4%" trendUp={true} icon={Target} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Forecast */}
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-zinc-900">Enrollment Revenue Forecast (AI Prediction)</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-zinc-900"></span>
                            <span className="text-xs text-zinc-500">Predicted</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
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
                                />
                                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Funnel Analysis */}
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 mb-8">Admission Funnel Conversion</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-subtle)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12, fontWeight: 500 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24}>
                                    {funnelData.map((_, index) => (
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
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm col-span-2">
                    <h3 className="text-lg font-bold text-zinc-900 mb-8">Admission Campaign Performance</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'B.Tech 2025', roi: 4.2 },
                                { name: 'MBA Leads', roi: 3.1 },
                                { name: 'Pharmacy', roi: 2.8 },
                                { name: 'Law & Arts', roi: 2.4 },
                                { name: 'Distance Ed', roi: 3.5 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-app)', radius: 4 } as any}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="roi" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 mb-8">Traffic Sources</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sourceData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                    {sourceData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {sourceData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-xs font-medium text-zinc-500">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
