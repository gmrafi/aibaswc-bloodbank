"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <SignUp
        appearance={{
          elements: { formButtonPrimary: "bg-black hover:bg-black/90" },
        }}
      />
    </div>
  )
}
