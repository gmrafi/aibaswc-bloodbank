"use client"

import { useEffect, useState } from "react"
import { SignedIn, SignedOut, SignIn, UserProfile, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/compatibility"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import { Badge } from "@/components/ui/badge"

type CampusProfile = {
  batch?: string
  department?: string
  phone1?: string
  phone2?: string
  bloodGroup?: BloodGroup
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
          <SignIn appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }} />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-6xl p-4 sm:p-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <UserProfile
                  appearance={{
                    elements: { card: "shadow-none border-0", formButtonPrimary: "bg-black hover:bg-black/90" },
                  }}
                />
              </CardContent>
            </Card>
            <CampusProfileCard />
          </div>
        </div>
      </SignedIn>
    </>
  )
}

function CampusProfileCard() {
  const { user } = useUser()
  const { role, loading: roleLoading } = useRole()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<CampusProfile>({})

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile")
        const json = await res.json()
        if (active) setData(json ?? {})
      } catch (error) {
        console.error("Profile fetch error:", error)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const syncFromAccount = () => {
    const primaryEmail = user?.primaryEmailAddress?.emailAddress
    const phoneNumber = user?.primaryPhoneNumber?.phoneNumber
    setData((d) => ({
      ...d,
      phone1: d.phone1 || phoneNumber || "",
      // bloodGroup not in Clerk profile; left as-is
    }))
  }

  const save = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed")
      }
      toast({ title: "Saved", description: "Campus profile updated." })
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Campus Profile</CardTitle>
        {!roleLoading && (
          <Badge variant={role === "superadmin" ? "default" : role === "admin" ? "secondary" : "outline"}>
            {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : "User"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="batch">Batch</Label>
            <Input
              id="batch"
              value={data.batch ?? ""}
              onChange={(e) => setData((d) => ({ ...d, batch: e.target.value }))}
              disabled={loading}
              placeholder="e.g., 2023"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={data.department ?? ""}
              onChange={(e) => setData((d) => ({ ...d, department: e.target.value }))}
              disabled={loading}
              placeholder="e.g., CSE"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="phone1">Phone 1</Label>
            <Input
              id="phone1"
              value={data.phone1 ?? ""}
              onChange={(e) => setData((d) => ({ ...d, phone1: e.target.value }))}
              disabled={loading}
              placeholder="Primary phone number"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone2">Phone 2</Label>
            <Input
              id="phone2"
              value={data.phone2 ?? ""}
              onChange={(e) => setData((d) => ({ ...d, phone2: e.target.value }))}
              disabled={loading}
              placeholder="Secondary phone number"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Blood Group</Label>
          <Select
            value={data.bloodGroup ?? ""}
            onValueChange={(v) => setData((d) => ({ ...d, bloodGroup: v as BloodGroup }))}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={syncFromAccount} disabled={loading || saving}>
            Sync from account
          </Button>
          <Button onClick={save} disabled={saving || loading}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
