"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export type Role = "user" | "admin" | "superadmin"

export function useRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<Role>("user")

  useEffect(() => {
    if (!isLoaded) return

    // 1) Try Clerk metadata (you can set this via Clerk dashboard or server later)
    const metaRole =
      (user?.publicMetadata?.role as Role | undefined) ?? (user?.unsafeMetadata?.role as Role | undefined)

    let r: Role = metaRole ?? "user"

    // 2) Optional superadmin override via public env (safe for client; not secret)
    const superEmail = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? "").toLowerCase().trim()
    const email = (user?.primaryEmailAddress?.emailAddress ?? "").toLowerCase().trim()
    if (superEmail && email && email === superEmail) {
      r = "superadmin"
    }

    setRole(r)
  }, [isLoaded, user])

  return { role, loading: !isLoaded, isAdmin: role === "admin" || role === "superadmin" }
}
