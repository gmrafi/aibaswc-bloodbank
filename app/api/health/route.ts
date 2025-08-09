import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET() {
  // Only return safe diagnostics — never secrets.
  const env = {
    supabaseUrlPresent: !!process.env.SUPABASE_URL,
    supabaseServiceRoleKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKeyPresent: !!process.env.SUPABASE_ANON_KEY,
    nextPublicSupabaseUrlPresent: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    clerkPublishableKeyPresent: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKeyPresent: !!process.env.CLERK_SECRET_KEY,
  }

  let supabaseOk = false
  let donorsCount: number | null = null
  let requestsCount: number | null = null
  let supabaseError: string | null = null

  try {
    const supabase = getSupabaseServer()
    const donors = await supabase.from("donors").select("*", { count: "exact", head: true })
    donorsCount = donors.count ?? null
    if (donors.error) throw donors.error

    const requests = await supabase.from("requests").select("*", { count: "exact", head: true })
    requestsCount = requests.count ?? null
    if (requests.error) throw requests.error

    supabaseOk = true
  } catch (e: any) {
    supabaseOk = false
    supabaseError = e?.message ?? "Unknown error"
  }

  return NextResponse.json({
    ok: supabaseOk,
    env,
    supabase: {
      connected: supabaseOk,
      donorsCount,
      requestsCount,
      error: supabaseError,
    },
  })
}
