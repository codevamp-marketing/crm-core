import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, Clock, Tag, User as UserIcon, Send, Sparkles, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { Lead, Activity } from '@/lib/types';
import { format } from 'date-fns';
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

interface LeadDetailSheetProps {
    lead: Lead | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeadDetailSheet({ lead, open, onOpenChange }: LeadDetailSheetProps) {
    const [note, setNote] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // If modal is closed or lead is missing, just don't render content
    // We render Sheet to handle animations, but content needs lead
    if (!lead) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg p-0 border-l border-zinc-100" />
            </Sheet>
        );
    }

    const leadActivities = lead.activities
        ? [...lead.activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [];

    const handleAddNote = () => {
        if (!note.trim()) return;
        // Mocking note addition for now
        console.log("Adding note:", note);
        setNote('');
    };

    const generateAiContent = () => {
        setIsGenerating(true);
        setTimeout(() => {
            console.log("AI Content Generated");
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* SheetContent has default padding and close button. We override padding with p-0 and let the default close button exist, or hide it with tailwind if custom is better. We'll use hide default and provide our own in header */}
            <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col h-full border-l border-zinc-100 [&>button]:hidden">
                {/* Header */}
                <div className="p-8 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{lead.name}</h2>
                            <span className={clsx(
                                "px-2.5 py-1 rounded-full text-xs font-medium border",
                                lead.pipelineStage === 'Closed_Won' ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" :
                                    lead.pipelineStage === 'Closed_Lost' ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" :
                                        "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                            )}>
                                {(lead.pipelineStage || 'New_Lead').replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{lead.course} {lead.specialization ? `- ${lead.specialization}` : ''}</p>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* AI Insights Section */}
                    <div className="p-8 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">AI Insights</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Conversion Probability</span>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lead.aiScore || 0}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lead.aiScore || 0}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Next Best Action</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{lead.nextBestAction || 'No action recommended'}</p>
                                    <button
                                        onClick={generateAiContent}
                                        disabled={isGenerating || !lead.nextBestAction}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    >
                                        {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-3 h-3" />}
                                        Execute
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-8 grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-800">
                        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">Email</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">Call</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-zinc-900 dark:group-hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200">Meeting</span>
                        </button>
                    </div>

                    {/* Details */}
                    <div className="p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Lead Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span className="text-zinc-900 dark:text-zinc-100 break-all">{lead.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span className="text-zinc-900 dark:text-zinc-100">+91-{lead.phone || '—'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <UserIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span className="text-zinc-900 dark:text-zinc-100">Owner: {lead.owner?.username || 'System'}</span>
                                </div>
                                {lead.tags && lead.tags.length > 0 && (
                                    <div className="flex items-start gap-4 text-sm">
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

                        {/* Timeline / Activity */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Activity Timeline</h3>

                            {/* Add Note Input */}
                            <div className="mb-6 flex gap-3">
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note..."
                                    className="flex-1 px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/10 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all bg-zinc-50 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                />
                                <button
                                    onClick={handleAddNote}
                                    className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-lg shadow-zinc-900/10 dark:shadow-none"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-8">
                                {leadActivities.map((activity) => (
                                    <div key={activity.id} className="relative">
                                        <div className={clsx(
                                            "absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 ring-4 ring-zinc-50 dark:ring-zinc-900",
                                            activity.type === 'AI_Insight' ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"
                                        )}></div>
                                        <div className="flex items-start justify-between">
                                            <p className={clsx("text-sm font-semibold", activity.type === 'AI_Insight' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-900 dark:text-zinc-100")}>
                                                {(activity.type || 'Activity').replace('_', ' ')}
                                            </p>
                                            <span className="text-xs text-zinc-400">{format(new Date(activity.timestamp), 'MMM d, h:mm a')}</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{activity.description}</p>
                                        <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                                            {activity.type === 'AI_Insight' ? <Sparkles className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                            {activity.userId === 'system' ? 'Nexus AI' : 'User'}
                                        </p>
                                    </div>
                                ))}

                                {leadActivities.length === 0 && (
                                    <div className="text-sm text-zinc-500 italic py-4">No activities recorded yet.</div>
                                )}

                                {/* Initial Creation Event */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-900 dark:bg-zinc-100 ring-4 ring-zinc-50 dark:ring-zinc-900"></div>
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Lead Created</p>
                                        <span className="text-xs text-zinc-400">{format(new Date(lead.createdAt || new Date()), 'MMM d, yyyy')}</span>
                                    </div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Lead captured via {(lead.source || 'Manual').replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
