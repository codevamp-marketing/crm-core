'use client';

import React, { useState } from 'react';
import {
    Share2, ThumbsUp, Eye,
    ExternalLink, Globe, Linkedin, Facebook, Twitter, Instagram,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { format, subDays } from 'date-fns';
import { FeedItem } from '@/lib/types';

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'LinkedIn': return <Linkedin className="w-4 h-4 text-[#0077b5]" />;
        case 'Facebook': return <Facebook className="w-4 h-4 text-[#1877F2]" />;
        case 'Twitter': return <Twitter className="w-4 h-4 text-[#1DA1F2]" />;
        case 'Instagram': return <Instagram className="w-4 h-4 text-[#E4405F]" />;
        default: return <Globe className="w-4 h-4 text-zinc-500" />;
    }
};

const MOCK_FEEDS: FeedItem[] = [
    {
        id: 'f1',
        type: 'Social Post',
        title: 'Applications Open for B.Tech 2025 – Invertis University',
        content: 'Unlock your engineering future! Invertis University is now accepting applications for B.Tech 2025-26. Industry-aligned curriculum, top placements, and vibrant campus life await. Apply now! #BTech #Engineering #InvertisUniversity',
        platform: 'Instagram',
        url: 'https://www.invertisuniversity.ac.in/academics',
        timestamp: subDays(new Date(), 1).toISOString(),
        metrics: { views: 24500, likes: 1840, shares: 310, comments: 97 },
        linkedLeadIds: ['l1', 'l3', 'l7'],
    },
    {
        id: 'f2',
        type: 'Blog Article',
        title: 'Why Choose Invertis University for Your MBA in 2025?',
        content: 'Discover how Invertis University MBA program blends global business insights with hands-on industry exposure. From live projects to corporate tie-ups, our graduates lead the way.',
        platform: 'Website',
        url: 'https://www.invertisuniversity.ac.in/academics',
        timestamp: subDays(new Date(), 4).toISOString(),
        metrics: { views: 8700, likes: 0, shares: 215, comments: 34 },
        linkedLeadIds: ['l2', 'l9'],
    },
    {
        id: 'f3',
        type: 'Social Post',
        title: 'Campus Life at Invertis – More Than Just Academics',
        content: 'Sports, cultural fests, hackathons and more! Get a glimpse of the vibrant campus life at Invertis University, Bareilly. #CampusLife #InvertisUniversity #StudentLife',
        platform: 'Instagram',
        url: 'https://www.invertisuniversity.ac.in',
        timestamp: subDays(new Date(), 2).toISOString(),
        metrics: { views: 13200, likes: 2100, shares: 185, comments: 63 },
        linkedLeadIds: ['l5', 'l12'],
    },
    {
        id: 'f4',
        type: 'SEO Page',
        title: 'Best Engineering College in Bareilly – Invertis University',
        content: 'Landing page targeting "best engineering college Bareilly 2025" – showcasing NAAC accreditation, placement records, and scholarship programs at Invertis University.',
        platform: 'Website',
        url: 'https://www.invertisuniversity.ac.in/academics',
        timestamp: subDays(new Date(), 12).toISOString(),
        metrics: { views: 41000, likes: 0, shares: 0, comments: 0 },
        linkedLeadIds: ['l4', 'l6', 'l10', 'l15'],
    },
    {
        id: 'f5',
        type: 'Social Post',
        title: 'Scholarship Opportunities at Invertis University 2025',
        content: 'Meritorious students can avail up to 100% scholarship! Do not let finances stop your dreams. Explore scholarship options at Invertis University today. #Scholarship #HigherEducation',
        platform: 'Facebook',
        url: 'https://www.invertisuniversity.ac.in',
        timestamp: subDays(new Date(), 3).toISOString(),
        metrics: { views: 19800, likes: 1430, shares: 420, comments: 88 },
        linkedLeadIds: ['l8', 'l11', 'l14'],
    },
    {
        id: 'f6',
        type: 'Blog Article',
        title: 'Top Placement Recruiters at Invertis University – Batch 2024',
        content: 'With 500+ recruiters on campus and average packages touching 6 LPA, see why Invertis University is the preferred choice for students across UP and Uttarakhand.',
        platform: 'LinkedIn',
        url: 'https://www.invertisuniversity.ac.in',
        timestamp: subDays(new Date(), 6).toISOString(),
        metrics: { views: 11400, likes: 620, shares: 310, comments: 47 },
        linkedLeadIds: ['l13', 'l16'],
    },
];

export default function Feeds() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');
    const [linkingFeedId, setLinkingFeedId] = useState<string | null>(null);

    const filteredFeeds = filter === 'All' ? MOCK_FEEDS : MOCK_FEEDS.filter(f => f.type === filter);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Content Feeds</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Monitor social posts, blogs, and SEO pages linked to your student admission leads.</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Social Post', 'Blog Article', 'SEO Page'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                                filter === type
                                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                                    : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeeds.map((feed) => (
                    <div key={feed.id} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="p-6 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-[var(--border-subtle)]">
                                        <PlatformIcon platform={feed.platform} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-primary)]">{feed.platform}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]">{format(new Date(feed.timestamp), 'MMM d, yyyy')}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border-subtle)] rounded-md text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                                    {feed.type}
                                </span>
                            </div>

                            <h3 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{feed.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3">{feed.content}</p>

                            <a href={feed.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 mb-6">
                                View Original <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex items-center gap-4 py-3 border-t border-[var(--border-subtle)]">
                                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                    <Eye className="w-4 h-4" />
                                    <span className="text-xs font-medium">{feed.metrics.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-xs font-medium">{feed.metrics.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                    <Share2 className="w-4 h-4" />
                                    <span className="text-xs font-medium">{feed.metrics.shares.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border-t border-[var(--border-subtle)] rounded-b-2xl">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Linked Leads</p>
                                <button
                                    onClick={() => router.push('/leads')}
                                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1"
                                >
                                    View {feed.linkedLeadIds.length} Leads <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
