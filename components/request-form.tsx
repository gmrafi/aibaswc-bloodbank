"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/compatibility"

type Props = {
  onSubmit?: (data: {
    patientName: string
    bloodGroup: BloodGroup
    units: number
    neededBy: string
    location: string
    contactPerson: string
    contactPhone: string
    notes?: string
  }) => void
  onCancel?: () => void
}

export default function RequestForm(props: Props) {
  const [patientName, setPatientName] = useState("")
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+")
  const [units, setUnits] = useState(1)
  const [neededBy, setNeededBy] = useState(new Date().toISOString().slice(0, 10))
  const [location, setLocation] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [notes, setNotes] = useState("")

  const canSubmit = useMemo(() => {
    return patientName.trim() && location.trim() && contactPerson.trim() && contactPhone.trim() && units > 0
  }, [patientName, location, contactPerson, contactPhone, units])

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        props.onSubmit?.({
          patientName: patientName.trim(),
          bloodGroup,
          units,
          neededBy,
          location: location.trim(),
          contactPerson: contactPerson.trim(),
          contactPhone: contactPhone.trim(),
          notes: notes.trim() || undefined,
        })
      }}
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="patient">Patient Name</Label>
          <Input
            id="patient"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g., Jane Doe"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Blood Group</Label>
          <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as BloodGroup)}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
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
          <Label htmlFor="units">Units Needed</Label>
          <Input
            id="units"
            type="number"
            min={1}
            value={units}
            onChange={(e) => setUnits(Number.parseInt(e.target.value || "1"))}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="neededBy">Needed By</Label>
          <Input id="neededBy" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., City Hospital"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="e.g., Nurse Kelly"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="e.g., 555-9001"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Details, ward, etc."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          Create request
        </Button>
      </div>
    </form>
  )
}

RequestForm.defaultProps = {
  onSubmit: () => {},
  onCancel: () => {},
}
