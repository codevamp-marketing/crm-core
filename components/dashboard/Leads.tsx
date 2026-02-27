'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useLeads } from '@/hooks/use-leads';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/pagination";

export default function Leads() {
    const [filter, setFilter] = useState('');
    const [activeFeedFilter, setActiveFeedFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isAddLeadModalOpen, setAddLeadModalOpen] = useState(false);

    const { data: leads = [], isLoading, isError } = useLeads();

    const feeds: any[] = [];
    const clearFeedFilter = () => setActiveFeedFilter(null);
    const activeFeed = activeFeedFilter ? feeds.find((f) => f.id === activeFeedFilter) : null;

    const filteredLeads = leads.filter((lead) => {
        const matchesText =
            lead.name.toLowerCase().includes(filter.toLowerCase()) ||
            lead.company.toLowerCase().includes(filter.toLowerCase()) ||
            lead.email.toLowerCase().includes(filter.toLowerCase());
        const matchesFeed = activeFeed ? activeFeed.linkedLeadIds.includes(lead.id) : true;
        return matchesText && matchesFeed;
    });

    const paginatedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-8">
            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm font-medium">Loading leads...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center text-rose-700 text-sm">
                    ⚠️ Failed to load leads. Please check your connection and try again.
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Leads</h1>
                            <p className="text-[var(--text-secondary)] mt-1">Manage and track your potential customers.</p>
                        </div>
                        <button
                            onClick={() => setAddLeadModalOpen(true)}
                            className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Lead
                        </button>
                    </div>

                    {/* Active Feed Filter Banner */}
                    {activeFeed && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-indigo-900 font-medium">Filtered by Feed:</span>
                                <span className="text-sm text-indigo-700 font-bold">{activeFeed.title}</span>
                            </div>
                            <button
                                onClick={clearFeedFilter}
                                className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 hover:text-indigo-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Filters Bar */}
                    <div className="bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-sm flex items-center gap-2">
                        <div className="relative flex-1 max-w-md ml-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all placeholder-zinc-400 text-zinc-900"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-[var(--border-subtle)] mx-2"></div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>

                    {/* Leads Table */}
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="border-[var(--border-subtle)]">
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Name</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">AI Score</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Next Action</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Source</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLeads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16 text-[var(--text-secondary)] text-sm">
                                            No leads found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedLeads.map((lead) => (
                                        <TableRow
                                            key={lead.id}
                                            className="group cursor-pointer border-zinc-100 hover:bg-zinc-50/80 transition-colors"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] flex items-center justify-center font-bold text-xs border border-[var(--border-subtle)]">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[var(--text-primary)]">{lead.name}</div>
                                                        <div className="text-[var(--text-secondary)] text-xs">{lead.company}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    lead.stage === 'Closed Won'
                                                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                                                        : lead.stage === 'Closed Lost'
                                                            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800"
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                                                )}>
                                                    {lead.stage}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={clsx("h-full rounded-full",
                                                                lead.aiScore > 70 ? "bg-emerald-500" :
                                                                    lead.aiScore > 40 ? "bg-amber-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${lead.aiScore}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-[var(--text-secondary)]">{lead.aiScore}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">
                                                    {lead.nextBestAction}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 text-[var(--text-secondary)]">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-[var(--border-subtle)] text-xs">
                                                    {lead.source}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                                        <Phone className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="px-6 pb-4">
                            <TablePagination
                                page={page}
                                pageSize={pageSize}
                                total={filteredLeads.length}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
