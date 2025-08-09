import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

function mapRow(r: any) {
  return {
    id: r.id,
    patientName: r.patient_name,
    bloodGroup: r.blood_group,
    units: r.units,
    neededBy: r.needed_by,
    hospital: r.hospital ?? undefined,
    ward: r.ward ?? undefined,
    location: r.location,
    contactPerson: r.contact_person,
    contactPhone: r.contact_phone,
    contactPhone2: r.contact_phone2 ?? undefined,
    requestedBy: r.requested_by ?? undefined,
    relationToPatient: r.relation_to_patient ?? undefined,
    urgency: (r.urgency ?? "normal") as "low" | "normal" | "high" | "critical",
    notes: r.notes ?? undefined,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
    fulfilledAt: r.fulfilled_at ? new Date(r.fulfilled_at).toISOString() : undefined,
    matchedDonorIds: Array.isArray(r.matched_donor_ids) ? r.matched_donor_ids : [],
  }
}

export async function GET() {
  await getUserIdSafe()
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(mapRow))
}

export async function POST(req: Request) {
  await getUserIdSafe()
  const payload = await req.json()
  const supabase = getSupabaseServer()

  // Attempt with extended fields
  const attempt1 = await supabase
    .from("requests")
    .insert({
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
      status: "open",
      matched_donor_ids: payload.matchedDonorIds ?? [],
    })
    .select("*")
    .single()

  if (!attempt1.error && attempt1.data) return NextResponse.json(mapRow(attempt1.data))

  // Fallback to legacy columns
  const attempt2 = await supabase
    .from("requests")
    .insert({
      patient_name: payload.patientName,
      blood_group: payload.bloodGroup,
      units: payload.units,
      needed_by: payload.neededBy,
      location: payload.location,
      contact_person: payload.contactPerson,
      contact_phone: payload.contactPhone,
      notes: payload.notes ?? null,
      status: "open",
      matched_donor_ids: payload.matchedDonorIds ?? [],
    })
    .select("*")
    .single()

  if (attempt2.error) return NextResponse.json({ error: attempt2.error.message }, { status: 500 })
  return NextResponse.json(mapRow(attempt2.data))
}
