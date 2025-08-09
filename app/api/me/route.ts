import { NextResponse } from "next/server"

export async function GET() {
  // Safe default for preview environments without middleware.
  return NextResponse.json({
    ok: false,
    userId: null,
    role: "user",
    note: "Client-side role detection is used; no server-side auth required in preview.",
  })
}
