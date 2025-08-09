"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error for debugging (Vercel logs/console)
    // Avoid leaking sensitive details to the UI
    // eslint-disable-next-line no-console
    console.error("App segment error:", error)
  }, [error])

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred while loading this page. You can try again.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go to Home
          </Button>
        </div>
        {error?.digest && (
          <p className="text-xs text-muted-foreground">
            {"Error ID: "}
            {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
