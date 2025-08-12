"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

interface AppClientProps {
  children: React.ReactNode
}

export default function AppClient({ children }: AppClientProps) {
  const [mounted, setMounted] = useState(false)
  const { isLoaded } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by showing loading state until mounted
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="h-8 w-32 rounded bg-gray-200 animate-pulse mx-auto" />
          <div className="h-4 w-48 rounded bg-gray-200 animate-pulse mx-auto" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
