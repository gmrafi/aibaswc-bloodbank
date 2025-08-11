import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/health(.*)"])

const isProtectedRoute = createRouteMatcher([
  "/donors(.*)",
  "/requests(.*)",
  "/profile(.*)",
  "/admin(.*)",
  "/api/donors(.*)",
  "/api/requests(.*)",
  "/api/profile(.*)",
  "/api/me(.*)",
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = auth()
    if (!userId) {
      const url = new URL("/sign-in", req.url)
      url.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
