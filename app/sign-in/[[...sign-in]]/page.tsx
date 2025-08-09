"use client"

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <SignIn
        appearance={{
          elements: { formButtonPrimary: "bg-black hover:bg-black/90" },
        }}
      />
    </div>
  )
}
