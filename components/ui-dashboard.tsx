"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BLOOD_GROUPS, isEligible } from "@/lib/compatibility"
import { useBlood } from "./blood-context"

export default function Dashboard() {
  const { state } = useBlood()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = useMemo(() => {
    // Don't calculate until mounted to prevent hydration mismatch
    if (!mounted) {
      return {
        total: 0,
        eligible: 0,
        open: 0,
        fulfilled: 0,
        byGroup: BLOOD_GROUPS.reduce<Record<string, { total: number; eligible: number }>>((acc, g) => {
          acc[g] = { total: 0, eligible: 0 }
          return acc
        }, {})
      }
    }

    const total = state.donors.length
    const eligible = state.donors.filter((d) => isEligible(d.lastDonation ?? null, d.willing)).length
    const open = state.requests.filter((r) => r.status === "open").length
    const fulfilled = state.requests.filter((r) => r.status === "fulfilled").length

    const byGroup = BLOOD_GROUPS.reduce<Record<string, { total: number; eligible: number }>>((acc, g) => {
      const gDonors = state.donors.filter((d) => d.bloodGroup === g)
      const gEligible = gDonors.filter((d) => isEligible(d.lastDonation ?? null, d.willing)).length
      acc[g] = { total: gDonors.length, eligible: gEligible }
      return acc
    }, {})

    return { total, eligible, open, fulfilled, byGroup }
  }, [state, mounted])

  const upcoming = useMemo(() => {
    if (!mounted) return []
    
    return state.requests
      .filter((r) => r.status === "open")
      .sort((a, b) => a.neededBy.localeCompare(b.neededBy))
      .slice(0, 5)
  }, [state.requests, mounted])

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded bg-gray-200 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-64 rounded bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Donors</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eligible Donors</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.eligible}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.open}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fulfilled Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.fulfilled}</CardContent>
        </Card>
      </div>

      <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Donors by Blood Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BLOOD_GROUPS.map((g) => (
                <div key={g} className="rounded-md border p-3 bg-white">
                  <div className="text-sm text-muted-foreground">Group</div>
                  <div className="text-xl font-semibold">{g}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">Total: {stats.byGroup[g].total}</Badge>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">Eligible: {stats.byGroup[g].eligible}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Needs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && <div className="text-sm text-muted-foreground">No open requests.</div>}
            {upcoming.map((r) => (
              <div key={r.id} className="rounded-md border p-3">
                <div className="font-medium">{r.patientName}</div>
                <div className="text-sm text-muted-foreground">
                  {"Group "}
                  {r.bloodGroup} {" • Units "}
                  {r.units} {" • Needed "}
                  {r.neededBy}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{r.location}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
