import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Army IBA Social Welfare Club Blood Bank",
  description: "Manage donors and requests for the Army IBA Social Welfare Club.",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // If missing, render a clear message in non-production; in production, Clerk won’t init.
  if (!publishableKey) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <div style={{padding:16,border:"1px solid #fecaca",background:"#fee2e2",borderRadius:8,margin:16,color:"#991b1b"}}>
            Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Set it in your environment variables.
          </div>
          {children}
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey} signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  )
}
