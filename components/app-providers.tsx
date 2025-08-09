"use client"

import type React from "react"
import { BloodProvider } from "./blood-context"

export default function AppProviders({ children }: { children?: React.ReactNode }) {
  return <BloodProvider>{children}</BloodProvider>
}

AppProviders.defaultProps = {
  children: null,
}
