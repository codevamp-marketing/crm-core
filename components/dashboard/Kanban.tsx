"use client";
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { MoreHorizontal, Calendar, IndianRupee, Plus, Loader2 } from 'lucide-react';
import { useLeads } from '@/hooks/use-leads';
import { useLeadsRealtime } from '@/hooks/use-leads-realtime';
import { useMoveLeadStage } from '@/hooks/use-leads';
import { getAuthToken } from '@/lib/http-client';
import { decodeJwt } from '@/lib/utils';
import { Lead, PipelineStage, PIPELINE_STAGE_LABELS } from '@/lib/types';
import { LeadDetailSheet } from './LeadDetailSheet';
import { AddLeadDialog } from './AddLeadDialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

// ── Drag payload stored in dataTransfer ──────────────────────────────────────
interface DragPayload {
    leadId: string;
    fromStage: PipelineStage;
}

// ── Lead Card ──────────────────────────────────────────────────────────────────
function LeadCard({
    lead,
    onSelect,
    onDragStart,
}: {
    lead: Lead;
    onSelect: (lead: Lead) => void;
    onDragStart: (e: React.DragEvent, lead: Lead) => void;
}) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                    <div
                        draggable
                        onDragStart={(e) => {
                            setIsDragging(true);
                            onDragStart(e, lead);
                        }}
                        onDragEnd={() => setIsDragging(false)}
                        onClick={() => onSelect(lead)}
                        className={clsx(
                            "cursor-grab active:cursor-grabbing bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-subtle)]",
                            "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]",
                            "hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group select-none",
                            isDragging && "opacity-40 scale-95 shadow-none border-dashed",
                        )}
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
                </TooltipTrigger>
                <TooltipContent>
                    <p>Drag to change stage</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// ── Column ─────────────────────────────────────────────────────────────────────
function Column({
    stage,
    leads,
    onSelectLead,
    onDragStart,
    onDrop,
}: {
    stage: PipelineStage;
    leads: Lead[];
    onSelectLead: (lead: Lead) => void;
    onDragStart: (e: React.DragEvent, lead: Lead) => void;
    onDrop: (e: React.DragEvent, toStage: PipelineStage) => void;
}) {
    const [isDragOver, setIsDragOver] = useState(false);
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

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { setIsDragOver(false); onDrop(e, stage); }}
                className={clsx(
                    "bg-zinc-100/60 dark:bg-zinc-900/60 rounded-2xl p-2 flex-1 overflow-y-auto min-h-[100px] transition-all",
                    isDragOver && "ring-2 ring-indigo-400 dark:ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20",
                )}
            >
                <div className="space-y-3 pb-20">
                    {leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onSelect={onSelectLead}
                            onDragStart={onDragStart}
                        />
                    ))}
                    {leads.length === 0 && (
                        <div className={clsx(
                            "flex items-center justify-center h-24 rounded-xl border-2 border-dashed transition-colors",
                            isDragOver
                                ? "border-indigo-400 dark:border-indigo-500 opacity-80"
                                : "border-zinc-200 dark:border-zinc-800 opacity-50",
                        )}>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {isDragOver ? 'Drop here' : 'No leads in this stage'}
                            </p>
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
    const { data: leads = [], isLoading, isError } = useLeads();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    const [mode, setMode] = useState<'all' | 'fresh' | 'my_leads'>('all');

    const moveStage = useMoveLeadStage();

    // Subscribe to Supabase Realtime — new leads / AI score updates appear live
    useLeadsRealtime();

    let currentUser: string | undefined;
    try {
        const token = getAuthToken();
        const decoded = decodeJwt(token);
        currentUser = decoded?.sub as string;
    } catch { }

    const filteredLeads = leads.filter(l => {
        if (mode === 'fresh') return !l.isPicked;
        if (mode === 'my_leads') return l.isPicked && l.pickedBy === currentUser;
        return true;
    });

    // ── Drag handlers ──────────────────────────────────────────────────────
    const handleDragStart = useCallback((e: React.DragEvent, lead: Lead) => {
        const payload: DragPayload = { leadId: lead.id, fromStage: lead.pipelineStage };
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, toStage: PipelineStage) => {
        e.preventDefault();
        try {
            const raw = e.dataTransfer.getData('application/json');
            if (!raw) return;
            const { leadId, fromStage } = JSON.parse(raw) as DragPayload;

            // No-op if same column
            if (fromStage === toStage) return;

            // 1. Move stage (optimistic update built-in)
            // also decode the token so backend can log the activity with the correct userId
            const token = getAuthToken();
            const decoded = decodeJwt(token);
            const userId = decoded?.sub;

            moveStage.mutate({ id: leadId, stage: toStage, userId });
        } catch {
            // Ignore invalid drag data
        }
    }, [moveStage]);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Admission Pipeline</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Live overview of all enquiries across their admission stages.
                        {!isLoading && <span className="ml-2 font-medium">{filteredLeads.length} leads</span>}
                    </p>
                    <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1 mt-6 w-max">
                        <button
                            onClick={() => setMode('all')}
                            className={clsx("px-5 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer", mode === 'all' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300")}
                        >
                            All Leads
                        </button>
                        <button
                            onClick={() => setMode('fresh')}
                            className={clsx("px-5 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer", mode === 'fresh' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300")}
                        >
                            Fresh Leads
                        </button>
                        <button
                            onClick={() => setMode('my_leads')}
                            className={clsx("px-5 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer", mode === 'my_leads' ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300")}
                        >
                            My Leads
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddLeadOpen(true)}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2 cursor-pointer"
                    >
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
                            leads={filteredLeads.filter((l) => l.pipelineStage === stage)}
                            onSelectLead={setSelectedLead}
                            onDragStart={handleDragStart}
                            onDrop={handleDrop}
                        />
                    ))}
            </div>

            <LeadDetailSheet
                lead={selectedLead}
                open={!!selectedLead}
                onOpenChange={(open) => !open && setSelectedLead(null)}
            />

            <AddLeadDialog
                open={isAddLeadOpen}
                onOpenChange={setIsAddLeadOpen}
            />
        </div>
    );
}
