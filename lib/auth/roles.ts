import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe } from "@/lib/auth/safe-auth"

export type Role = "user" | "admin" | "superadmin"

async function getClerkEmail(): Promise<string | null> {
  try {
    const mod = await import("@clerk/nextjs/server")
    const { currentUser } = mod
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null
    return email
  } catch {
    return null
  }
}

export async function getUserRoleServer(): Promise<{ userId: string | null; role: Role }> {
  const userId = await getUserIdSafe()
  if (!userId) return { userId: null, role: "user" }

  const supabase = getSupabaseServer()

  // Ensure profile row exists
  const { data: prof, error } = await supabase.from("profiles").select("*").eq("clerk_user_id", userId).maybeSingle()
  if (error) {
    // If table missing, treat as user
    return { userId, role: "user" }
  }

  if (!prof) {
    // create default user profile
    const { data } = await supabase
      .from("profiles")
      .insert({ clerk_user_id: userId, role: "user" })
      .select("*")
      .single()
    return { userId, role: (data?.role as Role) ?? "user" }
  }

  let role: Role = (prof.role as Role) ?? "user"

  // Auto-elevate to superadmin if email matches env SUPERADMIN_EMAIL
  const superEmail = process.env.SUPERADMIN_EMAIL?.toLowerCase().trim()
  if (superEmail) {
    const email = (await getClerkEmail())?.toLowerCase() ?? null
    if (email && email === superEmail && role !== "superadmin") {
      await supabase.from("profiles").update({ role: "superadmin" }).eq("clerk_user_id", userId)
      role = "superadmin"
    }
  }

  return { userId, role }
}

export function isAdminLike(role: Role) {
  return role === "admin" || role === "superadmin"
}
