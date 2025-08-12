"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type SuperAdmin = {
  clerkUserId: string
  role: string
  fullName?: string | null
  email?: string | null
  imageUrl?: string | null
}

export default function AdminSuperadmins() {
  const [list, setList] = useState<SuperAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/superadmins")
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message ?? "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async () => {
    if (!email.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/superadmins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error(await res.text())
      setEmail("")
      await load()
    } catch (e: any) {
      setError(e?.message ?? "Failed to add")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (clerkUserId: string) => {
    if (!confirm("Remove this superadmin?")) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/superadmins?clerkUserId=${encodeURIComponent(clerkUserId)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(await res.text())
      await load()
    } catch (e: any) {
      setError(e?.message ?? "Failed to remove")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Superadmins</CardTitle>
        <p className="text-sm text-muted-foreground">Add or remove superadmin access by email.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
            />
          </div>
          <Button onClick={add} disabled={!email.trim() || saving}>Add</Button>
        </div>
        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-2">
            {list.length === 0 && (
              <div className="text-sm text-muted-foreground">No superadmins yet.</div>
            )}
            {list.map((u) => (
              <div key={u.clerkUserId} className="flex items-center justify-between border rounded-md p-2">
                <div>
                  <div className="text-sm font-medium">{u.fullName ?? u.email ?? u.clerkUserId}</div>
                  {u.email && <div className="text-xs text-muted-foreground">{u.email}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge>superadmin</Badge>
                  <Button variant="outline" size="sm" onClick={() => remove(u.clerkUserId)} disabled={saving}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
