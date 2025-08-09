"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, HeartHandshake } from "lucide-react"

export default function PublicHeader() {
  const [open, setOpen] = useState(false)

  const NavLinks = () => (
    <>
      <a href="#features" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
        Features
      </a>
      <a href="#how" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
        How it works
      </a>
      <a href="#contact" className="px-3 py-2 rounded-md hover:bg-muted/60 text-sm">
        Contact
      </a>
    </>
  )

  return (
    <header className="sticky top-0 z-20 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Army IBA SWC Blood Bank</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 grid gap-1">
              <a href="#features" className="px-2 py-2 rounded-md hover:bg-muted/60">
                Features
              </a>
              <a href="#how" className="px-2 py-2 rounded-md hover:bg-muted/60">
                How it works
              </a>
              <a href="#contact" className="px-2 py-2 rounded-md hover:bg-muted/60">
                Contact
              </a>
              <Link href="/sign-in" className="px-2 py-2 rounded-md hover:bg-muted/60">
                Admin Sign in
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <HeartHandshake className="size-5 text-red-600" />
          <span>Army IBA Social Welfare Club Blood Bank</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          <NavLinks />
        </nav>

        <div className="ml-auto">
          <Link href="/sign-in">
            <Button className="bg-black hover:bg-black/90">Admin Sign in</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
