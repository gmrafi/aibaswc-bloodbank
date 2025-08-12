import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/donors(.*)",
  "/requests(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health(.*)",
])

const isProtectedRoute = createRouteMatcher(["/profile(.*)", "/admin(.*)", "/api/profile(.*)", "/api/me(.*)"])

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
