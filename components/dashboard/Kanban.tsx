"use client";
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { DealStage, Lead, LeadStatus, User } from '@/lib/types';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { MoreHorizontal, Calendar, DollarSign, Plus } from 'lucide-react';

const STAGES: DealStage[] = [
    'New Lead',
    'AI Nurturing',
    'Demo Scheduled',
    'Proposal Sent',
    'Negotiation',
    'Closed Won',
];

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Dr. Amit Sharma', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=u1' },
    { id: 'u2', name: 'Ms. Priya Verma', role: 'Sales Manager', avatar: 'https://i.pravatar.cc/150?u=u2' },
    { id: 'u3', name: 'Mr. Rahul Singh', role: 'Marketing Manager', avatar: 'https://i.pravatar.cc/150?u=u3' },
    { id: 'u4', name: 'Ms. Neha Gupta', role: 'Sales Executive', avatar: 'https://i.pravatar.cc/150?u=u4' },
];

const STUDENT_NAMES = [
    'Aarav Sharma', 'Priya Singh', 'Rohit Gupta', 'Sneha Verma', 'Ankur Tiwari',
    'Divya Yadav', 'Karan Mishra', 'Pooja Srivastava', 'Mohit Pandey', 'Riya Agarwal',
    'Amit Kumar', 'Sanya Jain', 'Vikash Rai', 'Nisha Chauhan', 'Harshit Saxena',
    'Priyanka Tripathi', 'Gaurav Awasthi', 'Ananya Dubey', 'Shubham Singh', 'Kajal Patel',
    'Vivek Shukla', 'Deepika Yadav', 'Rahul Kushwaha', 'Meera Tiwari', 'Ayush Bhatia',
    'Ritika Chaudhary', 'Sumit Rajput', 'Pallavi Misra', 'Nikhil Sharma', 'Swati Gupta',
    'Aditya Verma', 'Kavita Singh', 'Piyush Bajpai', 'Tanvi Rastogi', 'Mayank Soni',
    'Shreya Joshi', 'Abhishek Dixit', 'Monika Rawat', 'Tushar Goel', 'Anjali Kapoor',
    'Lokesh Dwivedi', 'Sonal Agarwal', 'Manish Pal', 'Bhavna Pandey', 'Siddharth Kanpur',
    'Renu Varshney', 'Akash Malhotra', 'Nidhi Upadhyay', 'Yash Trivedi', 'Preeti Maurya',
];

const COURSES = [
    'B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech Civil',
    'MBA', 'BBA', 'MCA', 'BCA',
    'B.Pharmacy', 'M.Pharmacy', 'B.Sc Nursing', 'LLB', 'B.Ed',
];

