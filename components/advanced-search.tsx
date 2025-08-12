"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Droplets, Building2, GraduationCap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BLOOD_GROUPS } from "@/lib/compatibility"

export type SearchResult = {
  id: string
  full_name: string
  blood_group: string
  department: string
  batch: string
  willing: boolean
  last_donation?: string
  distance?: number
}

export function AdvancedSearch() {
  const [query, setQuery] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [department, setDepartment] = useState("")
  const [batch, setBatch] = useState("")
  const [willing, setWilling] = useState<boolean | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const searchDonors = async () => {
    setLoading(true)
    try {
      // Build search query
      let searchQuery = "SELECT * FROM profiles WHERE 1=1"
      const params: any[] = []
      let paramCount = 0

      // Full-text search on name
      if (query.trim()) {
        paramCount++
        searchQuery += ` AND (full_name ILIKE $${paramCount} OR department ILIKE $${paramCount})`
        params.push(`%${query.trim()}%`)
      }

      // Blood group filter
      if (bloodGroup) {
        paramCount++
        searchQuery += ` AND blood_group = $${paramCount}`
        params.push(bloodGroup)
      }

      // Department filter
      if (department) {
        paramCount++
        searchQuery += ` AND department ILIKE $${paramCount}`
        params.push(`%${department}%`)
      }

      // Batch filter
      if (batch) {
        paramCount++
        searchQuery += ` AND batch = $${paramCount}`
        params.push(batch)
      }

      // Willing to donate filter
      if (willing !== null) {
        paramCount++
        searchQuery += ` AND willing = $${paramCount}`
        params.push(willing)
      }

      // Only show profiles with blood group
      searchQuery += ` AND blood_group IS NOT NULL`
      
      // Order by relevance and availability
      searchQuery += ` ORDER BY willing DESC, last_donation ASC NULLS FIRST`

      // Execute search
      const response = await fetch('/api/search-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, params })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        console.error('Search failed')
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setQuery("")
    setBloodGroup("")
    setDepartment("")
    setBatch("")
    setWilling(null)
    setResults([])
  }

  const getEligibilityStatus = (lastDonation?: string, willing: boolean) => {
    if (!willing) return { status: 'Not Willing', color: 'bg-gray-500' }
    if (!lastDonation) return { status: 'Eligible', color: 'bg-green-500' }
    
    const daysSince = Math.floor((Date.now() - new Date(lastDonation).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince >= 56) return { status: 'Eligible', color: 'bg-green-500' }
    if (daysSince >= 45) return { status: 'Soon', color: 'bg-yellow-500' }
    return { status: 'Not Yet', color: 'bg-red-500' }
  }

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  useEffect(() => {
    if (query || bloodGroup || department || batch || willing !== null) {
      const timeoutId = setTimeout(searchDonors, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [query, bloodGroup, department, batch, willing])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Advanced Donor Search
        </CardTitle>
        <p className="text-sm text-gray-600">
          Find donors by blood group, department, batch, and availability
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Blood Group</label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Any blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any blood group</SelectItem>
                  {BLOOD_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Input
                placeholder="e.g., CSE, EEE"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Batch Year</label>
              <Input
                placeholder="e.g., 2023"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Willing to Donate</label>
              <Select 
                value={willing === null ? "" : willing.toString()} 
                onValueChange={(value) => setWilling(value === "" ? null : value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="true">Willing</SelectItem>
                  <SelectItem value="false">Not willing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(query || bloodGroup || department || batch || willing !== null) && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {results.length} donor{results.length !== 1 ? 's' : ''} found
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Search Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Searching donors...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((donor) => {
              const eligibility = getEligibilityStatus(donor.last_donation, donor.willing)
              return (
                <div
                  key={donor.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{donor.full_name}</h3>
                        <Badge className={eligibility.color + " text-white"}>
                          {eligibility.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-red-500" />
                          <span>{donor.blood_group}</span>
                        </div>
                        
                        {donor.department && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            <span>{donor.department}</span>
                          </div>
                        )}
                        
                        {donor.batch && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-green-500" />
                            <span>Batch {donor.batch}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <span>Last donation: {formatTimeAgo(donor.last_donation)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && results.length === 0 && (query || bloodGroup || department || batch || willing !== null) && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No donors found matching your criteria</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
