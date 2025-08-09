"use client"

import { useMemo, useState } from "react"
import type { Donor } from "./blood-context"
import { useBlood } from "./blood-context"
import { isEligible } from "@/lib/compatibility"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DonorForm from "./donor-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, MoreVertical } from "lucide-react"
import { BLOOD_GROUPS } from "@/lib/compatibility"
import { useToast } from "@/hooks/use-toast"

export default function DonorTable() {
  const { state, upsertDonor, deleteDonor } = useBlood()
  const [query, setQuery] = useState("")
  const [group, setGroup] = useState<string>("all")
  const [availability, setAvailability] = useState<string>("all")
  const [department, setDepartment] = useState<string>("all")

  const departments = useMemo(() => {
    const set = new Set(state.donors.map((d) => d.department).filter(Boolean))
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
        (d.email ?? "").toLowerCase().includes(q)
      const matchesGroup = group === "all" || d.bloodGroup === group
      const eligible = isEligible(d.lastDonation ?? null, d.willing)
      const matchesAvail = availability === "all" ? true : availability === "eligible" ? eligible : !eligible
      const matchesDept = department === "all" ? true : d.department === department
      return matchesQ && matchesGroup && matchesAvail && matchesDept
    })
  }, [state.donors, query, group, availability, department])

  const [editing, setEditing] = useState<Donor | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          placeholder="Search name, student ID, phone, email..."
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
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === "all" ? "All departments" : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o)
              if (!o) setEditing(null)
            }}
          >
            <DialogTrigger asChild>
              <Button>Add Donor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Donor" : "Add Donor"}</DialogTitle>
              </DialogHeader>
              <DonorForm
                donor={editing}
                onCancel={() => setOpen(false)}
                onSubmit={async (data) => {
                  try {
                    await upsertDonor(data)
                    toast({ title: editing ? "Donor updated" : "Donor added" })
                    setOpen(false)
                  } catch (e: any) {
                    toast({
                      title: "Failed to save donor",
                      description: e?.message ?? "Unknown error",
                      variant: "destructive",
                    })
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="whitespace-nowrap">Student ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="whitespace-nowrap">Blood Group</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="whitespace-nowrap">Last Donation</TableHead>
              <TableHead>Eligible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{d.studentId}</TableCell>
                  <TableCell>{d.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.bloodGroup}</Badge>
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    <div>{d.phone}</div>
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
                            setOpen(true)
                          }}
                        >
                          <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-red-600"
                          onClick={async () => {
                            try {
                              await deleteDonor(d.id)
                              toast({ title: "Donor deleted" })
                            } catch (e: any) {
                              toast({
                                title: "Failed to delete donor",
                                description: e?.message ?? "Unknown error",
                                variant: "destructive",
                              })
                            }
                          }}
                        >
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
    </div>
  )
}
