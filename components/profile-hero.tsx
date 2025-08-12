"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Home, 
  Building2, 
  GraduationCap, 
  Droplets, 
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { daysSince } from "@/lib/compatibility"

type CampusProfile = {
  batch?: string
  department?: string
  phone1?: string
  phone2?: string
  bloodGroup?: string
  lastDonation?: string
  willing?: boolean
}

export function ProfileHero() {
  const { user } = useUser()
  const { role, loading: roleLoading } = useRole()
  const [profileData, setProfileData] = useState<CampusProfile>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null)
        const res = await fetch("/api/profile")
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`)
        }
        const json = await res.json()
        setProfileData(json ?? {})
      } catch (error) {
        console.error("Profile fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Show error state if profile fetch failed
  if (error && !loading) {
    return (
      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600">
        <div className="p-6 sm:p-8 text-white">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-red-200" />
            <h2 className="text-2xl font-bold">Profile Loading Error</h2>
            <p className="text-red-100">{error}</p>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-600 hover:bg-red-700'
      case 'admin': return 'bg-blue-600 hover:bg-blue-700'
      default: return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin'
      case 'admin': return 'Admin'
      default: return 'User'
    }
  }

  const isEligibleForDonation = profileData.bloodGroup && profileData.willing !== false && 
    (!profileData.lastDonation || daysSince(profileData.lastDonation) >= 56)

  return (
    <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600">
      <div className="p-6 sm:p-8 text-white">
        {/* Back to Dashboard Button */}
        <div className="flex justify-end mb-4">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Profile'} />
            <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
              {user?.fullName ? getInitials(user.fullName) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold">{user?.fullName || 'User'}</h1>
                <p className="text-red-100 text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              
              {!roleLoading && (
                <Badge className={`${getRoleColor(role)} text-white border-0 px-4 py-2 text-sm font-semibold`}>
                  <Shield className="w-4 h-4 mr-2" />
                  {getRoleLabel(role)}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {profileData.bloodGroup && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                  <Droplets className="w-4 h-4" />
                  <span className="font-semibold">Blood Group: {profileData.bloodGroup}</span>
                </div>
              )}
              
              {profileData.department && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                  <Building2 className="w-4 h-4" />
                  <span className="font-semibold">{profileData.department}</span>
                </div>
              )}

              {profileData.batch && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-semibold">Batch {profileData.batch}</span>
                </div>
              )}
            </div>

            {profileData.bloodGroup && (
              <div className="flex flex-wrap gap-3 pt-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isEligibleForDonation ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  {isEligibleForDonation ? (
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-300" />
                  )}
                  <span className="font-semibold">
                    {isEligibleForDonation ? 'Eligible for Donation' : 'Not Eligible Yet'}
                  </span>
                </div>
                
                {profileData.lastDonation && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">
                      Last: {new Date(profileData.lastDonation).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
