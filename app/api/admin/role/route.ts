import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer, type Role } from "@/lib/auth/roles"

export async function PUT(req: Request) {
  const caller = await getUserRoleServer()
  if (caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const { clerkUserId, role } = body as { clerkUserId: string; role: Role }
  if (!clerkUserId || !["user", "admin", "superadmin"].includes(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("profiles").upsert({ clerk_user_id: clerkUserId, role })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
