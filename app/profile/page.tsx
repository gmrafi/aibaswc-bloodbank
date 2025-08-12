"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout-shell"
import { Breadcrumb } from "@/components/layout-shell"
import { ProfileHero } from "@/components/profile-hero"
import { AccountProfileCard } from "@/components/account-profile-card"
import { CampusProfileCard } from "@/components/campus-profile-card"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state while Clerk is loading or component is mounting
  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-16 bg-white shadow-sm border-b" />
        <div className="p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-96 rounded-xl bg-gray-200 animate-pulse" />
              <div className="h-96 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if there's a global error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pt-20">
          <div className="grid place-items-center min-h-[60vh]">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-red-800">Something Went Wrong</CardTitle>
                <p className="text-gray-600">We encountered an error loading your profile</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    {error}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => window.location.reload()}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/'}
                      className="w-full"
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pt-20">
          <div className="grid place-items-center min-h-[60vh]">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">Access Your Profile</CardTitle>
                <p className="text-gray-600">Sign in to manage your blood donation profile</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    You need to be signed in to access your profile.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => window.location.href = '/sign-in'}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/sign-up'}
                      className="w-full"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Having trouble signing in?</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/'}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Go to Homepage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Show the main profile content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pt-20">
        <Breadcrumb />
        <ProfileHero />
        <div className="grid gap-6 lg:grid-cols-2">
          <AccountProfileCard />
          <CampusProfileCard />
        </div>
      </div>
    </div>
  )
}
