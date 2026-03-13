// Notification types and API helpers for the notification system

export enum NotificationType {
  COMMISSION_STATUS_CHANGE = "COMMISSION_STATUS_CHANGE",
  TICKET_STATUS_CHANGE = "TICKET_STATUS_CHANGE",
  GENERAL = "GENERAL",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}

export enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Notification {
  _id: string
  title: string
  message: string
  type: NotificationType
  status: NotificationStatus
  priority: NotificationPriority
  actionUrl?: string
  oldStatus?: string
  newStatus?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationStats {
  totalNotifications: number
  unreadCount: number
  commissionNotifications: number
  ticketNotifications: number
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  pages: number
  page: number
  unreadCount: number
  stats: NotificationStats
}

export interface NotificationFilters {
  unreadOnly?: boolean
  type?: NotificationType
}

export interface FetchNotificationsParams {
  page?: number
  limit?: number
  filters?: NotificationFilters
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<NotificationsResponse> {
  const { page = 1, limit = 20, filters = {} } = params
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(filters.unreadOnly ? { unreadOnly: "true" } : {}),
    ...(filters.type ? { type: filters.type } : {}),
  })

  const res = await fetch(`${API_BASE}/api/notifications?${query}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to fetch notifications")
  return res.json()
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  })
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetch(`${API_BASE}/api/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
  })
}

export async function deleteNotification(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/notifications/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
}
