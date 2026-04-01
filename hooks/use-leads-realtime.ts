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
function mapRealtimeLead(row: LeadApiResponse): Partial<Lead> {
    return {
        id: row.id,
        name: row.name ?? 'Unknown',
        email: row.email ?? '',
        phone: row.phone ?? '',
        course: row.course ?? '',
        specialization: row.specialization ?? undefined,
        source: (row.source as Lead['source']) ?? 'Manual',
        campaign: row.campaign ?? undefined,
        tags: row.tags ?? [],
        score: row.score ?? 0,
        aiScore: row.aiScore ?? 0,
        predictedLTV: row.predictedLTV ?? 0,
        nextBestAction: row.nextBestAction ?? 'Follow up',
        isPicked: row.isPicked ?? false,
        pickedBy: row.pickedBy ?? null,
        createdAt: row.createdAt ?? new Date().toISOString(),
        lastInteraction: row.lastInteraction ?? new Date().toISOString(),
        qualificationStatus: (row.qualificationStatus as Lead['qualificationStatus']) ?? 'New_Lead',
        pipelineStage: (row.pipelineStage as Lead['pipelineStage']) ?? 'New_Lead',
        type: (row.type as Lead['type']) ?? 'Cold',
        dealValue: row.dealValue ?? 0,
        nextFollowUp: row.nextFollowUp ?? undefined,
    };
}

export function useLeadsRealtime() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel('lead-changes')

            // INSERT — new enquiry submitted from website form
            // table name is lowercase 'leads' (schema uses @@map("leads"))
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Lead' },
                () => {
                    // Delay refetch by 2s to let Python agent score first
                    setTimeout(() => {
                        queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
                    }, 2000);
                },
            )

            // UPDATE — Python agent patched aiScore / pipelineStage / type
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Lead' },
                (payload) => {
                    const updatedRow = payload.new as LeadApiResponse;

                    // Update cache immediately
                    queryClient.setQueryData<any>(
                        queryKeys.leads.list(),
                        (old: any) => {
                            if (!old) return old;
                            
                            // When using paginated hook or raw cache from useLeads
                            if (old.leads && Array.isArray(old.leads)) {
                                return {
                                    ...old,
                                    leads: old.leads.map((lead: any) =>
                                        lead.id === updatedRow.id
                                            ? { ...lead, ...mapRealtimeLead(updatedRow) }
                                            : lead
                                    )
                                };
                            }

                            // Fallback if the cache is directly an array
                            if (Array.isArray(old)) {
                                return old.map((lead: any) =>
                                    lead.id === updatedRow.id
                                        ? { ...lead, ...mapRealtimeLead(updatedRow) }
                                        : lead
                                );
                            }

                            return old;
                        }
                    );

                    // Also invalidate to refetch fresh data from NestJS
                    // This ensures cache stays in sync after the setQueryData
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.leads.list(),
                        refetchType: 'none' // updates staleTime without triggering refetch
                    });
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
}
