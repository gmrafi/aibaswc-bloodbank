"use client"

import { useEffect, useState } from "react"
import { SignUp, SignedIn, SignedOut, useUser } from "@clerk/nextjs"

export default function SignUpPage() {
  const { isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <div className="w-full max-w-md h-[560px] rounded-lg border bg-white/60 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <SignedOut>
        <SignUp
          appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }}
          afterSignUpUrl="/"
          redirectUrl="/"
        />
      </SignedOut>
      <SignedIn>
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">You are already signed in.</div>
          <a href="/" className="text-blue-600 hover:underline text-sm">
            Go to Homepage
          </a>
        </div>
      </SignedIn>
    </div>
  )
}
