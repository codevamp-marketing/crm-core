"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    Mail,
    Lock,
    User,
    BadgeCheck,
    CheckCircle2,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { navigationPaths } from '@/lib/navigation';
import { useSignup } from '@/hooks/use-auth';

/* ─── Zod schema ─────────────────────────────────────────────── */
const signupSchema = z.object({
    username: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name too long')
        .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),

    email: z.string().email('Enter a valid email').toLowerCase().trim(),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(30, 'Password too long'),

    confirmPassword: z.string(),

    gender: z.enum(['male', 'female', 'other']),

    role: z.enum(['admin', 'manager', 'executive']),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

/* ─── Decorative floating orb ────────────────────────────────── */
function Orb({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
            style={style}
        />
    );
}

/* ─── Right-panel feature list ───────────────────────────────── */
const PERKS = [
    'Capture leads from Facebook, Instagram & Google Ads',
    'AI-powered lead scoring & predicted LTV',
    'Assign roles — Admin, Manager or Executive',
    'Real-time pipeline with full activity timeline',
];

/* ─── SELECT helper ──────────────────────────────────────────── */
function SelectField({
    id,
    label,
    options,
    value,
    onChange,
    error,
    disabled,
    placeholder,
}: {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    error?: string;
    disabled?: boolean;
    placeholder: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-semibold text-foreground">
                {label}
            </Label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 cursor-pointer"
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p className="text-destructive text-xs font-medium">{error}</p>}
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────── */
export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();
    const signupMutation = useSignup();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: 'other',
            role: 'executive',
        },
    });

    const onSubmit = (data: SignupFormData) => {
        const { confirmPassword, ...payload } = data;
        signupMutation.mutate(payload);
    };

    const isLoading = signupMutation.isPending;

    return (
        <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">

            {/* ── LEFT PANEL — form ─────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 relative">
                <div
                    className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-[0.05] pointer-events-none"
                    style={{ background: '#8b5cf6' }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-9 h-9 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center">
                            <span className="text-white dark:text-zinc-900 font-black">N</span>
                        </div>
                        <span className="text-xl font-bold" style={{ color: '#6366f1' }}>Nexus AI</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-5">
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-muted-foreground text-sm">
                            Join Nexus AI and start converting leads into revenue.
                        </p>
                    </div>

                    {/* Form card */}
                    <div
                        className="rounded-2xl border border-border/60 p-6 shadow-xl space-y-3"
                        style={{ background: 'hsl(var(--card))' }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">

                            {/* Full name */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        autoComplete="name"
                                        {...register('username')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-destructive text-xs font-medium">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                                    Work Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        autoComplete="email"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-destructive text-xs font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Role + Gender — two columns */}
                            <div className="grid grid-cols-2 gap-3">
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectField
                                            id="role"
                                            label="Role"
                                            placeholder="Select role"
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isLoading}
                                            error={errors.role?.message}
                                            options={[
                                                { value: 'admin', label: '⚡ Admin' },
                                                { value: 'manager', label: '📊 Manager' },
                                                { value: 'executive', label: '🎯 Executive' },
                                            ]}
                                        />
                                    )}
                                />
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectField
                                            id="gender"
                                            label="Gender"
                                            placeholder="Select"
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={isLoading}
                                            error={errors.gender?.message}
                                            options={[
                                                { value: 'male', label: 'Male' },
                                                { value: 'female', label: 'Female' },
                                                { value: 'other', label: 'Other' },
                                            ]}
                                        />
                                    )}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        autoComplete="new-password"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 pr-11 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-destructive text-xs font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        autoComplete="new-password"
                                        {...register('confirmPassword')}
                                        disabled={isLoading}
                                        className="h-11 pl-10 pr-11 rounded-xl bg-background border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all"
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-destructive text-xs font-medium">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 mt-1 rounded-xl font-bold text-base text-white shadow-lg hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                style={{
                                    background: isLoading
                                        ? 'rgba(99,102,241,0.7)'
                                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Sign in link */}
                    <p className="text-center text-muted-foreground text-sm mt-4">
                        Already have an account?{' '}
                        <Link
                            href={navigationPaths.login}
                            className="font-semibold hover:underline transition-colors"
                            style={{ color: '#6366f1' }}
                        >
                            Sign in
                        </Link>
                    </p>
                    <p className="text-center mt-1">
                        <Link
                            href="/"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Nexus AI
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* ── RIGHT PANEL — branding ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex flex-1 relative flex-col p-14 overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                }}
            >
                {/* Orbs */}
                <Orb className="w-80 h-80 -top-20 -right-20 opacity-25" style={{ background: '#8b5cf6' }} />
                <Orb className="w-64 h-64 bottom-1/3 -left-16 opacity-20" style={{ background: '#3b82f6' }} />
                <Orb className="w-56 h-56 bottom-10 right-1/4 opacity-15" style={{ background: '#06b6d4' }} />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Container aligned to the left (inner split) */}
                <div className="w-full max-w-[440px] mr-auto flex flex-col justify-between h-full relative z-10">
                    {/* Top logo */}
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
                                style={{ color: '#a78bfa' }}
                            >
                                Join 500+ sales teams
                            </p>
                            <h1 className="text-4xl font-extrabold text-white leading-tight">
                                Your pipeline.
                                <br />
                                <span
                                    style={{
                                        background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Supercharged with AI.
                                </span>
                            </h1>
                            <p className="mt-4 text-white/60 text-base leading-relaxed max-w-xs">
                                Nexus AI turns raw leads into closed deals with intelligent automation and real-time insights.
                            </p>
                        </motion.div>

                        {/* Perk list */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="space-y-3"
                        >
                            {PERKS.map((perk, i) => (
                                <motion.div
                                    key={perk}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2
                                        className="w-5 h-5 mt-0.5 flex-shrink-0"
                                        style={{ color: '#a78bfa' }}
                                    />
                                    <span className="text-white/65 text-sm leading-snug">{perk}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Role badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-3 rounded-xl px-4 py-3"
                            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                        >
                            <BadgeCheck className="w-5 h-5" style={{ color: '#a78bfa' }} />
                            <div>
                                <p className="text-white/80 text-sm font-semibold">Role-based access control</p>
                                <p className="text-white/40 text-xs mt-0.5">Admin · Manager · Executive</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom quote */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        className="relative z-10 border-t border-white/10 pt-8"
                    >
                        <p className="text-white/50 text-sm italic">
                            &quot;We closed 40% more deals in the first month with Nexus AI.&quot;
                        </p>
                        <p className="text-white/30 text-xs mt-2">— Head of Sales, EdTech Pvt. Ltd.</p>
                    </motion.div>
                </div>
            </motion.div>

        </div>
    );
}

export default SignupForm;
