import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/profile(.*)",
  "/admin(.*)",
  "/api/health(.*)",
  "/api/donors(.*)",
  "/api/requests(.*)",
  "/api/me(.*)",
])

// Keep API profile/admin open; page components will gate by auth client-side.
const isProtectedRoute = createRouteMatcher([
  "/api/profile(.*)",
  "/api/admin(.*)",
])

export default clerkMiddleware((auth, req) => {
  try {
    if (isPublicRoute(req)) {
      return NextResponse.next()
    }

    if (isProtectedRoute(req)) {
      const { userId } = auth()
      if (!userId) {
        // Allow through instead of redirect to avoid loops; handler will 401
        return NextResponse.next()
      }
    }

    return NextResponse.next()
  } catch {
    // Never hard-fail middleware
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
