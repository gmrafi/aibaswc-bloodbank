import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

export async function GET() {
  const userId = await getUserIdSafe()
  if (!userId) return NextResponse.json(null)
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("profiles").select("*").eq("clerk_user_id", userId).maybeSingle()
  if (error) return NextResponse.json(null)
  return NextResponse.json(
    data
      ? {
          batch: data.batch ?? undefined,
          department: data.department ?? undefined,
          phone1: data.phone1 ?? undefined,
          phone2: data.phone2 ?? undefined,
          bloodGroup: data.blood_group ?? undefined,
        }
      : null,
  )
}

export async function PUT(req: Request) {
  const userId = await getUserIdSafe()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = await req.json()
  const supabase = getSupabaseServer()
  const upsert = {
    clerk_user_id: userId,
    batch: payload.batch ?? null,
    department: payload.department ?? null,
    phone1: payload.phone1 ?? null,
    phone2: payload.phone2 ?? null,
    blood_group: payload.bloodGroup ?? null,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from("profiles").upsert(upsert, { onConflict: "clerk_user_id" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
