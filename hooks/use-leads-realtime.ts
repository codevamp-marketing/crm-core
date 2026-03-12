'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/query-keys';
import { Lead } from '@/lib/types';
import { LeadApiResponse } from '@/lib/leads-api';

/**
 * Maps a raw Supabase Realtime payload row (which mirrors the DB columns)
 * into the frontend Lead shape used by the React Query cache.
 *
 * Only used for UPDATE events — INSERT events refetch via invalidateQueries
 * because the realtime INSERT payload can arrive before the row is fully committed.
 */
function mapRealtimeLead(row: LeadApiResponse): Lead {
    return {
        id: row.id,
        name: row.name ?? 'Unknown',
        company: row.company ?? (row as any).course ?? '',
        email: row.email ?? '',
        phone: row.phone ?? '',
        source: (row.source as Lead['source']) ?? 'Manual',
        campaign: row.campaign ?? undefined,
        tags: row.tags ?? [],
        score: row.score ?? 0,
        aiScore: row.aiScore ?? 0,
        predictedLTV: row.predictedLTV ?? 0,
        nextBestAction: row.nextBestAction ?? 'Follow up',
        ownerId: row.ownerId ?? '',
        createdAt: row.createdAt ?? new Date().toISOString(),
        lastInteraction: row.lastInteraction ?? new Date().toISOString(),
        status: (row.status as Lead['status']) ?? 'Lead',
        dealValue: row.dealValue ?? 0,
        stage: (row.stage as Lead['stage']) ?? 'New Lead',
        priority: (row.priority as Lead['priority']) ?? 'Medium',
        nextFollowUp: row.nextFollowUp ?? undefined,
    };
}

/**
 * useLeadsRealtime
 *
 * Opens a Supabase Realtime WebSocket channel on the `Lead` table and
 * patches the React Query cache in real time — no polling, no page refresh.
 *
 * INSERT event  → invalidates the list query so React Query refetches fresh
 *                 data from the API (avoids empty payload timing issue)
 * UPDATE event  → merges changed fields (e.g. aiScore, nextBestAction
 *                 written back by the Python ranking agent) into the cache
 */
export function useLeadsRealtime() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('lead-changes')
            // ── New lead created (website form submit) ────────────────────
            // Realtime INSERT payloads can arrive before Postgres fully commits
            // the row, resulting in an empty payload.new object.
            // Solution: invalidate the query and let React Query refetch cleanly.
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Lead' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
                },
            )
            // ── Lead updated (Python agent writes aiScore / nextBestAction) ─
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Lead' },
                (payload) => {
                    const updatedRow = payload.new as LeadApiResponse;
                    queryClient.setQueryData<Lead[]>(
                        queryKeys.leads.list(),
                        (old) =>
                            (old ?? []).map((lead) =>
                                lead.id === updatedRow.id
                                    ? { ...lead, ...mapRealtimeLead(updatedRow) }
                                    : lead,
                            ),
                    );
                    // Also patch the detail query if it's cached
                    queryClient.setQueryData<Lead>(
                        queryKeys.leads.detail(updatedRow.id),
                        (old) =>
                            old ? { ...old, ...mapRealtimeLead(updatedRow) } : old,
                    );
                    // Invalidate queries to ensure we eventually get the true server state.
                    // This fixes the race condition where the INSERT trigger's fetch overwrites the aiScore
                    // because it arrives AFTER the Python Agent's UPDATE completes.
                    queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
                    queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(updatedRow.id) });
                },
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Supabase Realtime] ✅ Subscribed to Lead changes — live updates active');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error(
                        '[Supabase Realtime] ❌ Channel error.\n' +
                        '→ Most likely cause: RLS policy is blocking the anon role.\n' +
                        '→ Fix: Run this in Supabase SQL Editor:\n' +
                        '   ALTER TABLE "Lead" DISABLE ROW LEVEL SECURITY;\n' +
                        '   (or add a SELECT policy for the anon role)\n',
                        err ?? ''
                    );
                }
                if (status === 'TIMED_OUT') {
                    console.warn('[Supabase Realtime] ⚠️ Connection timed out — will retry automatically.');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
}
