import { getSupabaseServer } from "@/lib/supabase/server"
import { getUserIdSafe, getUserEmailSafe } from "@/lib/auth/safe-auth"

export type Role = "user" | "admin" | "superadmin"

export async function getUserRoleServer(): Promise<{ userId: string | null; role: Role }> {
  const userId = await getUserIdSafe()
  if (!userId) return { userId: null, role: "user" }

  const supabase = getSupabaseServer()

  try {
    const { data: prof, error } = await supabase.from("profiles").select("*").eq("clerk_user_id", userId).maybeSingle()

    if (error) {
      console.error("Profile fetch error:", error)
      return { userId, role: "user" }
    }

    if (!prof) {
      const email = await getUserEmailSafe()
      const { data } = await supabase
        .from("profiles")
        .insert({
          clerk_user_id: userId,
          role: "user",
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single()
      return { userId, role: (data?.role as Role) ?? "user" }
    }

    let role: Role = (prof.role as Role) ?? "user"

    const superEmail = process.env.SUPERADMIN_EMAIL?.toLowerCase().trim()
    if (superEmail) {
      const email = (await getUserEmailSafe())?.toLowerCase() ?? null
      if (email && email === superEmail && role !== "superadmin") {
        await supabase
          .from("profiles")
          .update({
            role: "superadmin",
            updated_at: new Date().toISOString(),
          })
          .eq("clerk_user_id", userId)
        role = "superadmin"
      }
    }

    return { userId, role }
  } catch (error) {
    console.error("Role determination error:", error)
    return { userId, role: "user" }
  }
}

export function isAdminLike(role: Role) {
  return role === "admin" || role === "superadmin"
}
