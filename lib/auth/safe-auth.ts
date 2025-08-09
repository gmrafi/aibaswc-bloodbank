// Safe auth helper that works even when Clerk middleware isn't running (e.g., Next.js preview).
// In production (Vercel), middleware will run and auth() will return the real user/session.

export async function getUserIdSafe(): Promise<string | null> {
  try {
    const mod = await import("@clerk/nextjs/server")
    const { auth } = mod
    const { userId } = auth()
    return userId ?? null
  } catch {
    // No middleware / not available in the current runtime
    return null
  }
}
