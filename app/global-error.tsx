"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // global-error replaces the root layout when active and must include html/body
  return (
    <html>
      <body>
        <div className="min-h-[60vh] grid place-items-center p-6">
          <div className="max-w-lg text-center space-y-4">
            <h2 className="text-2xl font-semibold">A critical error occurred</h2>
            <p className="text-sm text-muted-foreground">
              Please try again. If the problem persists, contact the site admin.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => reset()}
                className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm"
              >
                Go to Home
              </button>
            </div>
            {error?.digest && (
              <p className="text-xs text-muted-foreground">
                {"Error ID: "}
                {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
