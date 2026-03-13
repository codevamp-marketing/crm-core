import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/lib/leads-api';
import { queryKeys } from '@/lib/query-keys';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetch all leads from the REST API.
 */
export function useLeads() {
    return useQuery({
        queryKey: queryKeys.leads.list(),
        queryFn: leadsApi.getAll,
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
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
            toast({
                title: 'Lead created',
                description: 'New lead has been added successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create lead.',
                variant: 'destructive',
            });
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
        mutationFn: (payload: Parameters<typeof leadsApi.update>[1]) =>
            leadsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
            toast({
                title: 'Lead updated',
                description: 'Lead has been updated successfully.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update lead.',
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
            queryClient.invalidateQueries({ queryKey: queryKeys.leads.list() });
            toast({
                title: 'Lead deleted',
                description: 'Lead has been removed.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete lead.',
                variant: 'destructive',
            });
        },
    });
}
