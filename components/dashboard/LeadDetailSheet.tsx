'use client';

import React, { useState } from 'react';
import {
    X, Mail, Phone, Calendar, Clock, Tag, User as UserIcon,
    Send, Sparkles, Zap, Loader2, Plus,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Lead } from '@/lib/types';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useLeadDetail, useCreateActivity } from '@/hooks/use-lead-detail';
import { usePickLead } from '@/hooks/use-leads';
import { useActivitiesRealtime } from '@/hooks/use-activities-realtime';
import { useToast } from '@/hooks/use-toast';
import { getAuthToken } from '@/lib/http-client';
import { decodeJwt } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadDetailSheetProps {
    /** The lead stub from the list (for instant render before detail loads) */
    lead: Lead | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// ── Activity dot colour per type ──────────────────────────────────────────────
const ACTIVITY_DOT: Record<string, string> = {
    AI_Insight: 'bg-indigo-500',
    Stage_Change: 'bg-amber-500',
    Call: 'bg-emerald-500',
    WhatsApp: 'bg-teal-500',
    Email: 'bg-blue-500',
    Meeting: 'bg-purple-500',
    Note: 'bg-zinc-400',
    Campaign_Interaction: 'bg-rose-400',
    Status_Change: 'bg-orange-400',
};

const ACTIVITY_TYPE_LABEL: Record<string, string> = {
    AI_Insight: 'AI Insight',
    Stage_Change: 'Stage Change',
    Call: 'Call',
    WhatsApp: 'WhatsApp',
    Email: 'Email',
    Meeting: 'Meeting',
    Note: 'Note',
    Campaign_Interaction: 'Campaign',
    Status_Change: 'Status Change',
};

export function LeadDetailSheet({ lead: stubLead, open, onOpenChange }: LeadDetailSheetProps) {
    const { toast } = useToast();
    const token = getAuthToken();
    const decoded = decodeJwt(token);
    const userRole = (decoded?.role as string) || 'Counsellor';

    const [note, setNote] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Only fetch full detail + timeline when the sheet is open and we have an id
    const { lead: fullLead, activities, isLoading, isActivitiesLoading } = useLeadDetail(
        open && stubLead?.id ? stubLead.id : null,
    );
    const createActivity = useCreateActivity();
    const pickLead = usePickLead();

    // Listen for realtime Activity inserts for this lead
    useActivitiesRealtime(open && stubLead?.id ? stubLead.id : null);

    // Use stub lead for instant header render; swap to full lead when loaded
    const lead = fullLead ?? stubLead;


    const handleAddNote = () => {
        if (!note.trim() || !lead) return;
        createActivity.mutate(
            {
                leadId: lead.id,
                type: 'Note',
                description: note.trim(),
            },
            { onSuccess: () => setNote('') },
        );
    };

    const generateAiContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            console.log('AI Content Generated');
            setIsGenerating(false);
        }, 1500);
    };

    if (!lead) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg p-0 border-l border-zinc-100">
                    <SheetTitle className="sr-only">Lead Details</SheetTitle>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col h-full border-l border-zinc-100 dark:border-zinc-800 [&>button]:hidden">
                <SheetTitle className="sr-only">{lead.name}'s Details</SheetTitle>
                {/* Header */}
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{lead.name}</h2>
                            <span className={clsx(
                                'px-2.5 py-1 rounded-full text-xs font-medium border',
                                lead.pipelineStage === 'Closed_Won'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                    : lead.pipelineStage === 'Closed_Lost'
                                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                                        : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
                            )}>
                                {(lead.pipelineStage || 'New_Lead').replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            {lead.course}{lead.specialization ? ` - ${lead.specialization}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 transition-colors border border-zinc-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/50 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* AI Insights */}
                    <div className="p-8 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">AI Insights</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Conversion Probability</span>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lead.aiScore || 0}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${lead.aiScore || 0}%` }} />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Next Best Action</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                        {lead.nextBestAction || 'No action recommended'}
                                    </p>
                                    <button
                                        onClick={generateAiContent}
                                        disabled={isGenerating || !lead.nextBestAction}
                                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center gap-1.5 cursor-pointer hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating
                                            ? <div className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                            : <Zap className="w-3.5 h-3.5" />}
                                        Execute
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-8 grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-800">
                        {[
                            {
                                icon: Mail,
                                label: 'Email',
                                tooltip: 'Open default email client',
                                action: () => {
                                    if (lead.email) window.location.href = `mailto:${lead.email}`;
                                    else toast({ title: "Missing info", description: "No email address for this lead.", variant: "destructive", duration: 2000 });
                                }
                            },
                            {
                                icon: Phone,
                                label: 'Call',
                                tooltip: 'Initiate phone call',
                                action: () => {
                                    if (lead.phone) window.location.href = `tel:+91${lead.phone.replace(/[^0-9]/g, '')}`;  // fallback default to IN dial code, assuming it's India numbers as seen in previous steps
                                    else toast({ title: "Missing info", description: "No phone number for this lead.", variant: "destructive", duration: 2000 });
                                }
                            },
                            {
                                icon: Calendar,
                                label: 'Meeting',
                                tooltip: 'Schedule Google Meet',
                                action: () => {
                                    const title = encodeURIComponent(`Meeting with ${lead.name || 'Student'}`);
                                    const details = encodeURIComponent(`Discussing admission.\n\nLead: ${lead.name || 'Unknown'}\nPhone: ${lead.phone || 'N/A'}\nCourse: ${lead.course || 'N/A'}`);
                                    const guests = lead.email ? `&add=${encodeURIComponent(lead.email)}` : '';
                                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}${guests}`;
                                    window.open(url, '_blank');
                                }
                            },
                        ].map(({ icon: Icon, label, tooltip, action }) => (
                            <TooltipProvider key={label}>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <button onClick={action} className="cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">{label}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="p-8 space-y-8">
                        {/* Contact */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Lead Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                                    {lead.email ? (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        className="text-zinc-900 dark:text-zinc-100 break-all transition-colors cursor-pointer hover:text-indigo-500 hover:underline"
                                                        onClick={() => {
                                                            if (!lead.email) return;
                                                            navigator.clipboard.writeText(lead.email);
                                                            toast({ title: "Copied!", description: "Email copied to clipboard.", duration: 2000 });
                                                        }}
                                                    >
                                                        {lead.email}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Click to copy email</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <span className="text-zinc-900 dark:text-zinc-100">—</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                                    {lead.phone ? (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span
                                                        className="text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer hover:text-indigo-500 hover:underline"
                                                        onClick={() => {
                                                            if (!lead.phone) return;
                                                            navigator.clipboard.writeText(lead.phone);
                                                            toast({ title: "Copied!", description: "Phone number copied to clipboard.", duration: 2000 });
                                                        }}
                                                    >
                                                        +91-{lead.phone}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Click to copy phone number</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <span className="text-zinc-900 dark:text-zinc-100">—</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                    <UserIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <div className="flex items-center gap-3">
                                        <span className={clsx("font-medium", lead.isPicked ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-500")}>
                                            {lead.isPicked ? `Assigned` : 'Unassigned'}
                                        </span>
                                        {!lead.isPicked && (
                                            <TooltipProvider>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const token = getAuthToken();
                                                                const decoded = decodeJwt(token);
                                                                const userId = decoded?.sub as string;
                                                                if (userId) {
                                                                    pickLead.mutate({ id: lead.id, userId });
                                                                } else {
                                                                    toast({ title: 'Error', description: 'User ID not found in token', variant: 'destructive' });
                                                                }
                                                            }}
                                                            disabled={pickLead.isPending && pickLead.variables?.id === lead.id}
                                                            className="px-3 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center gap-1.5 hover:shadow-sm cursor-pointer disabled:cursor-default"
                                                        >
                                                            {pickLead.isPending && pickLead.variables?.id === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                                            Pick
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Assign this lead to yourself</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </div>
                                {lead.tags && lead.tags.length > 0 && (
                                    <div className="flex items-start gap-4 text-sm mt-3">
                                        <Tag className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                        <div className="flex flex-wrap gap-2">
                                            {lead.tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Value */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Value Prediction</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Predicted LTV</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">₹{(lead.predictedLTV || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Current Deal Value</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">₹{(lead.dealValue || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Activity Timeline</h3>

                            {/* Note Input */}
                            <div className="mb-6 flex gap-3">
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note..."
                                    className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/10 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all bg-zinc-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                    disabled={createActivity.isPending}
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={createActivity.isPending || !note.trim()}
                                    className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-lg shadow-zinc-900/10 dark:shadow-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {createActivity.isPending
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Send className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Timeline */}
                            <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-8">
                                {isActivitiesLoading && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading timeline…
                                    </div>
                                )}

                                {!isActivitiesLoading && activities.length === 0 && (
                                    <div className="text-sm text-zinc-500 italic py-4">No activities recorded yet.</div>
                                )}

                                {activities.map((activity) => (
                                    <div key={activity.id} className="relative">
                                        <div className={clsx(
                                            'absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ring-4 ring-zinc-50 dark:ring-zinc-900',
                                            ACTIVITY_DOT[activity.type] ?? 'bg-zinc-300 dark:bg-zinc-700',
                                        )} />
                                        <div className="flex items-start justify-between">
                                            <p className={clsx(
                                                'text-sm font-semibold',
                                                activity.type === 'AI_Insight'
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : activity.type === 'Stage_Change'
                                                        ? 'text-amber-600 dark:text-amber-400'
                                                        : 'text-zinc-900 dark:text-zinc-100',
                                            )}>
                                                {ACTIVITY_TYPE_LABEL[activity.type] ?? activity.type}
                                            </p>
                                            <span className="text-xs text-zinc-400">
                                                {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                        {activity.description && (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{activity.description}</p>
                                        )}
                                        <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                                            {activity.type === 'AI_Insight'
                                                ? <Sparkles className="w-3 h-3" />
                                                : <UserIcon className="w-3 h-3" />}
                                            {activity.userId === 'system' ? 'Nexus AI' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                        </p>
                                    </div>
                                ))}

                                {/* Initial Creation Event — always shown */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-900 dark:bg-zinc-100 ring-4 ring-zinc-50 dark:ring-zinc-900" />
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Lead Created</p>
                                        <span className="text-xs text-zinc-400">{format(new Date(lead.createdAt || new Date()), 'MMM d, yyyy')}</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        Lead captured via {(lead.source || 'Manual').replace(/_/g, ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
