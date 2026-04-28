"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X,
  Pencil,
  Loader2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  User,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Save,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProfile, useUpdateProfile } from "@/hooks/use-profile"
import type { Gender } from "@/lib/types"

/* ── Edit form schema ──────────────────────────────────────────── */
const editSchema = z.object({
  username: z.string().min(2, "Min 2 characters").max(50).optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(20, "Max 20 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^\w]/, "Must contain a special character")
    .optional()
    .or(z.literal("")),
  contact: z
    .string()
    .max(15, "Max 15 characters")
    .regex(/^\+?[0-9\s\-()]*$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  designation: z.string().max(100).optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
})
type EditFormData = z.infer<typeof editSchema>

/* ── Helpers ───────────────────────────────────────────────────── */
function getInitials(name?: string | null, email?: string | null) {
  const src = name || email || "U"
  return src.split(/[\s@.]+/).filter(Boolean).map(s => s[0].toUpperCase()).slice(0, 2).join("")
}
function shortId(id?: string | null) {
  return id ? `#${id.slice(-4).toUpperCase()}` : "#0000"
}

/* ── Direction-aware flip variants ────────────────────────────── */
const panelVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotateX: dir > 0 ? 55 : -55,
    y: dir > 0 ? 20 : -20,
  }),
  center: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.32, ease: [0, 0, 0.2, 1] as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    rotateX: dir > 0 ? -55 : 55,
    y: dir > 0 ? -20 : 20,
    transition: { duration: 0.28, ease: [0.4, 0, 0.6, 1] as const },
  }),
}

/* ── Skeleton ──────────────────────────────────────────────────── */
function ProfileSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700" />
      <div className="px-6 pb-6">
        <div className="flex items-end gap-4 -mt-10 mb-6">
          <Skeleton className="w-24 h-24 rounded-full border-4 border-card shrink-0" />
          <div className="flex-1 space-y-2 pb-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-44" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-5 border-t border-border/50">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      </div>
    </div>
  )
}

/* ── Main ──────────────────────────────────────────────────────── */
interface ProfileModalProps {
  open: boolean
  onClose: () => void
  userId: string | null
}

