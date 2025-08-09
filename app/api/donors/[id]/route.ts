import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserIdSafe()
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

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
      email: payload.email ?? null,
      contact_preference: payload.contactPreference ?? null,
      willing: payload.willing ?? true,
      last_donation: payload.lastDonation ?? null,
      notes: payload.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    id: data.id,
    name: data.name,
    studentId: data.student_id,
    department: data.department,
    bloodGroup: data.blood_group,
    phone: data.phone,
    email: data.email ?? undefined,
    contactPreference: data.contact_preference ?? undefined,
    willing: data.willing,
    lastDonation: data.last_donation ? new Date(data.last_donation).toISOString() : null,
    notes: data.notes ?? undefined,
    createdAt: new Date(data.created_at).toISOString(),
    updatedAt: data.updated_at ? new Date(data.updated_at).toISOString() : undefined,
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserIdSafe()
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const supabase = getSupabaseServer()
  const { error } = await supabase.from("donors").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
