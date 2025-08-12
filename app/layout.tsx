import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Army IBA Social Welfare Club Blood Bank",
  description: "Manage donors and requests for the Army IBA Social Welfare Club.",
    generator: 'v0.app'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isProduction = publishableKey?.startsWith("pk_live_")
  const currentDomain = typeof window !== "undefined" ? window.location.hostname : "localhost"

  // Use test key for preview environments or when production key is present but domain doesn't match
  const shouldUseTestKey = !publishableKey || (isProduction && !currentDomain.includes("aibaswc.gmrafi.com"))
  const finalKey = shouldUseTestKey ? "pk_test_cmlnaHQtc3R1ZC0wLmNsZXJrLmFjY291bnRzLmRldiQ" : publishableKey

  return (
    <ClerkProvider publishableKey={finalKey} signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
