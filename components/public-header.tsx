"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, HeartHandshake, Users, ClipboardList } from "lucide-react"
import { CLUB } from "@/lib/club-config"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>{CLUB.shortName}</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 grid gap-1">
              <a href="#features" className="px-2 py-2 rounded-md hover:bg-muted/60" onClick={() => setOpen(false)}>
                Features
              </a>
              <a href="#how" className="px-2 py-2 rounded-md hover:bg-muted/60" onClick={() => setOpen(false)}>
                How it works
              </a>
              <a href="#contact" className="px-2 py-2 rounded-md hover:bg-muted/60" onClick={() => setOpen(false)}>
                Contact
              </a>
              <Link
                href="/donors"
                prefetch={false}
                className="px-2 py-2 rounded-md hover:bg-muted/60 font-medium flex items-center"
                onClick={() => setOpen(false)}
              >
                <Users className="size-4 mr-2" /> Donors
              </Link>
              <Link
                href="/requests"
                prefetch={false}
                className="px-2 py-2 rounded-md hover:bg-muted/60 font-medium flex items-center"
                onClick={() => setOpen(false)}
              >
                <ClipboardList className="size-4 mr-2" /> Requests
              </Link>
              <Link
                href="/admin"
                prefetch={false}
                className="px-2 py-2 rounded-md hover:bg-muted/60 font-medium"
                onClick={() => setOpen(false)}
              >
                Admin Portal
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HeartHandshake className="size-5 text-red-600" />
          <span>{CLUB.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          <a href="#features" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
            Features
          </a>
          <a href="#how" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
            How it works
          </a>
          <a href="#contact" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
            Contact
          </a>
          <Link
            href="/donors"
            prefetch={false}
            className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm flex items-center"
          >
            <Users className="size-4 mr-2" /> Donors
          </Link>
          <Link
            href="/requests"
            prefetch={false}
            className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm flex items-center"
          >
            <ClipboardList className="size-4 mr-2" /> Requests
          </Link>
          <Link href="/profile" prefetch={false} className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
            Profile
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link href="/admin" prefetch={false}>
            <Button className="bg-black hover:bg-black/90">Admin Portal</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
