import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = await req.json()
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    id: data.id,
    patientName: data.patient_name,
    bloodGroup: data.blood_group,
    units: data.units,
    neededBy: data.needed_by,
    location: data.location,
    contactPerson: data.contact_person,
    contactPhone: data.contact_phone,
    notes: data.notes ?? undefined,
    status: data.status,
    createdAt: new Date(data.created_at).toISOString(),
    fulfilledAt: data.fulfilled_at ? new Date(data.fulfilled_at).toISOString() : undefined,
    matchedDonorIds: Array.isArray(data.matched_donor_ids) ? data.matched_donor_ids : [],
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("requests").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
