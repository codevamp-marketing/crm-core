import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/lib/leads-api';
import { activitiesApi, CreateActivityPayload } from '@/lib/activities-api';
import { queryKeys } from '@/lib/query-keys';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetches full lead detail (with owner, feedItems) + its activity timeline.
 * Used by LeadDetailSheet when a lead is selected.
 *
 * The lead's activities are fetched separately so they can be independently
 * invalidated (e.g. after posting a note) without refetching the whole leads list.
 */
export function useLeadDetail(leadId: string | null) {
    const lead = useQuery({
        queryKey: queryKeys.leads.detail(leadId ?? ''),
        queryFn: () => leadsApi.getById(leadId!),
        enabled: !!leadId,
        staleTime: 30_000,
    });

    const activities = useQuery({
        queryKey: queryKeys.activities.byLead(leadId ?? ''),
        queryFn: () => activitiesApi.getByLead(leadId!),
        enabled: !!leadId,
        staleTime: 15_000,
    });

    return {
        lead: lead.data ?? null,
        activities: activities.data ?? [],
        isLoading: lead.isLoading,
        isActivitiesLoading: activities.isLoading,
        error: lead.error,
    };
}

/**
 * Mutation to create an activity (note, call log, etc.) for a lead.
 * Invalidates the activity timeline on success so it re-fetches.
 */
export function useCreateActivity() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: CreateActivityPayload) => activitiesApi.create(payload),
        onSuccess: (activity) => {
            // Refresh this lead's timeline
            queryClient.invalidateQueries({
                queryKey: queryKeys.activities.byLead(activity.leadId),
            });
            toast({ title: 'Note added', description: 'Activity logged successfully.' });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to save activity.',
                variant: 'destructive',
            });
        },
    });
}
