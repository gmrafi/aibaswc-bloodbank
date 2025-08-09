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
  // Use env when available; fall back to your provided test key for preview.
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_cmlnaHQtc3R1ZC0wLmNsZXJrLmFjY291bnRzLmRldiQ"

  return (
    <ClerkProvider publishableKey={publishableKey} signInUrl="/sign-in" signUpUrl="/sign-up">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
