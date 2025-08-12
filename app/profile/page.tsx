"use client"

import { useEffect, useState } from "react"
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BLOOD_GROUPS, type BloodGroup, isEligible, daysSince } from "@/lib/compatibility"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Droplets, 
  Shield,
  Edit3,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Heart,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"

type CampusProfile = {
  batch?: string
  department?: string
  phone1?: string
  phone2?: string
  bloodGroup?: BloodGroup
  lastDonation?: string
  willing?: boolean
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state until mounted and Clerk is loaded
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

  // Handle authentication error state
  if (isLoaded && !isSignedIn) {
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
                <SignIn appearance={{ 
                  elements: { 
                    formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors",
                    card: "shadow-none border-0"
                  } 
                }} />
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/sign-up'}
                    >
                      Create Account
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

  // Show authenticated content
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

function Header() {
  const { user, isSignedIn } = useUser()
  const { role } = useRole()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Donors', href: '/donors', icon: Users },
    { name: 'Requests', href: '/requests', icon: FileText },
    ...(role === 'admin' || role === 'superadmin' ? [{ name: 'Admin', href: '/admin', icon: Settings }] : []),
  ]

  const handleSignOut = () => {
    // Simple redirect to Clerk's sign-out page
    window.location.href = '/sign-out'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Blood Bank</h1>
                <p className="text-xs text-gray-500">Army IBA Social Welfare Club</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isSignedIn && user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || 'Profile'} />
                  <AvatarFallback className="text-sm font-medium">
                    {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              
              {isSignedIn && user && (
                <>
                  <Separator className="my-3" />
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} alt={user.fullName || 'Profile'} />
                        <AvatarFallback className="text-sm font-medium">
                          {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function ProfileHero() {
  const { user } = useUser()
  const { role, loading: roleLoading } = useRole()
  const [profileData, setProfileData] = useState<CampusProfile>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        const json = await res.json()
        setProfileData(json ?? {})
      } catch (error) {
        console.error("Profile fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

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
              <div className="flex items-center gap-3 pt-2">
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

function AccountProfileCard() {
  const { user } = useUser()

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <User className="w-5 h-5" />
          Account Profile
        </CardTitle>
        <p className="text-sm text-gray-600">Manage your Clerk account settings</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">{user?.primaryEmailAddress?.emailAddress}</p>
              <p className="text-sm text-gray-500">Primary Email</p>
            </div>
          </div>

          {user?.primaryPhoneNumber?.phoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{user.primaryPhoneNumber.phoneNumber}</p>
                <p className="text-sm text-gray-500">Primary Phone</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Member Since</p>
            </div>
          </div>

          <Separator />

          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-3">
              To update your account information, please visit your Clerk dashboard.
            </p>
            <Button variant="outline" className="w-full" onClick={() => window.open('https://accounts.clerk.dev', '_blank')}>
              <Edit3 className="w-4 h-4 mr-2" />
              Manage Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CampusProfileCard() {
  const { user } = useUser()
  const { role, loading: roleLoading } = useRole()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<CampusProfile>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/profile")
        const json = await res.json()
        if (active) setData(json ?? {})
      } catch (error) {
        console.error("Profile fetch error:", error)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [mounted])

  const syncFromAccount = () => {
    const primaryEmail = user?.primaryEmailAddress?.emailAddress
    const phoneNumber = user?.primaryPhoneNumber?.phoneNumber
    setData((d) => ({
      ...d,
      phone1: d.phone1 || phoneNumber || "",
    }))
    toast({ 
      title: "Synced", 
      description: "Account information synchronized successfully." 
    })
  }

  const save = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed")
      }
      toast({ 
        title: "Profile Updated", 
        description: "Your campus profile has been saved successfully.",
        variant: "default"
      })
    } catch (e: any) {
      toast({ 
        title: "Save Failed", 
        description: e?.message ?? "Unknown error occurred", 
        variant: "destructive" 
      })
    } finally {
      setSaving(false)
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <GraduationCap className="w-5 h-5" />
            Campus Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-10 rounded bg-gray-200 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <CardTitle className="text-gray-800">Campus Profile</CardTitle>
          </div>
          {!roleLoading && (
            <Badge variant={role === "superadmin" ? "default" : role === "admin" ? "secondary" : "outline"}>
              {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : "User"}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">Update your campus and blood donation information</p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="batch" className="text-sm font-medium text-gray-700">
              <GraduationCap className="w-4 h-4 inline mr-2" />
              Batch Year
            </Label>
            <Input
              id="batch"
              value={data.batch ?? ""}
              onChange={(e) => setData((d) => ({ ...d, batch: e.target.value }))}
              disabled={loading}
              placeholder="e.g., 2023"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-gray-700">
              <Building2 className="w-4 h-4 inline mr-2" />
              Department
            </Label>
            <Input
              id="department"
              value={data.department ?? ""}
              onChange={(e) => setData((d) => ({ ...d, department: e.target.value }))}
              disabled={loading}
              placeholder="e.g., CSE"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone1" className="text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 inline mr-2" />
              Primary Phone
            </Label>
            <Input
              id="phone1"
              value={data.phone1 ?? ""}
              onChange={(e) => setData((d) => ({ ...d, phone1: e.target.value }))}
              disabled={loading}
              placeholder="Primary phone number"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone2" className="text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 inline mr-2" />
              Secondary Phone
            </Label>
            <Input
              id="phone2"
              value={data.phone2 ?? ""}
              onChange={(e) => setData((d) => ({ ...d, phone2: e.target.value }))}
              disabled={loading}
              placeholder="Secondary phone number"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            <Droplets className="w-4 h-4 inline mr-2" />
            Blood Group
          </Label>
          <Select
            value={data.bloodGroup ?? ""}
            onValueChange={(v) => setData((d) => ({ ...d, bloodGroup: v as BloodGroup }))}
            disabled={loading}
          >
            <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
              <SelectValue placeholder="Select your blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((g) => (
                <SelectItem key={g} value={g} className="cursor-pointer">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-600" />
            <div>
              <Label htmlFor="willing" className="text-sm font-medium text-red-800">
                Willing to Donate Blood
              </Label>
              <p className="text-xs text-red-600">Toggle this if you're willing to donate blood when needed</p>
            </div>
          </div>
          <Switch
            id="willing"
            checked={data.willing !== false}
            onCheckedChange={(checked) => setData((d) => ({ ...d, willing: checked }))}
            disabled={loading}
            className="data-[state=checked]:bg-red-600"
          />
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={syncFromAccount} 
            disabled={loading || saving}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync from Account
          </Button>
          <Button 
            onClick={save} 
            disabled={saving || loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {data.bloodGroup && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Blood Donation Status</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {isEligible(data.lastDonation ?? null, data.willing !== false) 
                ? "You are currently eligible to donate blood. Thank you for your willingness to help others!"
                : "You are not eligible to donate at this time. Please check back later."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href="/" className="hover:text-gray-900 transition-colors">
        Home
      </Link>
      <span>/</span>
      <span className="text-gray-900 font-medium">Profile</span>
    </nav>
  )
}
