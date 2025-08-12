"use client"

import { useEffect, useState } from "react"
import { SignUp, useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || "/profile"
  const portalUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL
  const { isLoaded, isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isLoaded && isSignedIn) {
      router.replace(redirectUrl)
    }
  }, [mounted, isLoaded, isSignedIn, redirectUrl, router])

  if (portalUrl) {
    if (mounted) window.location.href = `${portalUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`
    return null
  }

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
        <div className="w-full max-w-md h-[560px] rounded-lg border bg-white/60 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <SignUp
        appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }}
        afterSignUpUrl={redirectUrl}
        redirectUrl={redirectUrl}
      />
    </div>
  )
}
