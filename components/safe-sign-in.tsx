"use client"

// A safe version of the snippet you shared:
// 'use client'
// import { SignIn, useUser } from '@clerk/nextjs'
// export default function Home() {
//   const { isSignedIn } = useUser()
//   if (!isSignedIn) return <SignIn />
//   return <div>Welcome!</div>
// }

import { useEffect, useState } from "react"
import { SignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs"

export default function SafeSignIn() {
  const { isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return <div className="w-full max-w-md h-[480px] rounded-lg border bg-white/60 animate-pulse" aria-hidden="true" />
  }

  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <div>Welcome!</div>
      </SignedIn>
    </>
  )
}
