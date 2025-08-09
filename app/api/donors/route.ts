import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"
import { getUserRoleServer, isAdminLike } from "@/lib/auth/roles"

function mapRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    batch: r.batch ?? "",
    studentId: r.student_id,
    department: r.department,
    bloodGroup: r.blood_group,
    phone: r.phone,
    phone2: r.phone2 ?? undefined,
    email: r.email ?? undefined,
    contactPreference: r.contact_preference ?? undefined,
    willing: r.willing,
    lastDonation: r.last_donation ? new Date(r.last_donation).toISOString() : null,
    notes: r.notes ?? undefined,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
  }
}

export async function GET() {
  await getUserIdSafe()
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("donors").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(mapRow))
}

export async function POST(req: Request) {
  const { role } = await getUserRoleServer()
  if (!isAdminLike(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const payload = await req.json()
  const supabase = getSupabaseServer()

  const attempt1 = await supabase
    .from("donors")
    .insert({
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
    })
    .select("*")
    .single()

  if (!attempt1.error && attempt1.data) return NextResponse.json(mapRow(attempt1.data))

  const attempt2 = await supabase
    .from("donors")
    .insert({
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
    })
    .select("*")
    .single()

  if (attempt2.error) return NextResponse.json({ error: attempt2.error.message }, { status: 500 })
  return NextResponse.json(mapRow(attempt2.data))
}
