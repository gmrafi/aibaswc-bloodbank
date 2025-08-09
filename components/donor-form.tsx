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
  onSubmit?: (data: Omit<Donor, "id" | "createdAt"> & Partial<Pick<Donor, "id" | "createdAt">>) => void
  onCancel?: () => void
}

export default function DonorForm(props: Props) {
  const donor = props.donor ?? null
  const [name, setName] = useState(donor?.name ?? "")
  const [studentId, setStudentId] = useState(donor?.studentId ?? "")
  const [department, setDepartment] = useState(donor?.department ?? "")
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>((donor?.bloodGroup as BloodGroup) ?? "O+")
  const [phone, setPhone] = useState(donor?.phone ?? "")
  const [email, setEmail] = useState(donor?.email ?? "")
  const [contactPreference, setContactPreference] = useState<"Phone" | "WhatsApp" | "Email">(
    donor?.contactPreference ?? "Phone",
  )
  const [willing, setWilling] = useState(donor?.willing ?? true)
  const [lastDonation, setLastDonation] = useState(donor?.lastDonation ? donor.lastDonation.slice(0, 10) : "")
  const [notes, setNotes] = useState(donor?.notes ?? "")

  useEffect(() => {
    // Sync if donor prop changes
    if (donor) {
      setName(donor.name)
      setStudentId(donor.studentId)
      setDepartment(donor.department)
      setBloodGroup(donor.bloodGroup)
      setPhone(donor.phone)
      setEmail(donor.email ?? "")
      setContactPreference(donor.contactPreference ?? "Phone")
      setWilling(donor.willing)
      setLastDonation(donor.lastDonation ? donor.lastDonation.slice(0, 10) : "")
      setNotes(donor.notes ?? "")
    }
  }, [donor]) // Updated dependency array to include the entire donor object

  const canSubmit = useMemo(() => {
    return name.trim() && studentId.trim() && department.trim() && phone.trim()
  }, [name, studentId, department, phone])

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        props.onSubmit?.({
          id: donor?.id,
          createdAt: donor?.createdAt,
          name: name.trim(),
          studentId: studentId.trim(),
          department: department.trim(),
          bloodGroup,
          phone: phone.trim(),
          email: email.trim() || undefined,
          contactPreference,
          willing,
          lastDonation: lastDonation ? new Date(lastDonation).toISOString() : null,
          notes: notes.trim() || undefined,
        })
      }}
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Aisha Khan" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., U2021-001"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g., Computer Science"
          />
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
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 555-0101" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., name@univ.edu"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
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
        <div className="grid gap-1.5">
          <Label htmlFor="lastDonation">Last Donation (optional)</Label>
          <Input id="lastDonation" type="date" value={lastDonation} onChange={(e) => setLastDonation(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="willing" checked={willing} onCheckedChange={setWilling} />
        <Label htmlFor="willing">Willing to donate</Label>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Availability, conditions, etc."
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {donor ? "Save changes" : "Add donor"}
        </Button>
      </div>
    </form>
  )
}

DonorForm.defaultProps = {
  donor: null,
  onSubmit: () => {},
  onCancel: () => {},
}
