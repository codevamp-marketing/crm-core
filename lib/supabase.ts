import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client for the CRM frontend.
 *
 * Uses the public ANON key — safe to expose in browser.
 * Realtime subscriptions use Row Level Security (RLS) policies,
 * so only rows the user has SELECT access to are streamed.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon, {
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});