const generateMockLeads = (): Lead[] => {
    const leads: Lead[] = [];
    const stages: DealStage[] = ['New Lead', 'AI Nurturing', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const sources = ['Facebook Ads', 'Google Ads', 'Instagram', 'Website', 'Referral', 'Manual', 'LinkedIn', 'TikTok'];
    const actions = [
        'Send Admission Brochure',
        'Schedule Campus Visit',
        'Call Prospective Student',
        'Send Scholarship Details',
        'Share Placement Report',
        'Invite to Open Day',
        'Follow Up on Application',
        'Connect on LinkedIn',
    ];

    const statusOptions: LeadStatus[] = ['Visitor', 'Lead', 'MQL', 'SQL', 'Opportunity', 'Won', 'Lost'];

    for (let i = 0; i < 50; i++) {
        const stage = stages[Math.floor(Math.random() * stages.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const score = Math.floor(Math.random() * 100);
        const name = STUDENT_NAMES[i % STUDENT_NAMES.length];
        const nameParts = name.split(' ');
        const firstName = nameParts[0].toLowerCase();
        const lastName = (nameParts[1] || 'student').toLowerCase();
        const course = COURSES[Math.floor(Math.random() * COURSES.length)];
        const feeAmount = course.startsWith('M') || course === 'MBA'
            ? Math.floor(Math.random() * 80000) + 80000
            : Math.floor(Math.random() * 60000) + 60000;

        leads.push({
            id: `l${i}`,
            name: name,
            company: course,
            email: `${firstName}.${lastName}${i}@gmail.com`,
            phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
            source: source as any,
            score: score,
            aiScore: Math.min(100, Math.floor(score * (0.8 + Math.random() * 0.4))),
            predictedLTV: feeAmount * (Math.floor(Math.random() * 3) + 1),
            nextBestAction: actions[Math.floor(Math.random() * actions.length)],
            ownerId: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].id,
            createdAt: subDays(new Date(), Math.floor(Math.random() * 45)).toISOString(),
            lastInteraction: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
            status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
            dealValue: feeAmount,
            stage: stage,
            priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
            tags: Math.random() > 0.5 ? ['High Intent'] : ['Nurture'],
            nextFollowUp: Math.random() > 0.4
                ? format(subDays(new Date(), -Math.floor(Math.random() * 7)), 'yyyy-MM-dd')
                : undefined,
        });
    }
    return leads;
};

// Sortable Item Component (Card)
function SortableItem({ lead }: { lead: Lead }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id, data: { type: 'Lead', lead } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 opacity-80 h-[140px] rotate-2"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            // onClick={() => setSelectedLeadId(lead.id)}
            className="bg-white p-4 rounded-xl border border-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:border-zinc-200 transition-all cursor-grab active:cursor-grabbing group"
        >
            <div className="flex justify-between items-start mb-3">
                <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide",
                    lead.priority === 'High' ? "bg-rose-50 text-rose-700" :
                        lead.priority === 'Medium' ? "bg-amber-50 text-amber-700" :
                            "bg-zinc-100 text-zinc-600"
                )}>
                    {lead.priority}
                </span>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5">{lead.name}</h4>
            <p className="text-xs text-[var(--text-secondary)] mb-4">{lead.company}</p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-zinc-900 font-medium bg-zinc-50 px-2 py-1 rounded-md">
                    <DollarSign className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span>{lead.dealValue.toLocaleString()}</span>
                </div>
                {lead.nextFollowUp && (
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(lead.nextFollowUp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Column Component
function Column({ id, leads }: { id: string; leads: Lead[] }) {
    const { setNodeRef } = useSortable({ id: id, data: { type: 'Column', id } });

    return (
        <div className="flex flex-col w-80 shrink-0 h-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                    {id}
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] px-2 py-0.5 rounded-full text-xs font-medium">
                        {leads.length}
                    </span>
                </h3>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-[var(--text-primary)] transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div ref={setNodeRef} className="bg-zinc-50/60 rounded-2xl p-2 flex-1 overflow-y-auto min-h-[100px]">
                <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 pb-20">
                        {leads.map((lead) => (
                            <SortableItem key={lead.id} lead={lead} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}

export default function KanbanBoard() {
    const [leads, setLeads] = useState<Lead[]>([]);

    useEffect(() => {
        setLeads(generateMockLeads());
    }, []);

    const [isAddLeadModalOpen, setAddLeadModalOpen] = useState(false);
    const moveLeadStage = (leadId: string, newStage: DealStage) => {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    };

    // const { leads, moveLeadStage, setAddLeadModalOpen } = useCRMStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: Add logic for visual feedback during drag over columns
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeLeadId = active.id as string;
        const overId = over.id as string;

        // Find the lead being dragged
        const lead = leads.find(l => l.id === activeLeadId);
        if (!lead) return;

        // If dropped on a column container
        if (STAGES.includes(overId as DealStage)) {
            if (lead.stage !== overId) {
                moveLeadStage(activeLeadId, overId as DealStage);
            }
        } else {
            // If dropped on another item, find that item's column
            const overLead = leads.find(l => l.id === overId);
            if (overLead && lead.stage !== overLead.stage) {
                moveLeadStage(activeLeadId, overLead.stage);
            }
        }

        setActiveId(null);
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Admission Pipeline</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Drag and drop student leads to update their admission stage.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                        Filter
                    </button>
                    <button
                        onClick={() => setAddLeadModalOpen(true)}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 flex items-center gap-2"
                    >
                        Add Lead
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-4 h-full scrollbar-hide">
                    {STAGES.map((stage) => (
                        <Column key={stage} id={stage} leads={leads.filter((l) => l.stage === stage)} />
                    ))}
                </div>

                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeLead ? <div className="transform rotate-3"><SortableItem lead={activeLead} /></div> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
