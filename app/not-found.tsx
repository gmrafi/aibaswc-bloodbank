"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, ClipboardList } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="max-w-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist. Use the shortcuts below to navigate.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Link href="/">
            <Button>
              <Home className="size-4 mr-2" /> Home
            </Button>
          </Link>
          <Link href="/donors">
            <Button variant="outline">
              <Users className="size-4 mr-2" /> Donors
            </Button>
          </Link>
          <Link href="/requests">
            <Button variant="outline">
              <ClipboardList className="size-4 mr-2" /> Requests
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin Portal</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
