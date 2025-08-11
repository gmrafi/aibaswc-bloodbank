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

export async function getCurrentUserSafe() {
  try {
    const mod = await import("@clerk/nextjs/server")
    const { currentUser } = mod
    const user = await currentUser()
    return user
  } catch {
    return null
  }
}

export async function getUserEmailSafe(): Promise<string | null> {
  try {
    const user = await getCurrentUserSafe()
    return user?.emailAddresses?.[0]?.emailAddress ?? null
  } catch {
    return null
  }
}
