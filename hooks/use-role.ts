"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export type Role = "user" | "admin" | "superadmin"

export function useRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<Role>("user")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Ensure we only run on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isLoaded) return

    async function determineRole() {
      try {
        if (user) {
          const response = await fetch("/api/me")
          if (response.ok) {
            const data = await response.json()
            setRole(data.role || "user")
            setLoading(false)
            return
          }
        }

        // Only access environment variables on client side
        if (typeof window !== 'undefined') {
          const superEmail = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? "").toLowerCase().trim()
          const email = (user?.primaryEmailAddress?.emailAddress ?? "").toLowerCase().trim()
          if (superEmail && email && email === superEmail) {
            setRole("superadmin")
          } else {
            setRole("user")
          }
        } else {
          setRole("user")
        }
      } catch (error) {
        console.error("Role determination error:", error)
        // Fallback to user role on error
        setRole("user")
      } finally {
        setLoading(false)
      }
    }

    determineRole()
  }, [mounted, isLoaded, user])

  // Return consistent initial state until mounted
  if (!mounted) {
    return { role: "user", loading: true, isAdmin: false }
  }

  return { 
    role, 
    loading, 
    isAdmin: role === "superadmin" || role === "admin" 
  }
}
