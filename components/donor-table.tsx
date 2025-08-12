"use client"

import { useMemo, useState } from "react"
import type { Donor } from "./blood-context"
import { useBlood } from "./blood-context"
import { isEligible } from "@/lib/compatibility"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DonorForm from "./donor-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, MoreVertical } from "lucide-react"
import { BLOOD_GROUPS } from "@/lib/compatibility"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

export default function DonorTable() {
  const { state, upsertDonor, deleteDonor } = useBlood()
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [batch, setBatch] = useState<string>("all")
  const { toast } = useToast()
  const { role } = useRole()
  const canDeleteDonors = role === "superadmin"

  const batches = useMemo(() => {
    const set = new Set(state.donors.map((d) => d.batch).filter(Boolean))
    return ["all", ...Array.from(set)]
  }, [state.donors])

  const filtered = useMemo(() => {
    return state.donors.filter((d) => {
      const q = query.trim().toLowerCase()
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.studentId.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        (d.phone2 ?? "").toLowerCase().includes(q) ||
        (d.email ?? "").toLowerCase().includes(q)
      const matchesGroup = group === "all" || d.bloodGroup === group
      const eligible = isEligible(d.lastDonation ?? null, d.willing)
      const matchesAvail = availability === "all" ? true : availability === "eligible" ? eligible : !eligible
      const matchesBatch = batch === "all" ? true : d.batch === batch
      return matchesQ && matchesGroup && matchesAvail && matchesBatch
    })
  }, [state.donors, query, group, availability, batch])

  const [editing, setEditing] = useState<Donor | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="space-y-4">
      <SignedIn>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-lg font-semibold mb-2">Add a Donor</h2>
          <DonorForm
            onCancel={() => {
              // clear handled inside form by user
            }}
            onSubmit={async (data) => {
              try {
                await upsertDonor(data as any)
                toast({ title: "Donor added" })
              } catch (e: any) {
                toast({
                  title: "Failed to add donor",
                  description: e?.message ?? "Unknown error",
                  variant: "destructive",
                })
              }
            }}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="rounded-lg border bg-blue-50 p-4">
          <h2 className="text-lg font-semibold mb-2">Want to add a donor?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Sign in to add new donors or manage existing donor information.
          </p>
          <SignInButton mode="modal">
            <Button>Sign in to add donors</Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          placeholder="Search name, ID, phone, email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2 sm:ml-auto">
          <Select value={group} onValueChange={setGroup}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="eligible">Eligible</SelectItem>
              <SelectItem value="not">Not eligible</SelectItem>
            </SelectContent>
          </Select>
          <Select value={batch} onValueChange={setBatch}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b === "all" ? "All batches" : b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="whitespace-nowrap">Student ID</TableHead>
              <TableHead className="whitespace-nowrap">Blood Group</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="whitespace-nowrap">Last Donation</TableHead>
              <TableHead>Eligible</TableHead>
              <SignedIn>
                <TableHead className="text-right">Actions</TableHead>
              </SignedIn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => {
              const eligible = isEligible(d.lastDonation ?? null, d.willing)
              return (
                <TableRow key={d.id}>
                  <TableCell className="min-w-[180px]">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.email ?? ""}</div>
                  </TableCell>
                  <TableCell>{d.batch}</TableCell>
                  <TableCell>{d.studentId}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.bloodGroup}</Badge>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <div>{d.phone}</div>
                    <div>{d.phone2 ?? ""}</div>
                    <div className="text-xs text-muted-foreground">{d.contactPreference ?? ""}</div>
                  </TableCell>
                  <TableCell>{d.lastDonation ? d.lastDonation.slice(0, 10) : "—"}</TableCell>
                  <TableCell>
                    {eligible ? (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">Eligible</Badge>
                    ) : (
                      <Badge variant="outline">Not yet</Badge>
                    )}
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
                              setEditing(d)
                              setEditOpen(true)
                            }}
                          >
                            <Pencil className="size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-red-600"
                            onClick={async () => {
                              if (!canDeleteDonors) {
                                toast({
                                  title: "Access denied",
                                  description: "Only superadmin can delete donors",
                                  variant: "destructive",
                                })
                                return
                              }
                              try {
                                await deleteDonor(d.id)
                                toast({ title: "Donor deleted successfully" })
                              } catch (e: any) {
                                toast({
                                  title: "Failed to delete donor",
                                  description: e?.message ?? "Unknown error",
                                  variant: "destructive",
                                })
                              }
                            }}
                            disabled={!canDeleteDonors}
                          >
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </SignedIn>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No donors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Donor</DialogTitle>
          </DialogHeader>
          {editing && (
            <DonorForm
              donor={editing}
              onCancel={() => setEditOpen(false)}
              onSubmit={async (data) => {
                await upsertDonor(data)
                setEditOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
