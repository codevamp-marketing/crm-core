"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import {
    ArrowRight,
    BarChart3,
    Bell,
    CheckCircle2,
    Facebook,
    Filter,
    Globe,
    Instagram,
    Kanban,
    LayoutDashboard,
    Megaphone,
    MessageSquare,
    Star,
    Target,
    TrendingUp,
    Twitter,
    Users,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { navigationPaths } from "@/lib/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

/* ─── animation helpers ─────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

function InView({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/* ─── data ───────────────────────────────────────────────────── */
const LEAD_SOURCES = [
    { icon: Facebook, label: "Facebook Ads", color: "#1877F2", bg: "rgba(24,119,242,0.12)" },
    { icon: Instagram, label: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.12)" },
    { icon: Twitter, label: "Twitter / X", color: "#1DA1F2", bg: "rgba(29,161,242,0.12)" },
    { icon: Megaphone, label: "Google Ads", color: "#FBBC04", bg: "rgba(251,188,4,0.12)" },
    { icon: Globe, label: "Website", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
    { icon: Target, label: "Campaigns", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
]

const STATS = [
    { value: "10×", label: "Faster lead response" },
    { value: "85%", label: "Lead conversion lift" },
    { value: "6 src", label: "Unified lead channels" },
    { value: "Real-time", label: "Pipeline visibility" },
]

const FEATURES = [
    {
        icon: Kanban,
        title: "Visual Kanban Pipeline",
        desc: "Drag-and-drop leads across funnel stages. See your entire pipeline at a glance and never miss a follow-up.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        desc: "Deep-dive reports on source quality, conversion rates, revenue attribution, and team performance.",
    },
    {
        icon: Bell,
        title: "Smart Notifications",
        desc: "Instant alerts for new leads, status changes, and overdue follow-ups — via app, email, or WhatsApp.",
    },
    {
        icon: Filter,
        title: "AI-Powered Lead Scoring",
        desc: "Machine-learning models rank every lead so your team always calls the hottest prospects first.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        desc: "Assign leads, add notes, and @mention teammates inside every lead card — zero context lost.",
    },
    {
        icon: Zap,
        title: "Workflow Automation",
        desc: "Set triggers to auto-assign, auto-tag, and send first-touch messages the moment a lead arrives.",
    },
]

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Capture",
        desc: "Leads flow in automatically from Facebook, Instagram, Twitter, Google Ads, your website, and more — all in one inbox.",
    },
    {
        step: "02",
        title: "Score & Assign",
        desc: "AI scores every lead instantly. Round-robin or rule-based assignment routes them to the right sales rep.",
    },
    {
        step: "03",
        title: "Nurture",
        desc: "Automated email, WhatsApp, and voice sequences keep leads warm while your team focuses on closing.",
    },
    {
        step: "04",
        title: "Convert",
        desc: "Track deals through your custom pipeline stages and celebrate wins with real-time revenue dashboards.",
    },
]

const TESTIMONIALS = [
    {
        name: "Riya Sharma",
        role: "VP Sales, FinServ Pvt. Ltd.",
        avatar: "RS",
        text: "We went from 3 spreadsheets and 2 WhatsApp groups to one clean dashboard. Lead response time dropped from 4 hours to 8 minutes.",
        stars: 5,
    },
    {
        name: "Aditya Mehta",
        role: "Growth Lead, EduTech Startup",
        avatar: "AM",
        text: "The Facebook + Instagram integration alone paid for itself in the first week. Highly recommended for any performance-marketing team.",
        stars: 5,
    },
    {
        name: "Priya Nair",
        role: "Founder, D2C Brand",
        avatar: "PN",
        text: "AI lead scoring changed how we prioritise. Our closers now spend 80% of their time on leads that actually convert.",
        stars: 5,
    },
]

