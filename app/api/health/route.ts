import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/auth/roles"

export async function GET() {
  const env = {
    supabaseUrlPresent: !!process.env.SUPABASE_URL,
    supabaseServiceRoleKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKeyPresent: !!process.env.SUPABASE_ANON_KEY,
    nextPublicSupabaseUrlPresent: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nextPublicSupabaseAnonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    clerkPublishableKeyPresent: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKeyPresent: !!process.env.CLERK_SECRET_KEY,
    superadminEmailPresent: !!process.env.SUPERADMIN_EMAIL,
    nextPublicSuperadminEmailPresent: !!process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL,
  }

  let supabaseOk = false
  let donorsCount: number | null = null
  let requestsCount: number | null = null
  let profilesCount: number | null = null
  let supabaseError: string | null = null

  try {
    const supabase = getSupabaseServer()

    const [donors, requests, profiles] = await Promise.all([
      supabase.from("donors").select("*", { count: "exact", head: true }),
      supabase.from("requests").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ])

    if (donors.error) throw donors.error
    if (requests.error) throw requests.error
    if (profiles.error) throw profiles.error

    donorsCount = donors.count ?? null
    requestsCount = requests.count ?? null
    profilesCount = profiles.count ?? null
    supabaseOk = true
  } catch (e: any) {
    supabaseOk = false
    supabaseError = e?.message ?? "Unknown error"
  }

  // Test auth system
  let authOk = false
  let authError: string | null = null
  let currentRole: string | null = null

  try {
    const { userId, role } = await getUserRoleServer()
    authOk = true
    currentRole = role
  } catch (e: any) {
    authOk = false
    authError = e?.message ?? "Auth system error"
  }

  return NextResponse.json({
    ok: supabaseOk && authOk,
    timestamp: new Date().toISOString(),
    env,
    supabase: {
      connected: supabaseOk,
      donorsCount,
      requestsCount,
      profilesCount,
      error: supabaseError,
    },
    auth: {
      working: authOk,
      currentRole,
      error: authError,
    },
  })
}
