"use client"

import { useEffect, useState } from "react"
import { SignedOut, SignIn, useUser } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import Dashboard from "@/components/ui-dashboard"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { role, loading, isAdmin } = useRole()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a lightweight skeleton until React has mounted and Clerk is ready
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

  // Not signed in: show Clerk SignIn
  if (!isSignedIn) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <SignedOut>
          <SignIn appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }} />
        </SignedOut>
      </div>
    )
  }

  // Signed in but not admin-like on client: friendly message
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">আপনার অ্যাডমিন অ্যাক্সেস নেই</h2>
          <p className="text-sm text-muted-foreground">
            সুপারঅ্যাডমিন/অ্যাডমিন রোল প্রয়োজন। আপনার ইমেইলটি NEXT_PUBLIC_SUPERADMIN_EMAIL / SUPERADMIN_EMAIL এর সাথে মিলছে কিনা
            যাচাই করুন।
          </p>
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

  // Admin UI
  return (
    <AppProviders>
      <LayoutShell>
        <Dashboard />
      </LayoutShell>
    </AppProviders>
  )
}
