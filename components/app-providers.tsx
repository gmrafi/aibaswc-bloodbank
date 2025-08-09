"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BloodProvider } from "./blood-context"

// Delay mounting providers with effects until after the app has mounted on the client.
// This prevents setState calls from firing during/just-before mount (e.g., on /sign-in).
export default function AppProviders({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render children without providers until mounted to avoid side-effects during render.
    return <>{children}</>
  }

  return <BloodProvider>{children}</BloodProvider>
}

AppProviders.defaultProps = {
  children: null,
}
