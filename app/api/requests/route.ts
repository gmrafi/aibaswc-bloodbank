import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/auth/roles"

function mapRow(r: any) {
  return {
    id: r.id,
    patientName: r.patient_name,
    bloodGroup: r.blood_group,
    units: r.units,
    neededBy: r.needed_by,
    hospital: r.hospital,
    ward: r.ward,
    location: r.location,
    latitude: r.latitude,
    longitude: r.longitude,
    hospitalId: r.hospital_id,
    contactPerson: r.contact_person,
    contactPhone: r.contact_phone,
    contactPhone2: r.contact_phone2,
    requestedBy: r.requested_by,
    relationToPatient: r.relation_to_patient,
    urgency: r.urgency || "normal",
    notes: r.notes,
    status: r.status,
    createdAt: r.created_at,
    fulfilledAt: r.fulfilled_at,
    matchedDonorIds: r.matched_donor_ids || [],
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data.map(mapRow))
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const supabase = getSupabaseServer()
    
    const { data, error } = await supabase
      .from("requests")
      .insert({
        patient_name: payload.patientName,
        blood_group: payload.bloodGroup,
        units: payload.units,
        needed_by: payload.neededBy,
        hospital: payload.hospital,
        ward: payload.ward,
        location: payload.location,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        hospital_id: payload.hospitalId ?? null,
        contact_person: payload.contactPerson,
        contact_phone: payload.contactPhone,
        contact_phone2: payload.contactPhone2,
        requested_by: payload.requestedBy,
        relation_to_patient: payload.relationToPatient,
        urgency: payload.urgency || "normal",
        notes: payload.notes,
        status: "open",
      })
      .select()
      .single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapRow(data))
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { role } = await getUserRoleServer()
    if (role !== "superadmin") {
      return NextResponse.json({ error: "Only superadmin can delete requests" }, { status: 400 })
    }
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Request ID required" }, { status: 400 })
    
    const supabase = getSupabaseServer()
    const { error } = await supabase.from("requests").delete().eq("id", id)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await req.json()
    const supabase = getSupabaseServer()
    
    const { data, error } = await supabase
      .from("requests")
      .update({
        patient_name: payload.patientName,
        blood_group: payload.bloodGroup,
        units: payload.units,
        needed_by: payload.neededBy,
        hospital: payload.hospital,
        ward: payload.ward,
        location: payload.location,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        hospital_id: payload.hospitalId ?? null,
        contact_person: payload.contactPerson,
        contact_phone: payload.contactPhone,
        contact_phone2: payload.contactPhone2,
        requested_by: payload.requestedBy,
        relation_to_patient: payload.relationToPatient,
        urgency: payload.urgency,
        notes: payload.notes,
        status: payload.status,
        fulfilled_at: payload.fulfilledAt,
        matched_donor_ids: payload.matchedDonorIds,
      })
      .eq("id", payload.id)
      .select()
      .single()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapRow(data))
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
