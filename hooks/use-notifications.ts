"use client"

import { useState, useEffect, useCallback } from "react"
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as apiDeleteNotification,
  Notification,
  NotificationStatus,
  NotificationStats,
  NotificationFilters,
} from "@/lib/notifications-api"

interface UseNotificationsOptions {
  page?: number
  limit?: number
  filters?: NotificationFilters
  pollingInterval?: number
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  total: number
  pages: number
  stats: NotificationStats
  loading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refetch: () => void
}

const DEFAULT_STATS: NotificationStats = {
  totalNotifications: 0,
  unreadCount: 0,
  commissionNotifications: 0,
  ticketNotifications: 0,
}

export function useNotifications({
  page = 1,
  limit = 20,
  filters = {},
  pollingInterval = 30000,
}: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [stats, setStats] = useState<NotificationStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchNotifications({ page, limit, filters })
      .then((data) => {
        if (cancelled) return
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
        setTotal(data.total)
        setPages(data.pages)
        setStats(data.stats)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.message ?? "Unknown error")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, JSON.stringify(filters), tick])

  // Polling
  useEffect(() => {
    if (!pollingInterval || pollingInterval <= 0) return
    const id = setInterval(refetch, pollingInterval)
    return () => clearInterval(id)
  }, [pollingInterval, refetch])

  const markAsRead = useCallback(async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, status: NotificationStatus.READ } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, status: NotificationStatus.READ })))
    setUnreadCount(0)
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    await apiDeleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n._id !== id))
    setTotal((t) => Math.max(0, t - 1))
  }, [])

  return {
    notifications,
    unreadCount,
    total,
    pages,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  }
}
