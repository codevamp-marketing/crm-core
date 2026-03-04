"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    Mail,
    Lock,
    TrendingUp,
    Users,
    BarChart3,
    Zap,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { navigationPaths } from '@/lib/navigation';
import { useLogin } from '@/hooks/use-auth';
import { setCookie, decodeJwt } from '@/lib/utils';
import { getRoleDashboardPath } from '@/lib/rbac';

/* ─── Zod schema ─────────────────────────────────────────────── */
const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, "Password Must Be 8 Characters Long")
        .regex(/[A-Z]/, "Password Must Contain At Least 1 Uppercase Letter")
        .regex(/[a-z]/, "Password Must Contain At Least 1 Lowercase Letter")
        .regex(/[0-9]/, "Password Must Contain At Least 1 Number")
        .regex(/[^\w]/, "Password Must Contain At Least 1 Special Character")
        .max(20, "Password cannot be more than 20 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/* ─── Animated feature pill ──────────────────────────────────── */
const FEATURES = [
    { icon: TrendingUp, label: 'Real-time pipeline tracking' },
    { icon: Users, label: 'Multi-source lead capture' },
    { icon: BarChart3, label: 'AI-powered lead scoring' },
    { icon: Zap, label: 'Workflow automation' },
];

/* ─── Floating orb ───────────────────────────────────────────── */
function Orb({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
            style={style}
        />
    );
}

/* ─── Main component ─────────────────────────────────────────── */
export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginMutation = useLogin();
    const { toast } = useToast();

    // If middleware bounced the user here from a protected route, honour it
    // after login (safe-guard: only allow same-origin relative paths).
    const fromParam = searchParams.get('from');
    const redirectAfterLogin = fromParam?.startsWith('/') ? fromParam : null;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            const response = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password,
            });

            if (!response?.access_token) {
                toast({
                    title: 'Login failed',
                    description: response?.message || 'Invalid email or password.',
                    variant: 'destructive',
                });
                return;
            }

            // ── Save token to cookie (1-day expiry) ───────────────────────────
            setCookie('token', response.access_token, 1);

            // ── Decode JWT to get role ────────────────────────────────────────
            const decoded = decodeJwt(response.access_token);
            const role = decoded?.role as string | undefined;

            toast({
                title: 'Welcome back! 👋',
                description: response.message || 'Logged in successfully.',
            });

            // ── Redirect: honour ?from= param, else fall back to role dashboard
            router.push(redirectAfterLogin ?? getRoleDashboardPath(role));
        } catch (error: any) {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isSubmitting || loginMutation.isPending;

    return (
        <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">

            {/* ── LEFT PANEL — branding ──────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex flex-1 relative flex-col p-14 overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                }}
            >
                {/* Decorative orbs */}
                <Orb className="w-96 h-96 -top-24 -left-24 opacity-30" style={{ background: '#3b82f6' }} />
                <Orb className="w-72 h-72 top-1/2 -right-16 opacity-20" style={{ background: '#8b5cf6' }} />
                <Orb className="w-64 h-64 bottom-10 left-1/3 opacity-15" style={{ background: '#06b6d4' }} />

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Container aligned to the right (inner split) */}
                <div className="w-full max-w-[440px] ml-auto flex flex-col justify-between h-full relative z-10">
                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-zinc-900 font-black text-lg">N</span>
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">Nexus AI</span>
                    </div>

                    {/* Hero copy */}
                    <div className="relative z-10 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                        >
                            <p
                                className="text-xs font-bold uppercase tracking-widest mb-4"
                                style={{ color: '#60a5fa' }}
                            >
                                AI-Powered Lead CRM
                            </p>
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                Convert every
                                <br />
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #22d3ee 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    lead into revenue
                                </span>
                            </h1>
                            <p className="mt-4 text-white/60 text-lg leading-relaxed max-w-sm">
                                Capture leads from Facebook, Instagram, Google Ads, and your website
                                — all in one intelligent pipeline.
                            </p>
                        </motion.div>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="space-y-3"
                        >
                            {FEATURES.map((f, i) => (
                                <motion.div
                                    key={f.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(99,102,241,0.25)' }}
                                    >
                                        <f.icon className="w-4 h-4" style={{ color: '#a5b4fc' }} />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">{f.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom quote */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="relative z-10 border-t border-white/10 pt-8"
                    >
                        <p className="text-white/50 text-sm italic">
                            &quot;Nexus AI cut our lead response time from 4 hours to 8 minutes.&quot;
                        </p>
                        <p className="text-white/30 text-xs mt-2">— VP Sales, FinServ Pvt. Ltd.</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL — form ─────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
                {/* Subtle background orb in light mode */}
                <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-[0.06] pointer-events-none"
                    style={{ background: '#3b82f6' }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-9 h-9 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
                            <span className="text-white dark:text-zinc-900 font-black">N</span>
                        </div>
                        <span className="text-xl font-bold" style={{ color: '#3b82f6' }}>Nexus AI</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    {/* Form card */}
                    <div
                        className="rounded-2xl border border-border/60 p-8 shadow-xl"
                        style={{ background: 'hsl(var(--card))' }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@company.com"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-destructive text-xs font-medium mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                                        Password
                                    </Label>
                                    {/* <Link
                                        href="/forgot-password"
                                        className="text-xs text-blue-500 hover:text-blue-600 hover:underline font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link> */}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 pr-11 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer"
                                    >
                                        {showPassword
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-destructive text-xs font-medium mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-2 rounded-xl font-bold text-base text-white shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                style={{
                                    background: isLoading
                                        ? 'rgba(59,130,246,0.7)'
                                        : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-muted-foreground text-sm mt-6">
                        Don&apos;t have an account?{' '}
                        <Link
                            href={navigationPaths.signup}
                            className="font-semibold hover:underline transition-colors"
                            style={{ color: '#3b82f6' }}
                        >
                            Sign Up
                        </Link>
                    </p>

                    {/* Back to home */}
                    <p className="text-center mt-3">
                        <Link
                            href="/"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Nexus AI
                        </Link>
                    </p>
                </motion.div>
            </div>

        </div>
    );
}

export default LoginForm;
