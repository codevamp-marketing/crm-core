'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/query-keys';
import { Activity } from '@/lib/types';

/**
 * Subscribes to ALL Activity INSERTs on the table,
 * then filters client-side by leadId — exactly like use-leads-realtime.ts.
 *
 * WHY no server-side filter:
 * Supabase Realtime column-level filters require REPLICA IDENTITY FULL
 * on the table. Without it the subscription silently fails (no SUBSCRIBED log).
 * Filtering client-side is zero extra cost for low-volume activity events.
 */
export function useActivitiesRealtime(leadId: string | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!leadId) return;

        const channel = supabase
            .channel('activity-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Activity' },
                (payload) => {
                    const newRow = payload.new as {
                        id: string;
                        leadId?: string | null;
                        userId?: string | null;
                        type: Activity['type'];
                        description?: string | null;
                        timestamp: string;
                    };

                    // Only update cache for the currently open lead
                    if (newRow.leadId !== leadId) return;

                    const newActivity: Activity = {
                        id: newRow.id,
                        leadId: newRow.leadId ?? '',
                        userId: newRow.userId ?? 'system',
                        type: newRow.type,
                        description: newRow.description ?? '',
                        timestamp: newRow.timestamp,
                    };

                    queryClient.setQueryData<Activity[]>(
                        queryKeys.activities.byLead(leadId),
                        (old) => {
                            if (!old) return [newActivity];
                            // Prevent duplicates
                            if (old.some(a => a.id === newActivity.id)) return old;
                            // Prepend and keep sorted newest-first
                            return [newActivity, ...old].sort(
                                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                            );
                        }
                    );
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`[Supabase Realtime] ✅ Subscribed to Activity changes`);
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('[Supabase Realtime] ❌ Activity channel error', err ?? '');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, leadId]);
}
