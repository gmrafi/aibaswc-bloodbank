"use client"

import AppProviders from "@/components/app-providers"
import LayoutShell from "@/components/layout-shell"
import RequestTable from "@/components/request-table"

export default function Page() {
  return (
    <AppProviders>
      <LayoutShell>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Blood Requests</h1>
          <p className="text-sm text-muted-foreground">
            View active blood requests. Sign in to create or manage requests.
          </p>
          <RequestTable />
        </div>
      </LayoutShell>
    </AppProviders>
  )
}
