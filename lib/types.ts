/* ── Auth / User enums ──────────────────────────────────────── */
export type Role = 'admin' | 'manager' | 'executive';
export type Gender = 'male' | 'female' | 'other';
export type UserStatus = 'active' | 'inactive';

// Where the lead came from
export type LeadSource = 'Facebook_Ads' | 'Google_Ads' | 'Instagram' | 'Website' | 'Referral' | 'Manual' | 'LinkedIn' | 'TikTok';

// Marketing funnel qualification (used in analytics/WAR dashboard)
export type LeadQualificationStatus = 'Visitor' | 'New_Lead' | 'MQL' | 'SQL' | 'Opportunity' | 'Won' | 'Lost';

// Kanban pipeline stage — drives the Kanban board columns
// Values match Prisma enum names exactly (underscore-based, no spaces)
export type PipelineStage =
    | 'New_Lead'
    | 'First_Contact'
    | 'AI_Nurturing'
    | 'Demo_Scheduled'
    | 'Proposal_Sent'
    | 'Negotiation'
    | 'Closed_Won'
    | 'Closed_Lost';

// Human-readable display labels for each pipeline stage
export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
    New_Lead: 'New Lead',
    First_Contact: 'First Contact',
    AI_Nurturing: 'AI Nurturing',
    Demo_Scheduled: 'Demo Scheduled',
    Proposal_Sent: 'Proposal Sent',
    Negotiation: 'Negotiation',
    Closed_Won: 'Closed Won',
    Closed_Lost: 'Closed Lost',
};

export type LeadType = 'Hot' | 'Warm' | 'Cold';

export interface User {
    id: string;
    username?: string | null;
    email?: string | null;
    contact?: string | null;
    designation?: string | null;
    gender?: Gender | null;
    status?: UserStatus | null;
    role?: Role | null;
    avatar?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

/** Payload shape for POST /api/v1/create-user */
export interface CreateUserPayload {
    username?: string;
    email?: string;
    password?: string;
    gender?: Gender;
    role?: Role;
}

export interface Activity {
    id: string;
    leadId: string;
    type: 'Call' | 'Email' | 'WhatsApp' | 'Meeting' | 'Note' | 'Stage_Change' | 'AI_Insight' | 'Campaign_Interaction';
    description: string;
    metadata?: Record<string, string> | null;
    timestamp: string;
    userId: string;
}

export interface LeadNote {
    id: string;
    leadId: string;
    userId?: string | null;
    type: Activity['type'];
    body: string;
    createdAt: string;
    user?: Pick<User, 'id' | 'username' | 'avatar'> | null;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    // Education-specific
    course: string;
    specialization?: string;
    // CRM
    source: LeadSource;
    campaign?: string;
    tags: string[];
    // Scores (AI)
    score: number;          // 0–100 rule-based
    aiScore: number;        // 0–100 ML conversion probability
    predictedLTV: number;   // Predicted fee revenue (INR)
    nextBestAction: string; // AI recommended action
    // Pipeline
    pipelineStage: PipelineStage;
    qualificationStatus: LeadQualificationStatus;
    type: LeadType;
    dealValue: number;
    // Ownership
    ownerId: string;
    nextFollowUp?: string;
    createdAt: string;
    lastInteraction: string;
    // Relations (optional, only on detail views)
    owner?: Pick<User, 'id' | 'username' | 'avatar'> | null;
    leadNotes?: LeadNote[];
    activities?: Activity[];
}

export interface Campaign {
    id: string;
    name: string;
    platform: 'Google' | 'Facebook' | 'LinkedIn' | 'Email' | 'Instagram' | 'WhatsApp';
    status: 'Active' | 'Paused' | 'Completed' | 'Draft';
    budget: number;
    spent: number;
    clicks: number;
    conversions: number;
    aiOptimizationScore: number;
    roi: number;
}

export type FeedType = 'Social_Post' | 'Blog_Article' | 'SEO_Page' | 'Ad_Creative';

export interface FeedItem {
    id: string;
    type: FeedType;
    title: string;
    content: string;
    platform: 'Facebook' | 'LinkedIn' | 'Twitter' | 'Instagram' | 'Website' | 'Medium';
    url: string;
    timestamp: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
    linkedLeadIds: string[];
}
