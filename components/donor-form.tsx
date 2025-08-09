"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/compatibility"
import type { Donor } from "./blood-context"

type Props = {
  donor?: Donor | null
  onSubmit?: (data: Omit<Donor, "id" | "createdAt"> & Partial<Pick<Donor, "id" | "createdAt">>) => Promise<void> | void
  onCancel?: () => void
}

export default function DonorForm(props: Props) {
  const donor = props.donor ?? null
  const [name, setName] = useState(donor?.name ?? "")
  const [batch, setBatch] = useState(donor?.batch ?? "")
  const [studentId, setStudentId] = useState(donor?.studentId ?? "")
  const [department, setDepartment] = useState(donor?.department ?? "")
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>((donor?.bloodGroup as BloodGroup) ?? "O+")
  const [phone, setPhone] = useState(donor?.phone ?? "")
  const [phone2, setPhone2] = useState(donor?.phone2 ?? "")
  const [email, setEmail] = useState(donor?.email ?? "")
  const [contactPreference, setContactPreference] = useState<"Phone" | "WhatsApp" | "Email">(
    donor?.contactPreference ?? "Phone",
  )
  const [willing, setWilling] = useState(donor?.willing ?? true)
  const [lastDonation, setLastDonation] = useState(donor?.lastDonation ? donor.lastDonation.slice(0, 10) : "")
  const [notes, setNotes] = useState(donor?.notes ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (donor) {
      setName(donor.name)
      setBatch(donor.batch)
      setStudentId(donor.studentId)
      setDepartment(donor.department)
      setBloodGroup(donor.bloodGroup)
      setPhone(donor.phone)
      setPhone2(donor.phone2 ?? "")
      setEmail(donor.email ?? "")
      setContactPreference(donor.contactPreference ?? "Phone")
      setWilling(donor.willing)
      setLastDonation(donor.lastDonation ? donor.lastDonation.slice(0, 10) : "")
      setNotes(donor.notes ?? "")
    }
  }, [donor])

  const canSubmit = useMemo(() => {
    return name.trim() && studentId.trim() && department.trim() && phone.trim()
  }, [name, studentId, department, phone])

  return (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        if (!canSubmit) {
          setError("Please fill name, student ID, department, and phone.")
          return
        }
        try {
          setSubmitting(true)
          await props.onSubmit?.({
            id: donor?.id,
            createdAt: donor?.createdAt,
            name: name.trim(),
            batch: batch.trim(),
            studentId: studentId.trim(),
            department: department.trim(),
            bloodGroup,
            phone: phone.trim(),
            phone2: phone2.trim() || undefined,
            email: email.trim() || undefined,
            contactPreference,
            willing,
            lastDonation: lastDonation ? new Date(lastDonation).toISOString() : null,
            notes: notes.trim() || undefined,
          })
        } catch (e: any) {
          setError(e?.message ?? "Failed to save donor")
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aisha Khan" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="batch">Batch</Label>
          <Input id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="e.g., 23rd" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="studentId">Student ID</Label>
          <Input id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="department">Department</Label>
          <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label>Blood Group</Label>
          <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as BloodGroup)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lastDonation">Last Donation (optional)</Label>
          <Input id="lastDonation" type="date" value={lastDonation} onChange={(e) => setLastDonation(e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone 1</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone2">Phone 2 (optional)</Label>
          <Input id="phone2" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label>Contact Preference</Label>
          <Select value={contactPreference} onValueChange={(v) => setContactPreference(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select contact preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="willing" checked={willing} onCheckedChange={setWilling} />
          <Label htmlFor="willing">Willing to donate</Label>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={props.onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || submitting}>
          {submitting ? "Saving..." : donor ? "Save changes" : "Add donor"}
        </Button>
      </div>
    </form>
  )
}

DonorForm.defaultProps = {
  donor: null,
  onSubmit: async () => {},
  onCancel: () => {},
}