export function ProfileModal({ open, onClose, userId }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [direction, setDirection] = useState(1)   // 1 = forward (→ edit), -1 = backward (→ view)
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: profile, isLoading, isError } = useGetProfile(userId)
  const updateMutation = useUpdateProfile(userId)

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<EditFormData>({ resolver: zodResolver(editSchema) })

  const handleEditOpen = () => {
    reset({
      username: profile?.username ?? "",
      email: profile?.email ?? "",
      password: "",
      contact: profile?.contact ?? "",
      designation: profile?.designation ?? "",
      gender: (profile?.gender as Gender) ?? undefined,
    })
    setShowPasswordUpdate(false)
    setShowPassword(false)
    setDirection(1)      // forward flip
    setIsEditing(true)
  }

  const handleCancel = () => {
    setDirection(-1)     // backward flip
    setIsEditing(false)
    setShowPasswordUpdate(false)
    setShowPassword(false)
    reset()
  }

  const onSubmit = async (data: EditFormData) => {
    await updateMutation.mutateAsync({
      username: data.username || undefined,
      email: data.email || undefined,
      ...(showPasswordUpdate && data.password ? { password: data.password } : {}),
      contact: data.contact || undefined,
      designation: data.designation || undefined,
      gender: data.gender,
    })
    setShowPasswordUpdate(false)
    setShowPassword(false)
    setDirection(-1)     // backward flip
    setIsEditing(false)
  }

  const handleClose = () => {
    setIsEditing(false)
    setShowPasswordUpdate(false)
    setShowPassword(false)
    reset()
    onClose()
  }

  const initials  = getInitials(profile?.username, profile?.email)
  const name      = profile?.username || profile?.email || "User"
  const roleLabel = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Executive"
  const isActive  = !profile?.status || profile.status === "active"

  return (
    <Dialog open={open} onOpenChange={o => !o && handleClose()}>
      <DialogContent className="max-w-[520px] w-full bg-zinc-950 border-zinc-800 p-0 overflow-hidden shadow-2xl rounded-2xl">
        {isLoading ? <ProfileSkeleton /> : isError ? (
          <p className="p-6 text-sm text-destructive">Failed to load profile. Please try again.</p>
        ) : (
          <div className="flex flex-col w-full">

            {/* ━━━ BANNER ━━━ */}
            <div
              className="h-28 relative shrink-0 transition-all duration-500"
              style={{
                background: isEditing
                  ? "linear-gradient(to right, #7c3aed, #6366f1, #4f46e5)"
                  : "linear-gradient(to right, #2563eb, #6366f1, #1d4ed8)",
              }}
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

              {/* Banner title — flips between modes */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit-title"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-4 left-6 flex items-center gap-2"
                  >
                    <span className="bg-white/20 rounded-md p-1">
                      <Pencil className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-white/95 text-xs font-semibold tracking-widest uppercase">
                      Editing Profile
                    </span>
                    <span className="ml-1 text-[10px] text-white/60 font-normal normal-case tracking-normal">
                      — changes saved on clicking Save
                    </span>
                  </motion.div>
                ) : (
                  <motion.p
                    key="view-title"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-4 left-6 text-white/90 text-xs font-semibold tracking-widest uppercase"
                  >
                    Profile Overview
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 hover:bg-red-500 text-white transition-all z-20 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ━━━ CONTENT ━━━ */}
            <div className="px-6 pb-5">

              {/* ── Avatar + name row ── */}
              <div className="flex items-end gap-4 -mt-10 mb-5">
                {/* Avatar — shows pencil overlay when editing */}
                <div className="relative shrink-0 group">
                  <div className={`absolute inset-0 blur-xl opacity-20 rounded-full transition-all duration-500 ${isEditing ? "bg-violet-500 opacity-30" : "bg-blue-500 group-hover:opacity-40"}`} />
                  <Avatar className="w-24 h-24 border-4 border-card shadow-2xl relative z-10">
                    <AvatarFallback className={`text-white text-3xl font-bold transition-all duration-500 ${isEditing
                      ? "bg-gradient-to-br from-violet-600 to-indigo-800"
                      : "bg-gradient-to-br from-blue-600 to-indigo-800"
                    }`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status dot in view / pencil badge in edit */}
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.span
                        key="edit-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-violet-600 border-2 border-card z-20 shadow-md flex items-center justify-center"
                      >
                        <Pencil className="w-3 h-3 text-white" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="status-dot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card z-20 shadow-md"
                        style={{ background: isActive ? "#10b981" : "#f59e0b" }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight truncate">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <Badge
                          variant="secondary"
                          className={`border-none text-[11px] px-2 py-0 h-5 transition-all duration-500 ${isEditing
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {roleLabel}
                        </Badge>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">
                          Member ID: {shortId(profile?.id)}
                        </span>
                      </div>
                    </div>
                    {/* In edit mode replace status badge with "Editing" pill */}
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.span
                          key="editing-pill"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest shrink-0 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30"
                        >
                          Editing
                        </motion.span>
                      ) : (
                        <motion.span
                          key="status-pill"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest shrink-0 rounded-full border ${isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ━━━ ANIMATED CONTENT PANEL ━━━ */}
              <div style={{ perspective: "1200px" }}>
                <AnimatePresence mode="wait" custom={direction}>

                  {/* ── VIEW MODE ── */}
                  {!isEditing && (
                    <motion.div
                      key="view"
                      custom={direction}
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                        {[
                          { icon: Mail,        label: "Email Address",    value: profile?.email   || "—", color: "blue"   },
                          { icon: Phone,       label: "Contact Number",   value: profile?.contact || "—", color: "emerald"},
                          {
                            icon: Calendar,
                            label: "Registration Date",
                            value: profile?.createdAt
                              ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
                              : "N/A",
                            color: "amber",
                          },
                          { icon: CheckCircle, label: "Security Status",  value: "verified",                color: "purple"},
                          ...(profile?.designation ? [{ icon: Briefcase, label: "Designation", value: profile.designation, color: "pink" }] : []),
                          ...(profile?.gender     ? [{ icon: User,      label: "Gender",       value: profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1), color: "sky" }] : []),
                        ].map(({ icon: Icon, label, value, color }) => (
                          <div
                            key={label}
                            className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border/20 hover:bg-muted/50 transition-all duration-200 group"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 bg-${color}-500/10 text-${color}-500 group-hover:bg-${color}-500 group-hover:text-white`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
                              {value === "verified" ? (
                                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                  Verified Member
                                </p>
                              ) : (
                                <p className="text-xs font-semibold text-foreground truncate">{value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/50">
                        <Button
                          onClick={handleEditOpen}
                          variant="ghost"
                          className="w-full h-9 rounded-xl text-sm font-semibold text-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── EDIT MODE ── */}
                  {isEditing && (
                    <motion.div
                      key="edit"
                      custom={direction}
                      variants={panelVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      style={{ transformOrigin: "top center" }}
                    >
                      <form onSubmit={handleSubmit(onSubmit)} className="pt-3 border-t border-border/50">

                        {/* Update Password toggle */}
                        <div className="flex items-center justify-end mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordUpdate(prev => !prev)
                              setShowPassword(false)
                              if (showPasswordUpdate) setValue("password", "")
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus:outline-none ${
                              showPasswordUpdate
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/25 hover:bg-rose-500/20"
                                : "bg-violet-500/10 text-violet-400 border-violet-500/25 hover:bg-violet-500/20"
                            }`}
                          >
                            <Lock className="w-3 h-3" />
                            {showPasswordUpdate ? "Cancel Password Update" : "Update Password"}
                          </button>
                        </div>

                        {/* ── 2-column grid for fields ── */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-3">

                          {/* Full Name */}
                          <div className="space-y-1">
                            <Label htmlFor="p-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</Label>
                            <Input id="p-name" placeholder="Your name" {...register("username")}
                              className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm focus-visible:ring-violet-500/30" />
                            {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
                          </div>

                          {/* Email */}
                          <div className="space-y-1">
                            <Label htmlFor="p-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</Label>
                            <Input id="p-email" type="email" placeholder="you@example.com" {...register("email")}
                              className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm focus-visible:ring-violet-500/30" />
                            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                          </div>

                          {/* Contact */}
                          <div className="space-y-1">
                            <Label htmlFor="p-contact" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact Number</Label>
                            <Input id="p-contact" placeholder="+91 9876543210" {...register("contact")}
                              className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm focus-visible:ring-violet-500/30" />
                            {errors.contact && <p className="text-destructive text-xs">{errors.contact.message}</p>}
                          </div>

                          {/* Designation */}
                          <div className="space-y-1">
                            <Label htmlFor="p-designation" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Designation</Label>
                            <Input id="p-designation" placeholder="e.g. Sales Executive" {...register("designation")}
                              className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm focus-visible:ring-violet-500/30" />
                          </div>

                          {/* Gender — full width */}
                          <div className="space-y-1 col-span-2">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gender</Label>
                            <Select defaultValue={profile?.gender ?? undefined} onValueChange={v => setValue("gender", v as Gender)}>
                              <SelectTrigger className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Password — full width, only when toggled */}
                          <AnimatePresence>
                            {showPasswordUpdate && (
                              <motion.div
                                key="pw-field"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="col-span-2 overflow-hidden"
                              >
                                <div className="space-y-1 pt-0.5">
                                  <Label htmlFor="p-password" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">New Password</Label>
                                  <div className="relative">
                                    <Input
                                      id="p-password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Min 8 chars, upper, lower, number, special"
                                      autoFocus
                                      {...register("password")}
                                      className="h-9 rounded-xl bg-muted/30 border-border/40 text-sm pr-10 focus-visible:ring-violet-500/30"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(p => !p)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 mt-1">
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={updateMutation.isPending}
                            className="flex-1 h-9 rounded-xl text-sm font-semibold border border-border/60 text-muted-foreground
                              hover:bg-red-500/8 hover:border-red-500/30 hover:text-red-400
                              dark:hover:bg-red-500/10 dark:hover:border-red-500/25 dark:hover:text-red-400
                              transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="flex-1 h-9 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 cursor-pointer"
                          >
                            {updateMutation.isPending
                              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                              : <><Save className="w-3.5 h-3.5 mr-2" />Save Changes</>}
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
