"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import PublicLanding from "@/components/public-landing"
import AppClient from "@/components/app-client"
import LayoutShell from "@/components/layout-shell"
import Dashboard from "@/components/ui-dashboard"

export default function Page() {
  return (
    <>
      <SignedOut>
        <PublicLanding />
      </SignedOut>

      <SignedIn>
        <AppClient>
          <LayoutShell>
            <Dashboard />
          </LayoutShell>
        </AppClient>
      </SignedIn>
    </>
  )
}
