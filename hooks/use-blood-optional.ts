"use client"

import { useContext } from "react"
import { BloodContext } from "@/components/blood-context"

export function useBloodOptional() {
  const bloodContext = useContext(BloodContext)
  return bloodContext
}
