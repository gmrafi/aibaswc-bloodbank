import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await getUserIdSafe()
  const payload = await req.json()
  const supabase = getSupabaseServer()

  // Attempt with extended fields
  const attempt1 = await supabase
    .from("requests")
    .update({
      patient_name: payload.patientName,
      blood_group: payload.bloodGroup,
      units: payload.units,
      needed_by: payload.neededBy,
      hospital: payload.hospital ?? null,
      ward: payload.ward ?? null,
      location: payload.location,
      contact_person: payload.contactPerson,
      contact_phone: payload.contactPhone,
      contact_phone2: payload.contactPhone2 ?? null,
      requested_by: payload.requestedBy ?? null,
      relation_to_patient: payload.relationToPatient ?? null,
      urgency: payload.urgency ?? "normal",
      notes: payload.notes ?? null,
      status: payload.status,
      fulfilled_at: payload.status === "fulfilled" ? new Date().toISOString() : null,
      matched_donor_ids: payload.matchedDonorIds ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*")
    .single()

  if (!attempt1.error && attempt1.data) {
    const d = attempt1.data
    return NextResponse.json({
      id: d.id,
      patientName: d.patient_name,
      bloodGroup: d.blood_group,
      units: d.units,
      neededBy: d.needed_by,
      hospital: d.hospital ?? undefined,
      ward: d.ward ?? undefined,
      location: d.location,
      contactPerson: d.contact_person,
      contactPhone: d.contact_phone,
      contactPhone2: d.contact_phone2 ?? undefined,
      requestedBy: d.requested_by ?? undefined,
      relationToPatient: d.relation_to_patient ?? undefined,
      urgency: (d.urgency ?? "normal") as "low" | "normal" | "high" | "critical",
      notes: d.notes ?? undefined,
      status: d.status,
      createdAt: new Date(d.created_at).toISOString(),
      fulfilledAt: d.fulfilled_at ? new Date(d.fulfilled_at).toISOString() : undefined,
      matchedDonorIds: Array.isArray(d.matched_donor_ids) ? d.matched_donor_ids : [],
    })
  }

  // Fallback to legacy columns only
  const attempt2 = await supabase
    .from("requests")
    .update({
      patient_name: payload.patientName,
      blood_group: payload.bloodGroup,
      units: payload.units,
      needed_by: payload.neededBy,
      location: payload.location,
      contact_person: payload.contactPerson,
      contact_phone: payload.contactPhone,
      notes: payload.notes ?? null,
      status: payload.status,
      fulfilled_at: payload.status === "fulfilled" ? new Date().toISOString() : null,
      matched_donor_ids: payload.matchedDonorIds ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*")
    .single()

  if (attempt2.error) return NextResponse.json({ error: attempt2.error.message }, { status: 500 })

  const d = attempt2.data
  return NextResponse.json({
    id: d.id,
    patientName: d.patient_name,
    bloodGroup: d.blood_group,
    units: d.units,
    neededBy: d.needed_by,
    hospital: d.hospital ?? undefined,
    ward: d.ward ?? undefined,
    location: d.location,
    contactPerson: d.contact_person,
    contactPhone: d.contact_phone,
    contactPhone2: d.contact_phone2 ?? undefined,
    requestedBy: d.requested_by ?? undefined,
    relationToPatient: d.relation_to_patient ?? undefined,
    urgency: (d.urgency ?? "normal") as "low" | "normal" | "high" | "critical",
    notes: d.notes ?? undefined,
    status: d.status,
    createdAt: new Date(d.created_at).toISOString(),
    fulfilledAt: d.fulfilled_at ? new Date(d.fulfilled_at).toISOString() : undefined,
    matchedDonorIds: Array.isArray(d.matched_donor_ids) ? d.matched_donor_ids : [],
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await getUserIdSafe()
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("requests").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
