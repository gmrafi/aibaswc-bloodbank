import { NextResponse } from "next/server"
import { getUserRoleServer } from "@/lib/auth/roles"

export async function GET() {
  try {
    const { userId, role } = await getUserRoleServer()
    return NextResponse.json({
      ok: true,
      userId,
      role,
    })
  } catch (error) {
    console.error("Auth error in /api/me:", error)
    return NextResponse.json({
      ok: false,
      userId: null,
      role: "user",
      note: "Client-side role detection is used; no server-side auth required in preview.",
    })
  }
}
