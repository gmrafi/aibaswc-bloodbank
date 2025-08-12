"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, User } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you're looking for doesn't exist. Use the shortcuts below to navigate.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Link href="/">
            <Button>
              <Home className="size-4 mr-2" /> Dashboard
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">
              <User className="size-4 mr-2" /> Profile
            </Button>
          </Link>
          <Link href="/donors">
            <Button variant="outline">Donors</Button>
          </Link>
          <Link href="/requests">
            <Button variant="outline">Requests</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin Portal</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
