import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/auth/roles"

function mapRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    batch: r.batch || r.student_id?.slice(0, 4) || "N/A",
    studentId: r.student_id,
    department: r.department,
    bloodGroup: r.blood_group,
    phone: r.phone,
    phone2: r.phone2,
    email: r.email,
    contactPreference: r.contact_preference,
    willing: r.willing,
    lastDonation: r.last_donation,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("donors").select("*").order("created_at", { ascending: false })
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
      .from("donors")
      .insert({
        name: payload.name,
        student_id: payload.studentId,
        department: payload.department,
        blood_group: payload.bloodGroup,
        phone: payload.phone,
        phone2: payload.phone2,
        email: payload.email,
        contact_preference: payload.contactPreference,
        willing: payload.willing,
        last_donation: payload.lastDonation,
        notes: payload.notes,
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
      return NextResponse.json({ error: "Only superadmin can delete donors" }, { status: 403 })
    }
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Donor ID required" }, { status: 400 })
    
    const supabase = getSupabaseServer()
    const { error } = await supabase.from("donors").delete().eq("id", id)
    
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
      .from("donors")
      .update({
        name: payload.name,
        student_id: payload.studentId,
        department: payload.department,
        blood_group: payload.bloodGroup,
        phone: payload.phone,
        phone2: payload.phone2,
        email: payload.email,
        contact_preference: payload.contactPreference,
        willing: payload.willing,
        last_donation: payload.lastDonation,
        notes: payload.notes,
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
