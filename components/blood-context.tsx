"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react"

export type BloodGroup = "O-" | "O+" | "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+"

export type Donor = {
  id: string
  name: string
  batch: string
  studentId: string
  department: string
  bloodGroup: BloodGroup
  phone: string
  phone2?: string
  email?: string
  contactPreference?: "Phone" | "WhatsApp" | "Email"
  willing: boolean
  lastDonation?: string | null // ISO
  notes?: string
  createdAt: string // ISO
  updatedAt?: string // ISO
}

export type BloodRequest = {
  id: string
  patientName: string
  bloodGroup: BloodGroup
  units: number
  neededBy: string // YYYY-MM-DD
  hospital?: string
  ward?: string
  location: string
  contactPerson: string
  contactPhone: string
  contactPhone2?: string
  requestedBy?: string
  relationToPatient?: string
  urgency: "low" | "normal" | "high" | "critical"
  notes?: string
  status: "open" | "fulfilled" | "cancelled"
  createdAt: string
  fulfilledAt?: string
  matchedDonorIds?: string[]
}

type State = {
  donors: Donor[]
  requests: BloodRequest[]
  loading: boolean
}

type Ctx = {
  state: State
  refresh: () => Promise<void>
  upsertDonor: (donor: Omit<Donor, "id" | "createdAt" | "updatedAt"> & Partial<Pick<Donor, "id">>) => Promise<void>
  deleteDonor: (id: string) => Promise<void>
  addRequest: (req: Omit<BloodRequest, "id" | "createdAt" | "status">) => Promise<void>
  updateRequest: (req: BloodRequest) => Promise<void>
  deleteRequest: (id: string) => Promise<void>
  exportJSON: () => string
  importJSON: (json: string) => Promise<{ ok: boolean; error?: string }>
}

export const BloodContext = createContext<Ctx | null>(null)

async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `API error: ${res.status}`)
  }
  return res.json()
}

export function BloodProvider({ children }: { children?: React.ReactNode }) {
  const [state, setState] = useState<State>({ donors: [], requests: [], loading: true })
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (!signal?.aborted && mountedRef.current) {
      setState((s) => ({ ...s, loading: true }))
    }
    try {
      const [donors, requests] = await Promise.all([api<Donor[]>("/api/donors"), api<BloodRequest[]>("/api/requests")])
      if (signal?.aborted || !mountedRef.current) return
      setState({ donors, requests, loading: false })
    } catch (_e) {
      if (signal?.aborted || !mountedRef.current) return
      setState((s) => ({ ...s, loading: false }))
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    refresh(controller.signal)
    return () => controller.abort()
  }, [refresh])

  const upsertDonor: Ctx["upsertDonor"] = useCallback(
    async (payload) => {
      if (payload.id) {
        await api("/api/donors", { method: "PUT", body: JSON.stringify(payload) })
      } else {
        await api("/api/donors", { method: "POST", body: JSON.stringify(payload) })
      }
      const controller = new AbortController()
      await refresh(controller.signal)
    },
    [refresh],
  )

  const deleteDonor: Ctx["deleteDonor"] = useCallback(
    async (id: string) => {
      await api(`/api/donors?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const controller = new AbortController()
      await refresh(controller.signal)
    },
    [refresh],
  )

  const addRequest: Ctx["addRequest"] = useCallback(
    async (payload) => {
      await api("/api/requests", { method: "POST", body: JSON.stringify(payload) })
      const controller = new AbortController()
      await refresh(controller.signal)
    },
    [refresh],
  )

  const updateRequest: Ctx["updateRequest"] = useCallback(
    async (req) => {
      await api("/api/requests", { method: "PUT", body: JSON.stringify(req) })
      const controller = new AbortController()
      await refresh(controller.signal)
    },
    [refresh],
  )

  const deleteRequest: Ctx["deleteRequest"] = useCallback(
    async (id) => {
      await api(`/api/requests?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const controller = new AbortController()
      await refresh(controller.signal)
    },
    [refresh],
  )

  const exportJSON = useCallback(
    () => JSON.stringify({ donors: state.donors, requests: state.requests }, null, 2),
    [state.donors, state.requests],
  )

  const importJSON = useCallback(
    async (json: string) => {
      try {
        const parsed = JSON.parse(json) as { donors: Donor[]; requests: BloodRequest[] }
        if (!parsed || !Array.isArray(parsed.donors) || !Array.isArray(parsed.requests)) {
          return { ok: false, error: "Invalid file structure" }
        }
        await api("/api/admin/import", { method: "POST", body: JSON.stringify(parsed) })
        const controller = new AbortController()
        await refresh(controller.signal)
        return { ok: true }
      } catch (e: any) {
        return { ok: false, error: e?.message ?? "Failed to import" }
      }
    },
    [refresh],
  )

  const value: Ctx = useMemo(
    () => ({
      state,
      refresh: () => refresh(),
      upsertDonor,
      deleteDonor,
      addRequest,
      updateRequest,
      deleteRequest,
      exportJSON,
      importJSON,
    }),
    [state, refresh, upsertDonor, deleteDonor, addRequest, updateRequest, deleteRequest, exportJSON, importJSON],
  )

  return <BloodContext.Provider value={value}>{children}</BloodContext.Provider>
}

export function useBlood() {
  const ctx = useContext(BloodContext)
  if (!ctx) throw new Error("useBlood must be used within BloodProvider")
  return ctx
}

export function useBloodOptional() {
  return useContext(BloodContext)
}
