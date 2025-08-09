import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer, isAdminLike } from "@/lib/auth/roles"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { role } = await getUserRoleServer()
  if (!isAdminLike(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const payload = await req.json()
  const supabase = getSupabaseServer()

  const attempt1 = await supabase
    .from("donors")
    .update({
      name: payload.name,
      batch: payload.batch ?? null,
      student_id: payload.studentId,
      department: payload.department,
      blood_group: payload.bloodGroup,
      phone: payload.phone,
      phone2: payload.phone2 ?? null,
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

  if (!attempt1.error && attempt1.data) {
    const d = attempt1.data
    return NextResponse.json({
      id: d.id,
      name: d.name,
      batch: d.batch ?? "",
      studentId: d.student_id,
      department: d.department,
      bloodGroup: d.blood_group,
      phone: d.phone,
      phone2: d.phone2 ?? undefined,
      email: d.email ?? undefined,
      contactPreference: d.contact_preference ?? undefined,
      willing: d.willing,
      lastDonation: d.last_donation ? new Date(d.last_donation).toISOString() : null,
      notes: d.notes ?? undefined,
      createdAt: new Date(d.created_at).toISOString(),
      updatedAt: d.updated_at ? new Date(d.updated_at).toISOString() : undefined,
    })
  }

  const attempt2 = await supabase
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

  if (attempt2.error) return NextResponse.json({ error: attempt2.error.message }, { status: 500 })

  const d = attempt2.data
  return NextResponse.json({
    id: d.id,
    name: d.name,
    batch: d.batch ?? "",
    studentId: d.student_id,
    department: d.department,
    bloodGroup: d.blood_group,
    phone: d.phone,
    phone2: d.phone2 ?? undefined,
    email: d.email ?? undefined,
    contactPreference: d.contact_preference ?? undefined,
    willing: d.willing,
    lastDonation: d.last_donation ? new Date(d.last_donation).toISOString() : null,
    notes: d.notes ?? undefined,
    createdAt: new Date(d.created_at).toISOString(),
    updatedAt: d.updated_at ? new Date(d.updated_at).toISOString() : undefined,
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { role } = await getUserRoleServer()
  if (!isAdminLike(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const supabase = getSupabaseServer()
  const { error } = await supabase.from("donors").delete().eq("id", params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
