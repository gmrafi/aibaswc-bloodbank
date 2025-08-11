"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Database, Shield, Settings } from "lucide-react"

type HealthStatus = {
  ok: boolean
  timestamp: string
  env: Record<string, boolean>
  supabase: {
    connected: boolean
    donorsCount: number | null
    requestsCount: number | null
    profilesCount: number | null
    error: string | null
  }
  auth: {
    working: boolean
    currentRole: string | null
    error: string | null
  }
}

export default function SystemStatus() {
  const [status, setStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/health")
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error("Health check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <RefreshCw className="size-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Checking system health...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="size-5 text-red-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to fetch system status</p>
          <Button onClick={fetchStatus} className="mt-2" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.ok ? <CheckCircle className="size-5 text-green-500" /> : <XCircle className="size-5 text-red-500" />}
          System Status
          <Button onClick={fetchStatus} size="sm" variant="outline" className="ml-auto bg-transparent">
            <RefreshCw className="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="size-4" />
              <span className="text-sm font-medium">Database</span>
            </div>
            <Badge variant={status.supabase.connected ? "default" : "destructive"}>
              {status.supabase.connected ? "Connected" : "Error"}
            </Badge>
          </div>

          {status.supabase.connected && (
            <div className="ml-6 text-xs text-muted-foreground space-y-1">
              <div>Donors: {status.supabase.donorsCount ?? "N/A"}</div>
              <div>Requests: {status.supabase.requestsCount ?? "N/A"}</div>
              <div>Profiles: {status.supabase.profilesCount ?? "N/A"}</div>
            </div>
          )}

          {status.supabase.error && (
            <div className="ml-6 text-xs text-red-600 bg-red-50 p-2 rounded">{status.supabase.error}</div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <span className="text-sm font-medium">Authentication</span>
            </div>
            <Badge variant={status.auth.working ? "default" : "destructive"}>
              {status.auth.working ? "Working" : "Error"}
            </Badge>
          </div>

          {status.auth.working && status.auth.currentRole && (
            <div className="ml-6 text-xs text-muted-foreground">
              Current role: <span className="font-mono bg-gray-100 px-1 rounded">{status.auth.currentRole}</span>
            </div>
          )}

          {status.auth.error && (
            <div className="ml-6 text-xs text-red-600 bg-red-50 p-2 rounded">{status.auth.error}</div>
          )}
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
