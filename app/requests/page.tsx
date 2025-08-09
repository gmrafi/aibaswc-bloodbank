import AppClient from "@/components/app-client"
import LayoutShell from "@/components/layout-shell"
import RequestTable from "@/components/request-table"

export default function Page() {
  return (
    <AppClient>
      <LayoutShell>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Requests</h1>
          <p className="text-sm text-muted-foreground">Track blood requests and find compatible donors.</p>
          <RequestTable />
        </div>
      </LayoutShell>
    </AppClient>
  )
}
