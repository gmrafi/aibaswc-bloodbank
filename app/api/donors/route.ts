import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/auth/roles"

function mapRow(r: any) {}

export async function GET() {
  // Removed auth requirement for public viewing
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("donors").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map(mapRow))
}

export async function POST(req: Request) {
  // Removed auth requirement for public submissions
  const payload = await req.json()
  const supabase = getSupabaseServer()
}

export async function DELETE(req: Request) {
  const { role } = await getUserRoleServer()
  if (role !== "superadmin") {
    return NextResponse.json({ error: "Only superadmin can delete donors" }, { status: 403 })
  }
}

export async function PUT(req: Request) {
  // Removed auth requirement for public editing
  const payload = await req.json()
  const supabase = getSupabaseServer()
}
