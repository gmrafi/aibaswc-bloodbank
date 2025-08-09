"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import Dashboard from "@/components/ui-dashboard"

export default function AdminPage() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
          <SignIn appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }} />
        </div>
      </SignedOut>

      <SignedIn>
        <AppProviders>
          <LayoutShell>
            <Dashboard />
          </LayoutShell>
        </AppProviders>
      </SignedIn>
    </>
  )
}
