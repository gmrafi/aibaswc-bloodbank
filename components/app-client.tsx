"use client"

import type React from "react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppClient({ children }: { children?: React.ReactNode }) {
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
