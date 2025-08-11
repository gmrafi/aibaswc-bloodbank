"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export type Role = "user" | "admin" | "superadmin"

export function useRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<Role>("user")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    async function determineRole() {
      try {
        const response = await fetch("/api/me")
        if (response.ok) {
          const data = await response.json()
          setRole(data.role || "user")
        } else {
          const superEmail = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? "").toLowerCase().trim()
          const email = (user?.primaryEmailAddress?.emailAddress ?? "").toLowerCase().trim()
          if (superEmail && email && email === superEmail) {
            setRole("superadmin")
          } else {
            setRole("user")
          }
        }
      } catch (error) {
        console.error("Role determination error:", error)
        const superEmail = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? "").toLowerCase().trim()
        const email = (user?.primaryEmailAddress?.emailAddress ?? "").toLowerCase().trim()
        if (superEmail && email && email === superEmail) {
          setRole("superadmin")
        } else {
          setRole("user")
        }
      } finally {
        setLoading(false)
      }
    }

    determineRole()
  }, [isLoaded, user])

  return { role, loading, isAdmin: role === "admin" || role === "superadmin" }
}
