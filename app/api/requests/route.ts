import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseServer } from "@/lib/supabase/server"

function mapRow(r: any) {
  return {
    id: r.id,
    patientName: r.patient_name,
    bloodGroup: r.blood_group,
    units: r.units,
    neededBy: r.needed_by, // stored as date (YYYY-MM-DD)
    location: r.location,
    contactPerson: r.contact_person,
    contactPhone: r.contact_phone,
    notes: r.notes ?? undefined,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
    fulfilledAt: r.fulfilled_at ? new Date(r.fulfilled_at).toISOString() : undefined,
    matchedDonorIds: Array.isArray(r.matched_donor_ids) ? r.matched_donor_ids : [],
  }
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(mapRow))
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = await req.json()
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(mapRow(data))
}
