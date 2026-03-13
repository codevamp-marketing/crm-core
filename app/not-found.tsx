"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, Home, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from "@/lib/utils"
import { getCookie } from "@/lib/utils"

export default function NotFound(): React.JSX.Element {
    const [hovering, setHovering] = React.useState(false)

    // Smart navigation: if a token cookie exists the user is logged in → go to dashboard
    const isLoggedIn = Boolean(getCookie("token"))
    const primaryHref = isLoggedIn ? "/dashboard" : "/"
    const primaryLabel = isLoggedIn ? "Go to Dashboard" : "Go Home"
    const secondaryLabel = isLoggedIn ? "Back to dashboard" : "Return to homepage"
    const PrimaryIcon = isLoggedIn ? LayoutDashboard : Home

    return (
        <main
            className={cn(
                "relative min-h-screen w-full overflow-hidden",
                // Light mode: soft cool-white background; dark mode: deep navy
                "bg-zinc-50 dark:bg-[#09090B]",
                "text-zinc-900 dark:text-white",
                "selection:bg-indigo-200 selection:text-indigo-900",
                "dark:selection:bg-yellow-300/20 dark:selection:text-yellow-200"
            )}
            aria-labelledby="not-found-title"
        >
            {/* Background blobs — light mode shows subtle indigo/violet, dark mode is the aurora */}
            <AuroraOrbs />
            <Particles />

            {/* Centered card */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
                <motion.section
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className={cn(
                        "relative w-full overflow-hidden rounded-3xl",
                        // light: plain white card with subtle shadow
                        "bg-white/80 border border-zinc-200/80 backdrop-blur-xl",
                        "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_2px_12px_-4px_rgba(0,0,0,0.06)]",
                        // dark: glass card
                        "dark:bg-white/5 dark:border-white/10",
                        "dark:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6),0_10px_30px_-10px_rgba(13,18,28,0.7)]",
                        "ring-1 ring-zinc-200/60 dark:ring-white/10"
                    )}
                    role="region"
                    aria-label="Page not found panel"
                >
                    {/* Shine effect on hover */}
                    <CardShine active={hovering} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Eyebrow */}
                        <div className="mb-6 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-500 dark:text-yellow-300/90" aria-hidden="true" />
                            <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 dark:text-yellow-300/90">
                                Route not found
                            </span>
                        </div>

                        {/* 404 digits */}
                        <div className="mb-8 flex items-baseline gap-3">
                            <Digit text="4" delay={0} />
                            <Digit text="0" delay={0.1} />
                            <Digit text="4" delay={0.2} />
                        </div>

                        <h1 id="not-found-title" className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white/90 md:text-3xl">
                            Page not found
                        </h1>
                        <p className="mb-8 max-w-prose text-balance text-zinc-500 dark:text-white/60">
                            {isLoggedIn
                                ? "This route doesn't exist. Head back to your dashboard to pick up where you left off."
                                : "This page doesn't exist or has been moved. Head back to the homepage to continue."}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Primary button */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href={primaryHref}
                                    aria-label={primaryLabel}
                                    onMouseEnter={() => setHovering(true)}
                                    onMouseLeave={() => setHovering(false)}
                                    className={cn(
                                        "group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5",
                                        "text-sm font-semibold transition-all duration-300",
                                        // light: solid zinc-900 button
                                        "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20",
                                        "hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30",
                                        // dark: gradient brand button
                                        "dark:bg-gradient-to-r dark:from-yellow-400 dark:via-amber-300 dark:to-blue-500",
                                        "dark:text-[#0B1220]",
                                        "dark:hover:from-yellow-300 dark:hover:via-amber-200 dark:hover:to-blue-400",
                                        "dark:shadow-[0_10px_30px_-10px_rgba(252,211,77,0.5)]"
                                    )}
                                >
                                    <PrimaryIcon className="h-4 w-4" aria-hidden="true" />
                                    <span>{primaryLabel}</span>
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                                    {/* shimmer overlay */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full"
                                    />
                                </Link>
                            </motion.div>

                            {/* Secondary text link */}
                            <Link
                                href={primaryHref}
                                className="text-sm font-medium text-zinc-500 dark:text-white/60 underline-offset-4 hover:text-zinc-900 dark:hover:text-white hover:underline transition-colors"
                            >
                                {secondaryLabel}
                            </Link>
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Vignette */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_center,transparent,rgba(0,0,0,0.05))] dark:bg-[radial-gradient(1200px_400px_at_center,transparent,rgba(0,0,0,0.45))]"
            />
        </main>
    )
}

/* Background aurora orbs — soft in light mode, vivid in dark */
function AuroraOrbs() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl
                           bg-indigo-300/25 dark:bg-yellow-400/20"
                animate={{ y: [0, 14, -8, 0], x: [0, 8, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl
                           bg-violet-300/25 dark:bg-blue-500/25"
                animate={{ y: [0, -14, 10, 0], x: [0, -8, 5, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full blur-2xl
                           bg-sky-200/20 dark:bg-cyan-500/10"
                animate={{ scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    )
}

/* Light floating particles */
function Particles() {
    const particles = Array.from({ length: 18 })
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {particles.map((_, i) => (
                <motion.span
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full
                               bg-zinc-400/20 dark:bg-white/12
                               shadow-[0_0_10px_rgba(0,0,0,0.08)] dark:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    style={{
                        top: `${(i * 137) % 100}%`,
                        left: `${(i * 89) % 100}%`,
                    }}
                    animate={{ y: [0, -8, 0], opacity: [0.3, 0.65, 0.3] }}
                    transition={{
                        duration: 4 + (i % 5),
                        delay: i * 0.12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

/* Shine overlay on card hover */
function CardShine({ active = false }: { active?: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0",
                "before:absolute before:-left-1/3 before:top-0 before:h-full before:w-1/2",
                "before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]",
                active ? "before:animate-[shine_1.2s_ease-out]" : ""
            )}
        />
    )
}

/* Animated gradient 404 digits */
function Digit({ text, delay = 0 }: { text: string; delay?: number }) {
    return (
        <motion.span
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 140, damping: 14 }}
            className={cn(
                "text-6xl font-extrabold tracking-tight md:text-7xl",
                "bg-clip-text text-transparent",
                // light: indigo→violet gradient
                "bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500",
                // dark: yellow→blue brand gradient
                "dark:bg-gradient-to-r dark:from-yellow-300 dark:via-amber-200 dark:to-blue-400",
                "drop-shadow-[0_4px_16px_rgba(99,102,241,0.2)] dark:drop-shadow-[0_6px_24px_rgba(59,130,246,0.25)]"
            )}
        >
            {text}
        </motion.span>
    )
}
