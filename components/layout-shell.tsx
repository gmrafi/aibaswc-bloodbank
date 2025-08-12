"use client"

import type React from "react"
import { useRole } from "@/hooks/use-role"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useBloodOptional } from "@/hooks/use-blood-optional"
import { Menu, Download, Upload, HeartHandshake, Users, ClipboardList, Home, User, FileText, Settings, LogOut, X, Droplets } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function Header() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { role } = useRole()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Donors', href: '/donors', icon: Users },
    { name: 'Requests', href: '/requests', icon: FileText },
    ...(role === 'admin' || role === 'superadmin' ? [{ name: 'Admin', href: '/admin', icon: Settings }] : []),
  ]

  const handleSignOut = () => {
    window.location.href = '/sign-out'
  }

  const showUserInfo = isLoaded && isSignedIn && user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Blood Bank</h1>
              <p className="text-xs text-gray-500">Army IBA Social Welfare Club</p>
            </div>
          </Link>

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
            {showUserInfo && (
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

              {showUserInfo && (
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

export function Breadcrumb() {
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

export default function LayoutShell({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const blood = useBloodOptional()
  const { toast } = useToast()
  const [importOpen, setImportOpen] = useState(false)
  const [fileContent, setFileContent] = useState("")
  const [navOpen, setNavOpen] = useState(false)
  const { role, loading: roleLoading } = useRole()

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="h-6 w-64 rounded bg-gray-200 animate-pulse" />
          </div>
        </header>
        <main className="flex-1 bg-gray-50">
          <div className="mx-auto max-w-7xl p-4">
            <div className="h-40 rounded bg-gray-100 animate-pulse" />
          </div>
        </main>
      </div>
    )
  }

  const handleExport = () => {
    if (!blood) return
    const data = blood.exportJSON()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blood-bank-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    if (!blood) return
    const res = await blood.importJSON(fileContent)
    if (res.ok) {
      toast({ title: "Import successful", description: "Database replaced with imported data." })
      setImportOpen(false)
      setFileContent("")
    } else {
      toast({ title: "Import failed", description: res.error ?? "Invalid file", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Army IBA Social Welfare Club Blood Bank</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-1">
                <Link
                  href="/"
                  prefetch={false}
                  className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center"
                  onClick={() => setNavOpen(false)}
                >
                  <Home className="size-4 mr-2" /> Dashboard
                </Link>
                {/* Removed role restrictions - everyone can see donors and requests */}
                <Link
                  href="/donors"
                  prefetch={false}
                  className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center"
                  onClick={() => setNavOpen(false)}
                >
                  <Users className="size-4 mr-2" /> Donors
                </Link>
                <Link
                  href="/requests"
                  prefetch={false}
                  className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center"
                  onClick={() => setNavOpen(false)}
                >
                  <ClipboardList className="size-4 mr-2" /> Requests
                </Link>
                <Link
                  href="/profile"
                  prefetch={false}
                  className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center"
                  onClick={() => setNavOpen(false)}
                >
                  <User className="size-4 mr-2" /> Profile
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <HeartHandshake className="size-5 text-red-600" />
            <span>Army IBA Social Welfare Club Blood Bank</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <Home className="size-4" /> Dashboard
            </Link>
            {/* Removed role restrictions - everyone can see donors and requests */}
            <Link href="/donors" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <Users className="size-4" /> Donors
            </Link>
            <Link href="/requests" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <ClipboardList className="size-4" /> Requests
            </Link>
            <Link href="/profile" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <User className="size-4" /> Profile
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {/* Only show data export/import for superadmin */}
            {blood && !roleLoading && role === "superadmin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExport} className="gap-2">
                    <Download className="size-4" /> Export JSON
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setImportOpen(true)} className="gap-2">
                    <Upload className="size-4" /> Import JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default">Sign in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl p-4">{children}</div>
      </main>

      {/* Only show import dialog for superadmin */}
      {blood && !roleLoading && role === "superadmin" && (
        <Sheet open={importOpen} onOpenChange={setImportOpen}>
          <SheetContent side="right" className="w-full sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Import from JSON</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Paste the JSON you exported earlier. This will replace donors and requests in the database.
              </p>
              <Input
                type="file"
                accept="application/json"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    const text = await f.text()
                    setFileContent(text)
                  }
                }}
              />
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-72 border rounded-md p-2 text-sm"
                placeholder="Paste JSON here..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setImportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport}>Import</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
