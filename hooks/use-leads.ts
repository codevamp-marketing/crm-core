import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { leadsApi, GetAllLeadsParams } from '@/lib/leads-api';
import { queryKeys } from '@/lib/query-keys';
import { PipelineStage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetch all leads from the REST API (paginated).
 */
export function useLeads(params?: GetAllLeadsParams) {
    return useQuery({
        queryKey: queryKeys.leads.list(params),
        queryFn: () => leadsApi.getAll(params),
        select: (res) => res.leads,
        staleTime: 30_000,
    });
}

/**
 * Fetch all leads — returns the full paginated response (total, pages, etc.)
 */
export function useLeadsPaginated(params?: GetAllLeadsParams) {
    return useQuery({
        queryKey: queryKeys.leads.list(params),
        queryFn: () => leadsApi.getAll(params),
        staleTime: 30_000,
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetch a single lead by ID.
 */
export function useLeadById(id: string) {
    return useQuery({
        queryKey: queryKeys.leads.detail(id),
        queryFn: () => leadsApi.getById(id),
        enabled: !!id,
    });
}

/**
 * Create a new lead mutation.
 */
export function useCreateLead() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: leadsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
            toast({ title: 'Lead created', description: 'New lead has been added successfully.' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message || 'Failed to create lead.', variant: 'destructive' });
        },
    });
}

/**
 * Update an existing lead mutation.
 */
export function useUpdateLead(id: string) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: Parameters<typeof leadsApi.update>[1]) => leadsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
            toast({ title: 'Lead updated', description: 'Lead has been updated successfully.' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message || 'Failed to update lead.', variant: 'destructive' });
        },
    });
}

/**
 * Move a lead to a new Kanban pipeline stage.
 * Used by the Kanban drag-end handler.
 * Performs optimistic update so the UI moves instantly, then syncs with the server.
 */
export function useMoveLeadStage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: PipelineStage }) =>
            leadsApi.moveStage(id, stage),

        // ── Optimistic update ─────────────────────────────────────────────
        onMutate: async ({ id, stage }) => {
            // Cancel any in-flight refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });

            // Snapshot the previous leads list (any params variant)
            const previousData = queryClient.getQueriesData<{ leads: any[] }>({ queryKey: queryKeys.leads.all });

            // Optimistically update all cached lead lists
            queryClient.setQueriesData<{ leads: any[]; total: number; totalPages: number }>(
                { queryKey: queryKeys.leads.all },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        leads: old.leads.map((lead) =>
                            lead.id === id ? { ...lead, pipelineStage: stage } : lead
                        ),
                    };
                }
            );

            return { previousData };
        },

        // ── On success — invalidate to get server-fresh data ──────────────
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
        },

        // ── On error — roll back the optimistic update ────────────────────
        onError: (error: Error, _vars, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            toast({
                title: 'Failed to move lead',
                description: error.message || 'Could not update the pipeline stage.',
                variant: 'destructive',
            });
        },
    });
}

/**
 * Delete lead mutation.
 */
export function useDeleteLead() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: leadsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
            toast({ title: 'Lead deleted', description: 'Lead has been removed.' });
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message || 'Failed to delete lead.', variant: 'destructive' });
        },
    });
}
