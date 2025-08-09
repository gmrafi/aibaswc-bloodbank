"use client"

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import RequestTable from "@/components/request-table"
import RoleGuard from "@/components/role-guard"

export default function Page() {
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
            <RoleGuard allowed={["admin", "superadmin"]}>
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold">Requests</h1>
                <p className="text-sm text-muted-foreground">Track blood requests and find compatible donors.</p>
                <RequestTable />
              </div>
            </RoleGuard>
          </LayoutShell>
        </AppProviders>
      </SignedIn>
    </>
  )
}