/* ─── component ──────────────────────────────────────────────── */
export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="relative pt-40 pb-28 px-6 flex flex-col items-center text-center overflow-hidden">
                {/* glowing orbs */}
                <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
                />
                <div
                    className="absolute top-40 -left-24 w-64 h-64 rounded-full opacity-10 blur-2xl pointer-events-none"
                    style={{ background: "#8B5CF6" }}
                />
                <div
                    className="absolute top-40 -right-24 w-64 h-64 rounded-full opacity-10 blur-2xl pointer-events-none"
                    style={{ background: "#10B981" }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border"
                    style={{
                        background: "rgba(59,130,246,0.1)",
                        borderColor: "rgba(59,130,246,0.3)",
                        color: "#3b82f6",
                    }}
                >
                    <TrendingUp className="w-4 h-4" />
                    AI-Powered Lead Intelligence Platform
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-5xl"
                >
                    Turn Every Lead Into{" "}
                    <span
                        className="relative inline-block"
                        style={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #8B5CF6 50%, #06b6d4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Revenue
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed"
                >
                    One unified CRM that captures leads from Facebook, Instagram, Twitter, Google Ads, and
                    your website — then nurtures them automatically until they convert.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
                >
                    <Link href={navigationPaths.signup}>
                        <Button
                            size="lg"
                            className="rounded-2xl px-8 py-6 text-lg font-bold text-white shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                        >
                            Start for Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-2xl px-8 py-6 text-lg font-semibold border-2 hover:bg-muted/50 transition-all cursor-pointer"
                            style={{ borderColor: "rgba(59,130,246,0.4)", color: "#3b82f6" }}
                        >
                            <LayoutDashboard className="mr-2 w-5 h-5" />
                            See Features
                        </Button>
                    </Link>
                </motion.div>

                {/* social proof strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-12 flex items-center gap-3 text-sm text-foreground/50"
                >
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-1 font-medium">4.9 / 5 · Trusted by 500+ sales teams</span>
                </motion.div>
            </section>

            {/* ── Stats Bar ────────────────────────────────────────── */}
            <section id="stats" className="py-14 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((s, i) => (
                        <InView key={i}>
                            <motion.div
                                custom={i}
                                variants={fadeUp}
                                className="rounded-2xl p-6 text-center border border-border/50"
                                style={{ background: "hsl(var(--card))" }}
                            >
                                <p
                                    className="text-3xl md:text-4xl font-extrabold mb-1"
                                    style={{ color: "#3b82f6" }}
                                >
                                    {s.value}
                                </p>
                                <p className="text-sm text-foreground/60 font-medium">{s.label}</p>
                            </motion.div>
                        </InView>
                    ))}
                </div>
            </section>

            {/* ── Lead Sources ─────────────────────────────────────── */}
            <section id="solution" className="py-24 px-6 relative">
                <div
                    className="absolute inset-0 pointer-events-none opacity-5"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 40% at 50% 50%, #3b82f6, transparent)",
                    }}
                />
                <div className="max-w-6xl mx-auto">
                    <InView className="text-center mb-14">
                        <p className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: "#3b82f6" }}>
                            Lead Sources
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Every Channel. One Inbox.
                        </h2>
                        <p className="text-lg text-foreground/60 max-w-xl mx-auto">
                            Stop juggling tabs. Nexus AI connects all your lead sources into a single,
                            real-time stream.
                        </p>
                    </InView>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {LEAD_SOURCES.map((src, i) => (
                            <InView key={i}>
                                <motion.div
                                    custom={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="group rounded-2xl p-6 border border-border/50 flex items-center gap-5 cursor-default transition-all duration-300"
                                    style={{ background: "hsl(var(--card))" }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                                        style={{ background: src.bg }}
                                    >
                                        <src.icon className="w-7 h-7" style={{ color: src.color }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{src.label}</p>
                                        <p className="text-sm text-foreground/50">Auto-capture enabled</p>
                                    </div>
                                </motion.div>
                            </InView>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <InView className="text-center mb-14">
                        <p className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: "#3b82f6" }}>
                            Features
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Built for Modern Sales Teams
                        </h2>
                        <p className="text-lg text-foreground/60 max-w-xl mx-auto">
                            Everything you need to capture, qualify, and close — without the CRM bloat.
                        </p>
                    </InView>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <InView key={i}>
                                <motion.div
                                    custom={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -5 }}
                                    className="group rounded-2xl p-7 border border-border/50 h-full transition-all duration-300 hover:shadow-xl hover:border-blue-500/30"
                                    style={{ background: "hsl(var(--card))" }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: "rgba(59,130,246,0.12)" }}
                                    >
                                        <f.icon className="w-6 h-6" style={{ color: "#3b82f6" }} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                    <p className="text-foreground/60 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            </InView>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────── */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{
                        background:
                            "linear-gradient(135deg, #3b82f6 0%, #8B5CF6 100%)",
                    }}
                />
                <div className="max-w-6xl mx-auto">
                    <InView className="text-center mb-16">
                        <p className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: "#3b82f6" }}>
                            Process
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">How It Works</h2>
                        <p className="text-lg text-foreground/60 max-w-xl mx-auto">
                            Four simple steps from first click to closed deal.
                        </p>
                    </InView>

                    <div className="relative">
                        {/* connector line (desktop) */}
                        <div
                            className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px opacity-20"
                            style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #8B5CF6, transparent)" }}
                        />

                        <div className="grid md:grid-cols-4 gap-8">
                            {HOW_IT_WORKS.map((h, i) => (
                                <InView key={i}>
                                    <motion.div
                                        custom={i}
                                        variants={fadeUp}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div
                                            className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-lg border border-blue-500/20"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))",
                                            }}
                                        >
                                            <span className="text-2xl font-black" style={{ color: "#3b82f6" }}>
                                                {h.step}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{h.title}</h3>
                                        <p className="text-foreground/60 text-sm leading-relaxed">{h.desc}</p>
                                    </motion.div>
                                </InView>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────────── */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <InView className="text-center mb-14">
                        <p className="text-sm uppercase tracking-widest font-bold mb-3" style={{ color: "#3b82f6" }}>
                            Testimonials
                        </p>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Loved by Sales Teams
                        </h2>
                        <p className="text-lg text-foreground/60 max-w-xl mx-auto">
                            Real results from real teams who switched to Nexus AI.
                        </p>
                    </InView>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <InView key={i}>
                                <motion.div
                                    custom={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl p-7 border border-border/50 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:border-blue-500/20"
                                    style={{ background: "hsl(var(--card))" }}
                                >
                                    <div className="flex gap-1">
                                        {[...Array(t.stars)].map((_, si) => (
                                            <Star key={si} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-foreground/80 text-sm leading-relaxed italic flex-1">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, #3b82f6, #8B5CF6)" }}
                                        >
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{t.name}</p>
                                            <p className="text-xs text-foreground/50">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </InView>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <section id="contact" className="py-28 px-6">
                <div className="max-w-3xl mx-auto">
                    <InView>
                        <div
                            className="rounded-3xl p-12 text-center border border-blue-500/20 shadow-2xl relative overflow-hidden"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.1) 50%, rgba(139,92,246,0.1) 100%)",
                            }}
                        >
                            {/* shimmer orb */}
                            <div
                                className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
                                style={{ background: "#3b82f6" }}
                            />

                            <MessageSquare
                                className="w-12 h-12 mx-auto mb-5"
                                style={{ color: "#3b82f6" }}
                            />
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                                Ready to Close More Deals?
                            </h2>
                            <p className="text-foreground/60 text-lg mb-8 max-w-xl mx-auto">
                                Join 500+ sales teams already using Nexus AI to capture, score, and close
                                leads faster than ever.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={navigationPaths.signup}>
                                    <Button
                                        size="lg"
                                        className="rounded-2xl px-10 py-6 text-lg font-bold text-white shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                                    >
                                        Get Started Free
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href={navigationPaths.login}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-2xl px-10 py-6 text-lg font-semibold border-2 hover:bg-muted/50 cursor-pointer"
                                        style={{ borderColor: "rgba(59,130,246,0.4)", color: "#3b82f6" }}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-foreground/50">
                                {["No credit card required", "14-day free trial", "Cancel anytime"].map((pt) => (
                                    <div key={pt} className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        {pt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InView>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
