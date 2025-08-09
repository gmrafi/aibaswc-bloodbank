export const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] as const
export type BloodGroup = (typeof BLOOD_GROUPS)[number]

// RBC compatibility matrix
// Recipient -> acceptable donor groups
const COMPAT_TABLE: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
}

export function isCompatible(donor: BloodGroup, recipient: BloodGroup) {
  return COMPAT_TABLE[recipient].includes(donor)
}

export function daysBetween(aISO?: string | null, bISO?: string | null) {
  if (!aISO || !bISO) return Number.POSITIVE_INFINITY
  const a = new Date(aISO)
  const b = new Date(bISO)
  const diff = Math.abs(b.getTime() - a.getTime())
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function daysSince(dateISO?: string | null) {
  if (!dateISO) return Number.POSITIVE_INFINITY
  return daysBetween(dateISO, new Date().toISOString())
}

export function nextEligibleDate(lastDonation?: string | null, minDays = 56) {
  if (!lastDonation) return new Date()
  const d = new Date(lastDonation)
  d.setDate(d.getDate() + minDays)
  return d
}

export function isEligible(lastDonation?: string | null, willing = true, minDays = 56) {
  if (!willing) return false
  if (!lastDonation) return true
  return daysSince(lastDonation) >= minDays
}
