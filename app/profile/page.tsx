"use client"

import { SignedIn, SignedOut, SignIn, UserProfile } from "@clerk/nextjs"

export default function ProfilePage() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
          <SignIn appearance={{ elements: { formButtonPrimary: "bg-black hover:bg-black/90" } }} />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-5xl p-4 sm:p-8">
            <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
            <div className="rounded-lg border bg-white p-2 sm:p-4">
              <UserProfile
                appearance={{
                  variables: { colorPrimary: "#111111" },
                  elements: { card: "shadow-none border-0", formButtonPrimary: "bg-black hover:bg-black/90" },
                }}
              />
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}
