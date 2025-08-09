"use client"

import { useEffect, useRef, useState } from "react"

export default function ProfileEmbedPage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { Clerk } = await import("@clerk/clerk-js")
        const publishableKey =
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmlnaHQtc3R1ZC0wLmNsZXJrLmFjY291bnRzLmRldiQ"

        const clerk = new Clerk(publishableKey)
        await clerk.load()

        if (!mounted || !containerRef.current) return

        // Prefer mountUserProfile if available
        const anyClerk = clerk as any
        if (typeof anyClerk.mountUserProfile === "function") {
          anyClerk.mountUserProfile(containerRef.current, {
            appearance: { variables: { colorPrimary: "#111111" } },
          })
        } else if (typeof anyClerk.openUserProfile === "function") {
          // Fallback to opening the modal-style profile if mount is not available
          anyClerk.openUserProfile()
        } else {
          setError(
            "ClerkJS profile mounting APIs are unavailable in this environment. Use /profile instead for the Next.js component.",
          )
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load Clerk profile.")
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        <h1 className="text-2xl font-semibold mb-4">Your Profile (Embedded via clerk-js)</h1>
        <div className="rounded-lg border bg-white p-4">
          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div ref={containerRef} id="user-profile" className="min-h-[400px]" />
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          If this embed does not load, use the recommended Next.js page at /profile.
        </p>
      </div>
    </div>
  )
}
