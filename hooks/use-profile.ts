import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, UpdateProfilePayload } from '@/lib/user-api';
import { queryKeys } from '@/lib/query-keys';
import { useToast } from '@/hooks/use-toast';

/* ─────────────────────────────────────────────────────────────────────────────
 * useGetProfile
 * Fetches the authenticated user's profile by their database ID (from JWT sub).
 * Enabled only when a valid userId is provided.
 * ───────────────────────────────────────────────────────────────────────────── */
export function useGetProfile(userId: string | null) {
    return useQuery({
        queryKey: queryKeys.users.profile(userId ?? ''),
        queryFn: () => userApi.getById(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * useUpdateProfile
 * PATCHes safe profile fields (username, contact, designation, gender).
 * On success: invalidates the profile cache and shows a toast.
 * Executive role constraints are preserved — role/status/email are never sent.
 * ───────────────────────────────────────────────────────────────────────────── */
export function useUpdateProfile(userId: string | null) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => {
            if (!userId) throw new Error('User ID is not available');
            return userApi.updateById(userId, payload);
        },

        onSuccess: () => {
            if (userId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.users.profile(userId),
                });
            }
            toast({
                title: 'Profile updated',
                description: 'Your profile has been saved successfully.',
            });
        },

        onError: (error: Error) => {
            let message = 'Could not update profile. Please try again.';
            try {
                const parsed = JSON.parse(error.message);
                message = parsed?.message || message;
            } catch {
                message = error.message || message;
            }
            toast({
                title: 'Update failed',
                description: message,
                variant: 'destructive',
            });
        },
    });
}
