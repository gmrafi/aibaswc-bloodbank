"use client"

import type React from "react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function AppClient({ children }: { children?: React.ReactNode }) {
  const [clerkError, setClerkError] = useState<string | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("Production Keys are only allowed for domain")) {
        setClerkError("Authentication is not available in preview mode. This is normal for development.")
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (clerkError) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Campus Blood Bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{clerkError}</p>
            <p className="text-xs text-muted-foreground">
              The app will work normally when deployed to the production domain.
            </p>
            {children && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Preview mode (authentication disabled):</p>
                {children}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="min-h-screen grid place-items-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Campus Blood Bank</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Please sign in to manage donors and requests.</p>
              <SignInButton mode="modal">
                <button className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90">
                  Sign in with Clerk
                </button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
    </>
  )
}
