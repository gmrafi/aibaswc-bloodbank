import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/donors(.*)",
  "/requests(.*)",
  "/profile(.*)",
])
const isAdminPage = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware((auth, req) => {
  // Initialize Clerk session for this request
  const { userId } = auth()

  // Allow public routes without redirect
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect admin pages: redirect unauthenticated users to sign-in
  if (isAdminPage(req) && !userId) {
    const url = new URL("/sign-in", req.url)
    // Optional: preserve return path
    url.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(url)
  }

  // Otherwise continue
  return NextResponse.next()
})

export const config = {
  // Apply to all routes except static files and Next internals; include API
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
