"use client"

import { useMemo, useState } from "react"
import { useBlood } from "./blood-context"
import type { BloodRequest, Donor } from "./blood-context"
import { isCompatible, isEligible } from "@/lib/compatibility"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RequestForm from "./request-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MoreVertical, Trash2, CheckCheck, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

export default function RequestTable() {
  const { state, addRequest, updateRequest, deleteRequest } = useBlood()
  const { toast } = useToast()
  const { role } = useRole()
  const canDeleteRequests = role === "superadmin"
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "open" | "fulfilled" | "cancelled">("all")

  const filtered = useMemo(() => {
    return state.requests.filter((r) => {
      const q = query.trim().toLowerCase()
      const matchesQ =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.hospital ?? "").toLowerCase().includes(q) ||
        r.contactPerson.toLowerCase().includes(q) ||
        r.contactPhone.toLowerCase().includes(q) ||
        (r.contactPhone2 ?? "").toLowerCase().includes(q)
      const matchesS = status === "all" ? true : r.status === status
      return matchesQ && matchesS
    })
  }, [state.requests, query, status])

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<BloodRequest | null>(null)

  const copyPhones = (donors: Donor[]) => {
    const phones = donors.map((d) => d.phone).join(", ")
    navigator.clipboard.writeText(phones).then(() => {
      toast({ title: "Copied", description: "Phone numbers copied to clipboard." })
    })
  }

  return (
    <div className="space-y-4">
      {/* Inline create form */}
      <SignedIn>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-lg font-semibold mb-2">Create a Request</h2>
          <RequestForm
            onCancel={() => {}}
            onSubmit={async (data) => {
              try {
                await addRequest(data as any)
                toast({ title: "Request created" })
              } catch (e: any) {
                toast({
                  title: "Failed to create request",
                  description: e?.message ?? "Unknown error",
                  variant: "destructive",
                })
              }
            }}
          />
        </div>
      </SignedIn>

      {/* Sign in prompt for non-authenticated users */}
      <SignedOut>
        <div className="rounded-lg border bg-red-50 p-4">
          <h2 className="text-lg font-semibold mb-2">Need blood urgently?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Sign in to create blood requests and get matched with compatible donors.
          </p>
          <SignInButton mode="modal">
            <Button>Sign in to create request</Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          placeholder="Search patient, location, hospital, contact..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="sm:ml-auto flex items-center gap-2">
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Needed By</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <SignedIn>
                <TableHead className="text-right">Actions</TableHead>
              </SignedIn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="min-w-[180px]">
                  <div className="font-medium">{r.patientName}</div>
                  <div className="text-xs text-muted-foreground">{r.notes ?? ""}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{r.bloodGroup}</Badge>
                </TableCell>
                <TableCell>{r.units}</TableCell>
                <TableCell className="capitalize">{r.urgency}</TableCell>
                <TableCell>{r.neededBy}</TableCell>
                <TableCell className="min-w-[160px]">
                  <div className="text-sm">{r.hospital ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.ward ?? ""}</div>
                </TableCell>
                <TableCell className="min-w-[180px]">
                  <div className="text-sm">{r.contactPerson}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.contactPhone}
                    {r.contactPhone2 ? `, ${r.contactPhone2}` : ""}
                  </div>
                </TableCell>
                <TableCell>
                  {r.status === "open" && <Badge className="bg-amber-500 hover:bg-amber-500">Open</Badge>}
                  {r.status === "fulfilled" && <Badge className="bg-emerald-600 hover:bg-emerald-600">Fulfilled</Badge>}
                  {r.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                </TableCell>
                <SignedIn>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            setView(r)
                            setOpen(true)
                          }}
                        >
                          <Eye className="size-4" /> View & match
                        </DropdownMenuItem>
                        {r.status === "open" && (
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={async () => {
                              try {
                                const updated = { ...r, status: "cancelled" as const }
                                await updateRequest(updated)
                              } catch {}
                            }}
                          >
                            Cancel
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="gap-2 text-red-600"
                          onClick={async () => {
                            if (!canDeleteRequests) {
                              toast({
                                title: "Access denied",
                                description: "Only superadmin can delete requests",
                                variant: "destructive",
                              })
                              return
                            }
                            try {
                              await deleteRequest(r.id)
                              toast({ title: "Request deleted successfully" })
                            } catch (e: any) {
                              toast({
                                title: "Failed to delete request",
                                description: e?.message ?? "Unknown error",
                                variant: "destructive",
                              })
                            }
                          }}
                          disabled={!canDeleteRequests}
                        >
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </SignedIn>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Request details</DialogTitle>
          </DialogHeader>
          {view && (
            <RequestDetails
              request={view}
              donors={state.donors}
              onClose={() => setOpen(false)}
              onSave={async (updated) => updateRequest(updated)}
              onCopyPhones={(d) => {
                const phones = d.map((x) => x.phone).join(", ")
                navigator.clipboard.writeText(phones)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RequestDetails({
  request,
  donors,
  onSave,
  onClose,
  onCopyPhones,
}: {
  request: BloodRequest
  donors: Donor[]
  onSave: (req: BloodRequest) => void
  onClose: () => void
  onCopyPhones: (d: Donor[]) => void
}) {
  const matches = useMemo(() => {
    return donors
      .filter((d) => d.willing)
      .filter((d) => isCompatible(d.bloodGroup as any, request.bloodGroup))
      .map((d) => ({ donor: d, eligible: isEligible(d.lastDonation ?? null, d.willing) }))
      .sort((a, b) => Number(b.eligible) - Number(a.eligible))
  }, [donors, request.bloodGroup])

  const [selected, setSelected] = useState<string[]>(request.matchedDonorIds ?? [])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectedDonors = donors.filter((d) => selected.includes(d.id))

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-md border p-3 bg-white">
          <div className="font-medium mb-2">{request.patientName}</div>
          <div className="text-sm text-muted-foreground">
            {"Group: "}
            {request.bloodGroup} {" • Units: "}
            {request.units} {" • Urgency: "}
            {request.urgency}
          </div>
          <div className="text-sm text-muted-foreground">
            {"Needed By: "}
            {request.neededBy} {" • Hospital: "}
            {request.hospital ?? "—"} {request.ward ? `(${request.ward})` : ""}
          </div>
          <div className="text-sm text-muted-foreground">
            {"Contact: "}
            {request.contactPerson} {" ("}
            {request.contactPhone}
            {request.contactPhone2 ? `, ${request.contactPhone2}` : ""}
            {")"}
          </div>
          {request.notes && <div className="text-sm mt-2">{request.notes}</div>}
        </div>
        <div className="rounded-md border p-3 bg-white">
          <div className="font-medium mb-2">Selected donors</div>
          {selectedDonors.length === 0 ? (
            <div className="text-sm text-muted-foreground">No donors selected.</div>
          ) : (
            <div className="space-y-2">
              {selectedDonors.map((d) => (
                <div key={d.id} className="text-sm flex items-center justify-between">
                  <span>
                    {d.name} {" • "}
                    {d.phone}
                    {d.phone2 ? `, ${d.phone2}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.bloodGroup}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onCopyPhones(selectedDonors)}>
                  <Copy className="size-4 mr-2" /> Copy phones
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Eligible</TableHead>
              <TableHead className="text-right">Select</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map(({ donor, eligible }) => (
              <TableRow key={donor.id}>
                <TableCell className="min-w-[180px]">
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {donor.department} • Batch {donor.batch}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{donor.bloodGroup}</Badge>
                </TableCell>
                <TableCell className="min-w-[160px]">
                  <div className="text-sm">{donor.phone}</div>
                  <div className="text-xs text-muted-foreground">{donor.phone2 ?? ""}</div>
                </TableCell>
                <TableCell>{donor.lastDonation ? donor.lastDonation.slice(0, 10) : "—"}</TableCell>
                <TableCell>
                  {eligible ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">Eligible</Badge>
                  ) : (
                    <Badge variant="outline">Not yet</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={selected.includes(donor.id) ? "default" : "outline"}
                    onClick={() => toggle(donor.id)}
                  >
                    {selected.includes(donor.id) ? (
                      <>
                        <CheckCheck className="size-4 mr-2" /> Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No compatible donors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => onSave({ ...request, matchedDonorIds: selected })}>Save selection</Button>
        <Button
          variant="secondary"
          onClick={() =>
            onSave({
              ...request,
              status: "fulfilled",
              fulfilledAt: new Date().toISOString(),
              matchedDonorIds: selected,
            })
          }
        >
          Mark fulfilled
        </Button>
      </div>
    </div>
  )
}
