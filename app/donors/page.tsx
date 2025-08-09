import AppClient from "@/components/app-client"
import LayoutShell from "@/components/layout-shell"
import DonorTable from "@/components/donor-table"

export default function Page() {
  return (
    <AppClient>
      <LayoutShell>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Donors</h1>
          <p className="text-sm text-muted-foreground">
            Manage the list of student donors. Filter by blood group, department, and eligibility.
          </p>
          <DonorTable />
        </div>
      </LayoutShell>
    </AppClient>
  )
}
