"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
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
import { useBlood } from "./blood-context"
import { Menu, Download, Upload, HeartHandshake, Users, ClipboardList, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function LayoutShell({ children }: { children?: React.ReactNode }) {
  const { exportJSON, importJSON } = useBlood()
  const { toast } = useToast()
  const [importOpen, setImportOpen] = useState(false)
  const [fileContent, setFileContent] = useState("")

  const handleExport = () => {
    const data = exportJSON()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blood-bank-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    const res = await importJSON(fileContent)
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Army IBA Social Welfare Club Blood Bank</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-1">
                <Link href="/" className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2">
                  <Home className="size-4" /> Dashboard
                </Link>
                <Link href="/donors" className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2">
                  <Users className="size-4" /> Donors
                </Link>
                <Link href="/requests" className="px-2 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2">
                  <ClipboardList className="size-4" /> Requests
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
            <Link href="/donors" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <Users className="size-4" /> Donors
            </Link>
            <Link href="/requests" className="px-3 py-2 rounded-md hover:bg-muted/60 flex items-center gap-2 text-sm">
              <ClipboardList className="size-4" /> Requests
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
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

      {/* Import Sheet */}
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
    </div>
  )
}
