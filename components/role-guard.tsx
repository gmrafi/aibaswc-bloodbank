"use client"

import type React from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!allowed.includes(role)) {
    return (
      <div className="min-h-[40vh] grid place-items-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">আপনার এ পেজে প্রবেশাধিকার নেই</h2>
          <p className="text-sm text-muted-foreground">প্রয়োজনে অ্যাডমিনের সাথে যোগাযোগ করুন।</p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/">
              <Button>হোম</Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">প্রোফাইল</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
