"use client"

import { useEffect, useState } from "react"
import { SignedOut, SignIn, useUser } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import Dashboard from "@/components/ui-dashboard"
import SystemStatus from "@/components/system-status"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Users, ClipboardList } from "lucide-react"

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, loading, isAdmin } = useRole()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl p-4">
          <div className="h-10 w-48 rounded-md bg-gray-200 animate-pulse mb-4" />
          <div className="h-40 rounded-md bg-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <SignedOut>
          <SignIn appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }} />
        </SignedOut>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Admin Access Required</h2>
          <p className="text-sm text-muted-foreground">
            You need admin or superadmin privileges to access this page. Contact the system administrator if you believe
            this is an error.
          </p>
          <div className="text-xs text-muted-foreground">
            Current role: <span className="font-mono bg-gray-100 px-1 rounded">{role}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Link href="/">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppProviders>
      <LayoutShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage the blood bank system and monitor integrations</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/donors">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Users className="size-4" />
                  Manage Donors
                </Button>
              </Link>
              <Link href="/requests">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ClipboardList className="size-4" />
                  Manage Requests
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Dashboard />
            </div>
            <div>
              <SystemStatus />
            </div>
          </div>
        </div>
      </LayoutShell>
    </AppProviders>
  )
}
