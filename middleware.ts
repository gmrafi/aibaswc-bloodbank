import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/admin(.*)",
  "/api/profile(.*)",
  "/api/admin(.*)",
])

// Define public routes that should always be accessible
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health(.*)",
  "/api/donors(.*)",
  "/api/requests(.*)",
])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()
  const url = new URL(req.url)
  const path = url.pathname

  // Allow public routes
  if (isPublicRoute(path)) {
    return
  }

  // Check if user is authenticated for protected routes
  if (isProtectedRoute(path)) {
    if (!userId) {
      // Redirect to sign-in only if not already there
      if (!path.startsWith('/sign-in')) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.url)
        return Response.redirect(signInUrl)
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip static files and API routes that don't need auth
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
