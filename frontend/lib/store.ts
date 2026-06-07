import { create } from 'zustand'
import type { Contributor, Issue } from './types'

export interface Toast {
  id: string
  title: string
  body?: string
  icon?: string
  xp?: number
}

interface MapViewport {
  x: number
  y: number
  scale: number
}

interface AppStore {
  // Session
  user: Contributor | null
  setUser: (user: Contributor | null) => void

  // Pending XP animation
  pendingXP: number
  addPendingXP: (xp: number) => void
  clearPendingXP: () => void

  // Toast queue
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Repository Explorer map state
  selectedNodeId: string | null
  setSelectedNode: (id: string | null) => void
  mapViewport: MapViewport
  setMapViewport: (viewport: MapViewport) => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Active quest context (for First PR Assistant)
  activeQuestIssue: Issue | null
  setActiveQuestIssue: (issue: Issue | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  pendingXP: 0,
  addPendingXP: (xp) => set((s) => ({ pendingXP: s.pendingXP + xp })),
  clearPendingXP: () => set({ pendingXP: 0 }),

  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  selectedNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  mapViewport: { x: 0, y: 0, scale: 1 },
  setMapViewport: (viewport) => set({ mapViewport: viewport }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  activeQuestIssue: null,
  setActiveQuestIssue: (issue) => set({ activeQuestIssue: issue }),
}))
