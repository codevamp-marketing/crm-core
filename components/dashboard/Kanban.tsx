"use client";
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MoreHorizontal, Calendar, IndianRupee, Plus, Loader2 } from 'lucide-react';
import { useLeads } from '@/hooks/use-leads';
import { useLeadsRealtime } from '@/hooks/use-leads-realtime';
import { Lead, PipelineStage, PIPELINE_STAGE_LABELS } from '@/lib/types';
import { LeadDetailSheet } from './LeadDetailSheet';

// ── Kanban column order ────────────────────────────────────────────────────────
const STAGES: PipelineStage[] = [
    'New_Lead',
    'First_Contact',
    'AI_Nurturing',
    'Demo_Scheduled',
    'Proposal_Sent',
    'Negotiation',
    'Closed_Won',
    'Closed_Lost',
];

// Colour accent for each stage column header
const STAGE_COLORS: Record<PipelineStage, string> = {
    New_Lead: 'bg-blue-500',
    First_Contact: 'bg-violet-500',
    AI_Nurturing: 'bg-purple-500',
    Demo_Scheduled: 'bg-amber-500',
    Proposal_Sent: 'bg-orange-500',
    Negotiation: 'bg-rose-400',
    Closed_Won: 'bg-emerald-500',
    Closed_Lost: 'bg-zinc-400',
};

// ── Lead Card ──────────────────────────────────────────────────────────────────
function LeadCard({ lead, onSelect }: { lead: Lead; onSelect: (lead: Lead) => void }) {
    return (
        <div 
            onClick={() => onSelect(lead)}
            className="cursor-pointer bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide",
                    lead.type === 'Hot'
                        ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                        : lead.type === 'Warm'
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                            : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                )}>
                    {lead.type || 'Warm'}
                </span>
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5 truncate">{lead.name || 'Unknown'}</h4>
            <p className="text-xs text-[var(--text-secondary)] mb-3 truncate">{lead.course || '—'}</p>

            {/* AI Score bar */}
            {lead.aiScore > 0 && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={clsx("h-full rounded-full transition-all",
                                lead.aiScore > 70 ? "bg-emerald-500" :
                                    lead.aiScore > 40 ? "bg-amber-500" : "bg-rose-500"
                            )}
                            style={{ width: `${lead.aiScore}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] font-medium w-6 text-right">{lead.aiScore}</span>
                </div>
            )}

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                    <IndianRupee className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span>{lead.dealValue > 0 ? lead.dealValue.toLocaleString('en-IN') : '—'}</span>
                </div>
                {lead.createdAt && (
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Column ─────────────────────────────────────────────────────────────────────
function Column({ stage, leads, onSelectLead }: { stage: PipelineStage; leads: Lead[]; onSelectLead: (lead: Lead) => void }) {
    const label = PIPELINE_STAGE_LABELS[stage];
    const accent = STAGE_COLORS[stage];

    return (
        <div className="flex flex-col w-72 shrink-0 h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                    <span className={clsx("w-2.5 h-2.5 rounded-full", accent)} />
                    {label}
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] px-2 py-0.5 rounded-full text-xs font-medium">
                        {leads.length}
                    </span>
                </h3>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-[var(--text-primary)] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-zinc-100/60 dark:bg-zinc-900/60 rounded-2xl p-2 flex-1 overflow-y-auto min-h-[100px]">
                <div className="space-y-3 pb-20">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} onSelect={onSelectLead} />
                    ))}
                    {leads.length === 0 && (
                        <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 opacity-50">
                            <p className="text-xs text-[var(--text-secondary)]">No leads in this stage</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Column Loading Skeleton ────────────────────────────────────────────────────
function ColumnSkeleton() {
    return (
        <div className="flex flex-col w-72 shrink-0 h-full animate-pulse">
            <div className="h-5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 mx-1" />
            <div className="bg-zinc-100/60 dark:bg-zinc-900/60 rounded-2xl p-2 flex-1 space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-200 dark:bg-zinc-800 h-[110px] rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// ── Main Kanban Board ──────────────────────────────────────────────────────────
export default function KanbanBoard() {
    // ── Real data from DB ──────────────────────────────────────────────────
    const { data: leads = [], isLoading, isError } = useLeads();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Subscribe to Supabase Realtime — new leads / AI score updates appear live
    useLeadsRealtime();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Admission Pipeline</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Live overview of all enquiries across their admission stages.
                        {!isLoading && <span className="ml-2 font-medium">{leads.length} leads</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                        Filter
                    </button>
                    <button className="bg-[var(--bg-primary)] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm flex gap-2 items-center">
                        <Plus className="w-4 h-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Error State */}
            {isError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 text-center text-rose-700 dark:text-rose-400 text-sm mb-4">
                    ⚠️ Failed to load leads. Please check your connection and try again.
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex gap-5 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
                {isLoading
                    ? STAGES.map((s) => <ColumnSkeleton key={s} />)
                    : STAGES.map((stage) => (
                        <Column
                            key={stage}
                            stage={stage}
                            leads={leads.filter((l) => l.pipelineStage === stage)}
                            onSelectLead={setSelectedLead}
                        />
                    ))}
            </div>

            <LeadDetailSheet 
                lead={selectedLead} 
                open={!!selectedLead} 
                onOpenChange={(open) => !open && setSelectedLead(null)} 
            />
        </div>
    );
}
