'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/query-keys';
import { Lead } from '@/lib/types';
import { LeadApiResponse } from '@/lib/leads-api';

/**
Form submit → INSERT fires → invalidateQueries → NestJS refetch 
→ lead appears with real name, score=0

~1s later → Python agent PATCHes → UPDATE fires → 
→ setQueryData patches score in-place → score flicks to 30
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

export function useLeadsRealtime() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('lead-changes')

            // INSERT — immediately refetch the full list from NestJS.
            // This shows the lead with real name + score=0.
            // No setTimeout, no getById — just a clean refetch.
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Lead' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
                },
            )

            // UPDATE — Python agent patched aiScore/priority.
            // Merge into cache instantly without triggering a refetch.
            // This is what makes the score "flick" live.
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Lead' },
                (payload) => {
                    const updatedRow = payload.new as LeadApiResponse;

                    queryClient.setQueryData<Lead[]>(
                        queryKeys.leads.list(),
                        (old) => {
                            if (!old) return old;
                            return old.map((lead) =>
                                lead.id === updatedRow.id
                                    ? { ...lead, ...mapRealtimeLead(updatedRow) }
                                    : lead
                            );
                        }
                    );

                    queryClient.setQueryData<Lead>(
                        queryKeys.leads.detail(updatedRow.id),
                        (old) => old ? { ...old, ...mapRealtimeLead(updatedRow) } : old,
                    );
                },
            )

            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Supabase Realtime] ✅ Subscribed to Lead changes');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('[Supabase Realtime] ❌ Channel error', err ?? '');
                }
                if (status === 'TIMED_OUT') {
                    console.warn('[Supabase Realtime] ⚠️ Timed out — retrying...');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
};
