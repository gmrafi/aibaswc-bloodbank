import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

// Map DB row to client type
function mapRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    studentId: r.student_id,
    department: r.department,
    bloodGroup: r.blood_group,
    phone: r.phone,
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
  // Do not throw if middleware isn't running (preview). In production, userId will be present.
  await getUserIdSafe()

  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("donors").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(mapRow))
}

export async function POST(req: Request) {
  // Optional: enforce auth when available (no-throw fallback in preview)
  const userId = await getUserIdSafe()
  // If you want to block unauthenticated writes in production, uncomment:
  // if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

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
      email: payload.email ?? null,
      contact_preference: payload.contactPreference ?? null,
      willing: payload.willing ?? true,
      last_donation: payload.lastDonation ?? null,
      notes: payload.notes ?? null,
    })
    .select("*")
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(mapRow(data))
}
