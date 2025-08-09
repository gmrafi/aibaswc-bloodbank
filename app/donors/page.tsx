"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs"
import { SignIn } from "@clerk/nextjs"
import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import DonorTable from "@/components/donor-table"

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
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold">Donors</h1>
              <p className="text-sm text-muted-foreground">
                Manage the list of student donors. Filter by blood group, department, and eligibility.
              </p>
              <DonorTable />
            </div>
          </LayoutShell>
        </AppProviders>
      </SignedIn>
    </>
  )
}
