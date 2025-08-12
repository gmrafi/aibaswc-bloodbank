import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/auth/roles"
import { clerkClient } from "@clerk/nextjs/server"

// GET /api/admin/superadmins -> list superadmins
export async function GET() {
  const caller = await getUserRoleServer()
  if (caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("profiles")
    .select("clerk_user_id, role")
    .eq("role", "superadmin")
    .order("clerk_user_id")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Optionally enrich with Clerk user info
  try {
    const users = await Promise.all(
      (data || []).map(async (p) => {
        try {
          const u = await clerkClient.users.getUser(p.clerk_user_id)
          return {
            clerkUserId: p.clerk_user_id,
            role: p.role,
            fullName: u.fullName,
            email: u.primaryEmailAddress?.emailAddress || null,
            imageUrl: u.imageUrl,
          }
        } catch {
          return { clerkUserId: p.clerk_user_id, role: p.role }
        }
      })
    )
    return NextResponse.json(users)
  } catch {
    return NextResponse.json((data || []).map((p) => ({ clerkUserId: p.clerk_user_id, role: p.role })))
  }
}

// POST /api/admin/superadmins -> add by email
export async function POST(req: NextRequest) {
  const caller = await getUserRoleServer()
  if (caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const email: string | undefined = body?.email
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

  try {
    const list = await clerkClient.users.getUserList({ emailAddress: [email] })
    const target = list?.data?.[0]
    if (!target) {
      return NextResponse.json({ error: "User not found for that email" }, { status: 404 })
    }

    const supabase = getSupabaseServer()
    const { error } = await supabase
      .from("profiles")
      .upsert({ clerk_user_id: target.id, role: "superadmin", updated_at: new Date().toISOString() })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, clerkUserId: target.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to add superadmin" }, { status: 500 })
  }
}

// DELETE /api/admin/superadmins?clerkUserId=xxx -> demote to user
export async function DELETE(req: NextRequest) {
  const caller = await getUserRoleServer()
  if (caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const clerkUserId = searchParams.get("clerkUserId")
  if (!clerkUserId) return NextResponse.json({ error: "clerkUserId required" }, { status: 400 })

  // Prevent removing self accidentally (optional safety)
  if (caller.userId && caller.userId === clerkUserId) {
    return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 })
  }

  const supabase = getSupabaseServer()
  const { error } = await supabase
    .from("profiles")
    .update({ role: "user", updated_at: new Date().toISOString() })
    .eq("clerk_user_id", clerkUserId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
