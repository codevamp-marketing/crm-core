"use client";

import React from 'react';
import { Rocket, TrendingUp, Users, DollarSign, Target, Zap, MousePointer, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Campaign } from '@/lib/types';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: 'c1',
        name: 'B.Tech Admissions 2025',
        platform: 'Google',
        status: 'Active',
        budget: 120000,
        spent: 74500,
        clicks: 18400,
        conversions: 980,
        aiOptimizationScore: 94,
        roi: 4.2,
    },
    {
        id: 'c2',
        name: 'MBA Lead Generation',
        platform: 'Facebook',
        status: 'Active',
        budget: 85000,
        spent: 51200,
        clicks: 12600,
        conversions: 540,
        aiOptimizationScore: 88,
        roi: 3.1,
    },
    {
        id: 'c3',
        name: 'Pharmacy & Para-Medical',
        platform: 'Instagram',
        status: 'Active',
        budget: 60000,
        spent: 38700,
        clicks: 9800,
        conversions: 320,
        aiOptimizationScore: 91,
        roi: 2.8,
    },
    {
        id: 'c4',
        name: 'BCA / MCA Awareness',
        platform: 'LinkedIn',
        status: 'Paused',
        budget: 45000,
        spent: 18300,
        clicks: 4200,
        conversions: 115,
        aiOptimizationScore: 62,
        roi: 1.1,
    },
    {
        id: 'c5',
        name: 'Law & Humanities Drive',
        platform: 'Facebook',
        status: 'Active',
        budget: 50000,
        spent: 29800,
        clicks: 7100,
        conversions: 210,
        aiOptimizationScore: 85,
        roi: 2.4,
    },
    {
        id: 'c6',
        name: 'Distance Learning 2025',
        platform: 'Google',
        status: 'Active',
        budget: 70000,
        spent: 42000,
        clicks: 11500,
        conversions: 430,
        aiOptimizationScore: 89,
        roi: 3.5,
    },
];

export default function AICampaigns() {
    const campaigns = MOCK_CAMPAIGNS;

    const COLORS = ['#18181B', '#52525B', '#A1A1AA', '#E4E4E7'];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">AI Admission Campaigns</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage and optimize AI-driven student admission campaigns.</p>
                </div>
                <button className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Generate New Campaign
                </button>
            </div>

            {/* AI Insights Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1">AI Optimization Insight</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
                            Your "B.Tech Admissions 2025" campaign is outperforming others by 38%.
                            AI recommends reallocating ₹12,000 from "BCA / MCA Awareness" to scale Google Ads for B.Tech engineering leads and maximize enrollment conversions.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                            Apply Recommendation
                        </button>
                    </div>
                </div>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2.5 rounded-xl",
                                    campaign.platform === 'Google' ? "bg-blue-50 text-blue-600" :
                                        campaign.platform === 'Facebook' ? "bg-indigo-50 text-indigo-600" :
                                            campaign.platform === 'Instagram' ? "bg-rose-50 text-rose-600" :
                                                "bg-sky-50 text-sky-600"
                                )}>
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{campaign.name}</h3>
                                    <p className="text-xs text-[var(--text-secondary)]">{campaign.platform} • {campaign.status}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={clsx(
                                    "px-2.5 py-1 rounded-full text-xs font-bold border mb-1",
                                    campaign.aiOptimizationScore > 90 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                        campaign.aiOptimizationScore > 70 ? "bg-amber-50 text-amber-700 border-amber-100" :
                                            "bg-rose-50 text-rose-700 border-rose-100"
                                )}>
                                    AI Score: {campaign.aiOptimizationScore}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-3 bg-zinc-50 rounded-xl">
                                <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                    <MousePointer className="w-3 h-3" /> Clicks
                                </p>
                                <p className="text-lg font-bold text-zinc-900">{campaign.clicks.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-zinc-50 rounded-xl">
                                <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> ROI
                                </p>
                                <p className="text-lg font-bold text-zinc-900">{campaign.roi}x</p>
                            </div>
                            <div className="p-3 bg-zinc-50 rounded-xl">
                                <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Spent
                                </p>
                                <p className="text-lg font-bold text-zinc-900">${campaign.spent.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}></div>
                                </div>
                                <span className="text-xs text-zinc-500">${campaign.budget - campaign.spent} remaining</span>
                            </div>
                            <button className="text-sm font-medium text-[var(--text-primary)] hover:text-indigo-600 transition-colors">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
