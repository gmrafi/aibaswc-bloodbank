import { auth } from "@clerk/nextjs/server"

export async function getUserIdSafe(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    // In preview or when middleware isn't active, return null
    return null
  }
}
