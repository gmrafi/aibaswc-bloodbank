import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Attempt to read Clerk auth() if available
    const mod = await import("@clerk/nextjs/server").catch(() => null)
    if (!mod) {
      return NextResponse.json({
        ok: false,
        clerkAvailable: false,
        userId: null,
        message: "Clerk server SDK not loaded in this environment",
      })
    }
    const { auth } = mod
    const { userId, sessionId, getToken } = auth()
    return NextResponse.json({
      ok: !!userId,
      clerkAvailable: true,
      userId: userId ?? null,
      sessionId: sessionId ?? null,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 })
  }
}
