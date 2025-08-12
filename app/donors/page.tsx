"use client"
export const dynamic = "force-dynamic"

import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import DonorTable from "@/components/donor-table"

export default function Page() {
  return (
    <AppProviders>
      <LayoutShell>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Blood Donors</h1>
          <p className="text-sm text-muted-foreground">
            Browse available blood donors. Sign in to add or manage donor information.
          </p>
          <DonorTable />
        </div>
      </LayoutShell>
    </AppProviders>
  )
}
