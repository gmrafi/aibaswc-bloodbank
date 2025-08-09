import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserIdSafe()
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = await req.json()
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    id: data.id,
    patientName: data.patient_name,
    bloodGroup: data.blood_group,
    units: data.units,
    neededBy: data.needed_by,
    hospital: data.hospital ?? undefined,
    ward: data.ward ?? undefined,
    location: data.location,
    contactPerson: data.contact_person,
    contactPhone: data.contact_phone,
    contactPhone2: data.contact_phone2 ?? undefined,
    requestedBy: data.requested_by ?? undefined,
    relationToPatient: data.relation_to_patient ?? undefined,
    urgency: (data.urgency ?? "normal") as "low" | "normal" | "high" | "critical",
    notes: data.notes ?? undefined,
    status: data.status,
    createdAt: new Date(data.created_at).toISOString(),
    fulfilledAt: data.fulfilled_at ? new Date(data.fulfilled_at).toISOString() : undefined,
    matchedDonorIds: Array.isArray(data.matched_donor_ids) ? data.matched_donor_ids : [],
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserIdSafe()
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("requests").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
