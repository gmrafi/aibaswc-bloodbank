"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Edit3
} from "lucide-react"

export function AccountProfileCard() {
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
