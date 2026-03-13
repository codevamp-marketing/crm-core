import { useMutation } from '@tanstack/react-query';
import { authApi, LoginPayload } from '@/lib/auth-api';
import { useToast } from '@/hooks/use-toast';
import { CreateUserPayload } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { navigationPaths } from '@/lib/navigation';

/* ─────────────────────────────────────────────────────────────────────────────
 * useLogin
 * Returns a mutation whose mutateAsync resolves to the raw LoginResponse so
 * the calling component (LoginForm) can handle token storage & role-based
 * redirect itself.
 * ───────────────────────────────────────────────────────────────────────────── */
export function useLogin() {
    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),
        // No onSuccess / onError — LoginForm handles these so it can do
        // role-aware redirects and explicit cookie writes.
    });
}

/* ─────────────────────────────────────────────────────────────────────────────
 * useSignup
 * Calls POST /api/v1/create-user.
 * On success: toasts and redirects to /login to sign in.
 * ───────────────────────────────────────────────────────────────────────────── */
export function useSignup() {
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: CreateUserPayload) => authApi.signup(payload),

        onSuccess: (user) => {
            toast({
                title: 'Account created! 🎉',
                description: `Welcome to Nexus AI${user.username ? `, ${user.username}` : ''}! Sign in to get started.`,
            });
            router.push(navigationPaths.login);
        },

        onError: (error: Error) => {
            let message = 'Could not create your account. Please try again.';
            try {
                const parsed = JSON.parse(error.message);
                message = parsed?.message || message;
            } catch {
                message = error.message || message;
            }

            toast({
                title: 'Sign up failed',
                description: message,
                variant: 'destructive',
            });
        },
    });
}
