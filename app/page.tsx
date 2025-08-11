"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import PublicLanding from "@/components/public-landing"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import Dashboard from "@/components/ui-dashboard"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield } from "lucide-react"

export default function Page() {
  return (
    <>
      <SignedOut>
        <PublicLanding />
      </SignedOut>

      <SignedIn>
        <AppProviders>
          <LayoutShell>
            <UserDashboard />
          </LayoutShell>
        </AppProviders>
      </SignedIn>
    </>
  )
}

function UserDashboard() {
  const { role, loading, isAdmin } = useRole()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-40 rounded bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blood Bank Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to the Army IBA Social Welfare Club Blood Bank Management System
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin">
            <Button className="gap-2">
              <Shield className="size-4" />
              Admin Panel
            </Button>
          </Link>
        )}
      </div>

      <Dashboard />

      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Need Admin Access?</h3>
          <p className="text-sm text-blue-700 mb-3">
            If you're an administrator, make sure your email is configured in the system environment variables.
          </p>
          <Link href="/profile">
            <Button variant="outline" size="sm">
              Check Profile
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
