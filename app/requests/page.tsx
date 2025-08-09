"use client"

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import RequestTable from "@/components/request-table"

export default function RequestsPage() {
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
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold">Requests</h1>
              <p className="text-sm text-muted-foreground">Create and track blood requests, match donors, and close.</p>
              <RequestTable />
            </div>
          </LayoutShell>
        </AppProviders>
      </SignedIn>
    </>
  )
}
