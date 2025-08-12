import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Public routes that should always be accessible
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health(.*)",
  "/api/donors(.*)",
  "/api/requests(.*)",
])

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/admin(.*)",
  "/api/profile(.*)",
  "/api/admin(.*)",
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes without auth
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect specific routes
  if (isProtectedRoute(req)) {
    const { userId } = auth()
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip static files and _next, handle everything else including pages and API
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
