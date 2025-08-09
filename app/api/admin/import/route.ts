import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = await req.json()
  const supabase = getSupabaseServer()

  // Basic shape validation
  if (!payload || !Array.isArray(payload.donors) || !Array.isArray(payload.requests)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  // Clear existing data first (requests depend on donors only via matched ids)
  const delReq = await supabase.from("requests").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  if (delReq.error) return NextResponse.json({ error: delReq.error.message }, { status: 500 })
  const delDon = await supabase.from("donors").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  if (delDon.error) return NextResponse.json({ error: delDon.error.message }, { status: 500 })

  // Insert donors
  if (payload.donors.length > 0) {
    const donorsToInsert = payload.donors.map((d: any) => ({
      id: d.id, // preserve ids to keep request matches intact
      name: d.name,
      student_id: d.studentId,
      department: d.department,
      blood_group: d.bloodGroup,
      phone: d.phone,
      email: d.email ?? null,
      contact_preference: d.contactPreference ?? null,
      willing: d.willing ?? true,
      last_donation: d.lastDonation ?? null,
      notes: d.notes ?? null,
      created_at: d.createdAt ?? new Date().toISOString(),
      updated_at: d.updatedAt ?? new Date().toISOString(),
    }))
    const insDon = await supabase.from("donors").insert(donorsToInsert)
    if (insDon.error) return NextResponse.json({ error: insDon.error.message }, { status: 500 })
  }

  // Insert requests
  if (payload.requests.length > 0) {
    const requestsToInsert = payload.requests.map((r: any) => ({
      id: r.id,
      patient_name: r.patientName,
      blood_group: r.bloodGroup,
      units: r.units,
      needed_by: r.neededBy,
      location: r.location,
      contact_person: r.contactPerson,
      contact_phone: r.contactPhone,
      notes: r.notes ?? null,
      status: r.status ?? "open",
      created_at: r.createdAt ?? new Date().toISOString(),
      fulfilled_at: r.fulfilledAt ?? null,
      matched_donor_ids: Array.isArray(r.matchedDonorIds) ? r.matchedDonorIds : [],
      updated_at: new Date().toISOString(),
    }))
    const insReq = await supabase.from("requests").insert(requestsToInsert)
    if (insReq.error) return NextResponse.json({ error: insReq.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
