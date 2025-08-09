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
    hospital?: string
    ward?: string
    location: string
    contactPerson: string
    contactPhone: string
    contactPhone2?: string
    requestedBy?: string
    relationToPatient?: string
    urgency: "low" | "normal" | "high" | "critical"
    notes?: string
  }) => Promise<void> | void
  onCancel?: () => void
}

export default function RequestForm(props: Props) {
  const [patientName, setPatientName] = useState("")
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+")
  const [units, setUnits] = useState(1)
  const [neededBy, setNeededBy] = useState(new Date().toISOString().slice(0, 10))
  const [hospital, setHospital] = useState("")
  const [ward, setWard] = useState("")
  const [location, setLocation] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactPhone2, setContactPhone2] = useState("")
  const [requestedBy, setRequestedBy] = useState("")
  const [relationToPatient, setRelationToPatient] = useState("")
  const [urgency, setUrgency] = useState<"low" | "normal" | "high" | "critical">("normal")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return patientName.trim() && location.trim() && contactPerson.trim() && contactPhone.trim() && units > 0
  }, [patientName, location, contactPerson, contactPhone, units])

  return (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        if (!canSubmit) {
          setError("Please fill patient name, location, contact person, phone and units.")
          return
        }
        try {
          setSubmitting(true)
          await props.onSubmit?.({
            patientName: patientName.trim(),
            bloodGroup,
            units,
            neededBy,
            hospital: hospital.trim() || undefined,
            ward: ward.trim() || undefined,
            location: location.trim(),
            contactPerson: contactPerson.trim(),
            contactPhone: contactPhone.trim(),
            contactPhone2: contactPhone2.trim() || undefined,
            requestedBy: requestedBy.trim() || undefined,
            relationToPatient: relationToPatient.trim() || undefined,
            urgency,
            notes: notes.trim() || undefined,
          })
        } catch (e: any) {
          setError(e?.message ?? "Failed to create request")
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
          <Label htmlFor="patient">Patient Name</Label>
          <Input id="patient" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
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
        <div className="grid gap-1.5">
          <Label htmlFor="units">Units Needed</Label>
          <Input id="units" type="number" min={1} value={units} onChange={(e) => setUnits(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="neededBy">Needed By</Label>
          <Input id="neededBy" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="hospital">Hospital (optional)</Label>
          <Input id="hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ward">Ward/Bed (optional)</Label>
          <Input id="ward" value={ward} onChange={(e) => setWard(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="contactPhone">Phone 1</Label>
            <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="contactPhone2">Phone 2 (optional)</Label>
            <Input id="contactPhone2" value={contactPhone2} onChange={(e) => setContactPhone2(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="requestedBy">Requested By (optional)</Label>
          <Input id="requestedBy" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="relation">Relation to Patient (optional)</Label>
          <Input id="relation" value={relationToPatient} onChange={(e) => setRelationToPatient(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Urgency</Label>
          <Select value={urgency} onValueChange={(v) => setUrgency(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
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
          {submitting ? "Saving..." : "Create request"}
        </Button>
      </div>
    </form>
  )
}

RequestForm.defaultProps = {
  onSubmit: async () => {},
  onCancel: () => {},
}
