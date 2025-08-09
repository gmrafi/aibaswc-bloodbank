"use client"

import Link from "next/link"

import type React from "react"
import PublicHeader from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeartPulse, Users, ClipboardList, ShieldCheck, CheckCircle2, PhoneCall, Mail } from "lucide-react"
import { CLUB } from "@/lib/club-config"

export default function PublicLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      {/* Hero (no images) */}
      <section className="bg-gradient-to-b from-red-700 via-red-600 to-red-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-red-700 hover:bg-white">
            {CLUB.shortName}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl">{CLUB.name}</h1>
          <p className="mt-4 text-white/95 text-lg max-w-2xl">
            Unite donors across campus. Track requests, match compatible donors instantly, and save lives—together.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/admin">
              <Button size="lg" className="bg-black hover:bg-black/90">
                Go to Admin Portal
              </Button>
            </Link>
            <a href={`mailto:${CLUB.contactEmail}`}>
              <Button size="lg" variant="outline" className="bg-white/90 text-black hover:bg-white">
                Contact us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Users className="size-5 text-red-600" />}
            title="Donor Directory"
            desc="Organize donors by blood group, department, and eligibility."
          />
          <Feature
            icon={<ClipboardList className="size-5 text-red-600" />}
            title="Request Tracking"
            desc="Create requests, auto-match compatible donors, and mark fulfilled."
          />
          <Feature
            icon={<HeartPulse className="size-5 text-red-600" />}
            title="Smart Matching"
            desc="ABO/Rh compatibility and donation eligibility windows built-in."
          />
          <Feature
            icon={<ShieldCheck className="size-5 text-red-600" />}
            title="Secure Access"
            desc="Clerk authentication with Supabase database."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gray-50 border-t">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <Step n="1" title="Register donors">
              Add students with blood group and contact details. Eligibility updates automatically.
            </Step>
            <Step n="2" title="Create requests">
              Log required units and deadline, then auto-match compatible donors.
            </Step>
            <Step n="3" title="Notify & fulfill">
              Contact selected donors, then mark the request fulfilled.
            </Step>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Get in touch</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Email us to join as a donor or for any blood request coordination.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a href={`mailto:${CLUB.contactEmail}`}>
                  <Button className="gap-2">
                    <Mail className="size-4" />
                    {CLUB.contactEmail}
                  </Button>
                </a>
                <a href={`tel:${CLUB.contactPhone}`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <PhoneCall className="size-4" />
                    {CLUB.contactPhone}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Admin access</h3>
              <p className="mt-2 text-sm text-muted-foreground">Club coordinators can manage donors and requests.</p>
              <div className="mt-4">
                <Link href="/admin">
                  <Button className="w-full">Open Admin Portal</Button>
                </Link>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                  <span>Protected with Clerk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                  <span>Data stored in Supabase (Postgres)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {CLUB.name}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-red-50 p-2">{icon}</div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  )
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-red-600 text-white grid place-items-center text-sm font-semibold">
          {n}
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{children}</p>
    </div>
  )
}
