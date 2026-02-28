import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, LoginPayload } from '@/lib/auth-api';
import { useToast } from '@/hooks/use-toast';
import { setCookie } from '@/lib/utils';
import { navigationPaths } from '@/lib/navigation';
import { CreateUserPayload } from '@/lib/types';

/* ─────────────────────────────────────────────────────────────
 * useLogin
 * On success: stores JWT in cookie, toasts, then redirects to
 * the dashboard.
 * ───────────────────────────────────────────────────────────── */
export function useLogin() {
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),

        onSuccess: (data) => {
            setCookie('token', data.access_token, 1); // 1-day cookie

            toast({
                title: 'Welcome back! 👋',
                description: data.message || 'Logged in successfully.',
            });

            router.push(navigationPaths.dashboard);
        },

        onError: (error: Error) => {
            let message = 'Invalid email or password. Please try again.';
            try {
                const parsed = JSON.parse(error.message);
                message = parsed?.message || message;
            } catch {
                message = error.message || message;
            }

            toast({
                title: 'Login failed',
                description: message,
                variant: 'destructive',
            });
        },
    });
}

/* ─────────────────────────────────────────────────────────────
 * useSignup
 * Calls POST /api/v1/create-user.
 * On success: toasts and redirects to /login to sign in.
 * ───────────────────────────────────────────────────────────── */
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
