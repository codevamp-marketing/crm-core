'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Eye, Clock, X, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useLeadsPaginated } from '@/hooks/use-leads';
import { useDebounce } from '@/hooks/use-debounce';
import { Lead } from '@/lib/types';
import { useLeadsRealtime } from '@/hooks/use-leads-realtime';
import { PIPELINE_STAGE_LABELS, PipelineStage } from '@/lib/types';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/pagination";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const STAGE_BADGE_STYLES: Partial<Record<PipelineStage, string>> = {
    Closed_Won: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    Closed_Lost: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800",
    AI_Nurturing: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-800",
    Demo_Scheduled: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800",
};

export default function Leads() {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [stageFilter, setStageFilter] = useState<string>('');

    const debouncedFilter = useDebounce(filter, 300);

    const { data: paginatedData, isLoading, isError } = useLeadsPaginated({
        search: debouncedFilter,
        page,
        pageSize,
        sortBy,
        sortOrder,
        type: typeFilter || undefined,
        stage: (stageFilter as PipelineStage) || undefined,
    });

    const paginatedLeads = paginatedData?.leads || [];
    const totalLeads = paginatedData?.total || 0;

    // ── Supabase Realtime ─────────────────────────────────────────────────────
    // Subscribes to INSERT + UPDATE events on the leads table.
    useLeadsRealtime();

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
                            <p className="text-[var(--text-secondary)] mt-1">
                                Manage and track all student enquiries.
                                <span className="ml-2 font-medium">{totalLeads} total</span>
                            </p>
                        </div>
                        <button className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Lead
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-subtle)] shadow-sm flex items-center gap-2">
                        <div className="relative flex-1 max-w-md ml-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search by name, course, email, phone…"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border-none bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all placeholder-zinc-400 text-zinc-900"
                                value={filter}
                                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                            />
                            {filter && (
                                <button onClick={() => setFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <div className="h-6 w-px bg-[var(--border-subtle)] mx-2"></div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={clsx("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                                    typeFilter || stageFilter ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-transparent"
                                )}>
                                    <Filter className="w-4 h-4" />
                                    {typeFilter || stageFilter ? 'Filters Active' : 'Filters'}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-64 p-4">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Advanced Filters</h4>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500">Lead Type</label>
                                        <select
                                            value={typeFilter}
                                            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm"
                                        >
                                            <option value="">All Types</option>
                                            <option value="Hot">Hot</option>
                                            <option value="Warm">Warm</option>
                                            <option value="Cold">Cold</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500">Pipeline Stage</label>
                                        <select
                                            value={stageFilter}
                                            onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm"
                                        >
                                            <option value="">All Stages</option>
                                            {Object.keys(PIPELINE_STAGE_LABELS).map((key) => (
                                                <option key={key} value={key}>{PIPELINE_STAGE_LABELS[key as PipelineStage]}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {(typeFilter || stageFilter) && (
                                        <button
                                            onClick={() => { setTypeFilter(''); setStageFilter(''); setPage(1); }}
                                            className="w-full text-xs text-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 py-1"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {(typeFilter || stageFilter) && (
                            <div className="flex items-center gap-1.5 ml-1">
                                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                                {typeFilter && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => { setTypeFilter(''); setPage(1); }}
                                                    className="inline-flex flex-row items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100/80 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:hover:border-rose-900/50 cursor-pointer transition-colors group"
                                                >
                                                    <span className="opacity-70 font-normal">Type:</span> {typeFilter}
                                                    <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Remove Type filter</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {stageFilter && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => { setStageFilter(''); setPage(1); }}
                                                    className="inline-flex flex-row items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100/80 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:hover:border-rose-900/50 cursor-pointer transition-colors group"
                                                >
                                                    <span className="opacity-70 font-normal">Stage:</span> {PIPELINE_STAGE_LABELS[stageFilter as PipelineStage] || stageFilter}
                                                    <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Remove Stage filter</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => { setTypeFilter(''); setStageFilter(''); setPage(1); }}
                                                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors ml-0.5"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Clear all filters</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                    </div>

                    {/* Leads Table */}
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="border-[var(--border-subtle)]">
                                    <TableHead
                                        className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors select-none group"
                                        onClick={() => {
                                            if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            else { setSortBy('name'); setSortOrder('asc'); }
                                            setPage(1);
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Name
                                            {sortBy === 'name' ? (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                                        </div>
                                    </TableHead>

                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Course</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Phone</TableHead>

                                    <TableHead
                                        className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors select-none group"
                                        onClick={() => {
                                            if (sortBy === 'pipelineStage') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            else { setSortBy('pipelineStage'); setSortOrder('asc'); }
                                            setPage(1);
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Pipeline Stage
                                            {sortBy === 'pipelineStage' ? (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                                        </div>
                                    </TableHead>

                                    <TableHead
                                        className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors select-none group"
                                        onClick={() => {
                                            if (sortBy === 'aiScore') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            else { setSortBy('aiScore'); setSortOrder('desc'); }
                                            setPage(1);
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            AI Score
                                            {sortBy === 'aiScore' ? (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                                        </div>
                                    </TableHead>

                                    <TableHead
                                        className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors select-none group"
                                        onClick={() => {
                                            if (sortBy === 'type') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                            else { setSortBy('type'); setSortOrder('asc'); }
                                            setPage(1);
                                        }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Type
                                            {sortBy === 'type' ? (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />) : <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                                        </div>
                                    </TableHead>

                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Next Action</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider">Source</TableHead>
                                    <TableHead className="font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLeads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-16 text-[var(--text-secondary)] text-sm">
                                            {filter ? `No leads matching "${filter}".` : 'No leads yet.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedLeads.map((lead) => (
                                        <TableRow
                                            key={lead.id}
                                            onClick={() => setSelectedLead(lead)}
                                            className="group cursor-pointer border-zinc-100 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                                        >
                                            {/* Name + Email */}
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] flex items-center justify-center font-bold text-xs border border-[var(--border-subtle)]">
                                                        {(lead.name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[var(--text-primary)]">{lead.name || 'Unknown'}</div>
                                                        <div className="text-[var(--text-secondary)] text-xs">{lead.email || '—'}</div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Course */}
                                            <TableCell className="py-4">
                                                <span className="text-sm text-[var(--text-primary)]">{lead.course || '—'}</span>
                                                {lead.specialization && (
                                                    <div className="text-xs text-[var(--text-secondary)]">{lead.specialization}</div>
                                                )}
                                            </TableCell>

                                            {/* Phone */}
                                            <TableCell className="py-4 text-sm text-[var(--text-primary)]">
                                                {lead.phone || '—'}
                                            </TableCell>

                                            {/* Pipeline Stage */}
                                            <TableCell className="py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    STAGE_BADGE_STYLES[lead.pipelineStage] ??
                                                    "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                                                )}>
                                                    {PIPELINE_STAGE_LABELS[lead.pipelineStage]}
                                                </span>
                                            </TableCell>

                                            {/* AI Score */}
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={clsx("h-full rounded-full",
                                                                lead.aiScore > 70 ? "bg-emerald-500" :
                                                                    lead.aiScore > 40 ? "bg-amber-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${lead.aiScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-[var(--text-secondary)]">{lead.aiScore}</span>
                                                </div>
                                            </TableCell>

                                            {/* Type */}
                                            <TableCell className="py-4">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                    lead.type === 'Hot' ? "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50" :
                                                        lead.type === 'Warm' ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50" :
                                                            "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50"
                                                )}>
                                                    {lead.type || 'Warm'}
                                                </span>
                                            </TableCell>

                                            {/* Next Action */}
                                            <TableCell className="py-4">
                                                {lead.nextBestAction ? (
                                                    <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">
                                                        {lead.nextBestAction}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[var(--text-secondary)]">—</span>
                                                )}
                                            </TableCell>

                                            {/* Source */}
                                            <TableCell className="py-4 text-[var(--text-secondary)]">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-[var(--border-subtle)] text-xs">
                                                    {(lead.source ?? 'Manual').replace(/_/g, ' ')}
                                                </span>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="py-4 text-right pr-6">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                                                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                                                        title="View Activity"
                                                    >
                                                        <Eye className="w-4 h-4" />
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
                                total={totalLeads}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Activity Sidebar */}
            <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-xl">Activity Timeline</SheetTitle>
                        <SheetDescription>
                            Recent interactions for <span className="font-semibold text-[var(--text-primary)]">{selectedLead?.name || 'this lead'}</span>.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-0">
                        {selectedLead?.activities && selectedLead.activities.length > 0 ? (
                            selectedLead.activities.map((activity) => (
                                <div key={activity.id} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 last:border-transparent pb-6 last:pb-0 group/timeline">
                                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center group-hover/timeline:border-indigo-500 transition-colors">
                                        <Clock className="w-2.5 h-2.5 text-zinc-500 opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-[var(--border-subtle)] rounded-xl p-4 shadow-sm group-hover/timeline:border-indigo-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md">
                                                {(activity.type || 'Activity').replace('_', ' ')}
                                            </span>
                                            <time className="text-[10px] text-zinc-400 font-medium whitespace-nowrap ml-3">
                                                {new Date(activity.timestamp).toLocaleString('en-IN', {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </time>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {activity.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                                    <Clock className="w-5 h-5 text-zinc-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">No Activity Found</h4>
                                <p className="text-xs text-[var(--text-secondary)] max-w-[200px]">
                                    No interactions have been recorded for this lead yet.
                                </p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
