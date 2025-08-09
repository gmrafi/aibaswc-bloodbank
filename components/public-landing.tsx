"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import PublicHeader from "./public-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeartPulse, Users, ClipboardList, ShieldCheck, PhoneCall, CheckCircle2 } from "lucide-react"

export default function PublicLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-blood-donation.png"
            alt="Students donating blood"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-red-700/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="max-w-3xl text-white">
            <Badge variant="secondary" className="mb-4 bg-white/90 text-red-700 hover:bg-white">
              Army IBA Social Welfare Club
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Army IBA Social Welfare Club Blood Bank</h1>
            <p className="mt-4 text-white/90 text-lg">
              Unite donors across campus. Track requests, match compatible donors instantly, and save lives—together.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/sign-in">
                <Button size="lg" className="bg-black hover:bg-black/90">
                  Admin Sign in
                </Button>
              </Link>
              <a href="#contact">
                <Button size="lg" variant="outline" className="bg-white/90 text-black hover:bg-white">
                  Become a Donor
                </Button>
              </a>
            </div>
          </div>

          {/* Quick stats (static marketing counters) */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {[
              { label: "Registered Donors", value: "250+" },
              { label: "Requests Served", value: "180+" },
              { label: "Avg. Match Time", value: "< 10m" },
              { label: "Active Volunteers", value: "30+" },
            ].map((s) => (
              <Card key={s.label} className="bg-white/95">
                <CardContent className="p-4">
                  <div className="text-2xl font-semibold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
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
            desc="Create requests, match compatible donors, mark fulfilled."
          />
          <Feature
            icon={<HeartPulse className="size-5 text-red-600" />}
            title="Smart Matching"
            desc="ABO/Rh compatibility and eligibility windows built-in."
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
            <Step n={1} title="Register donors">
              Add students with blood group and contact details. Eligibility updates automatically.
            </Step>
            <Step n={2} title="Create requests">
              For any patient in need, log required units and deadline, then auto-match compatible donors.
            </Step>
            <Step n={3} title="Notify & fulfill">
              Contact selected donors, mark the request fulfilled, and keep records tidy.
            </Step>
          </div>
        </div>
      </section>

      {/* Contact / Join */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Join as a donor</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Interested in becoming a donor? Reach our volunteer team to be added to the donor pool.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <a href="tel:+8801000000000">
                  <Button className="gap-2">
                    <PhoneCall className="size-4" />
                    Call a Volunteer
                  </Button>
                </a>
                <a
                  href="https://wa.me/00000000000?text=I%20want%20to%20become%20a%20donor%20at%20Army%20IBA%20SWC%20Blood%20Bank"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Message on WhatsApp</Button>
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">Admin access</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Club coordinators can sign in to manage donors and requests.
              </p>
              <div className="mt-4">
                <Link href="/sign-in">
                  <Button className="w-full">Admin Sign in</Button>
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
        <p>© {new Date().getFullYear()} Army IBA Social Welfare Club. All rights reserved.</p>
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

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
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
