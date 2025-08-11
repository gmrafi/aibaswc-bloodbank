"use client"

import type React from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function RoleGuard({
  allowed,
  children,
}: {
  allowed: Array<"user" | "admin" | "superadmin">
  children: React.ReactNode
}) {
  const { role, loading } = useRole()

  if (loading) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin mx-auto" />
          <div className="text-sm text-muted-foreground">Loading permissions...</div>
        </div>
      </div>
    )
  }

  if (!allowed.includes(role)) {
    return (
      <div className="min-h-[40vh] grid place-items-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this page. Contact an administrator if you believe this is an error.
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

  return <>{children}</>
}
