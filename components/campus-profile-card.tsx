"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRole } from "@/hooks/use-role"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { BLOOD_GROUPS, type BloodGroup, isEligible } from "@/lib/compatibility"
import { 
  GraduationCap, 
  Phone, 
  Building2, 
  Droplets, 
  Heart, 
  Save, 
  RefreshCw, 
  AlertCircle
} from "lucide-react"

type CampusProfile = {
  batch?: string
  department?: string
  phone1?: string
  phone2?: string
  bloodGroup?: BloodGroup
  lastDonation?: string
  willing?: boolean
}

export function CampusProfileCard() {
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
