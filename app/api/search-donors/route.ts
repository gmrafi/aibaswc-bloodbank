import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, params } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    // Execute the search query
    const { data, error } = await supabase.rpc('execute_search_query', {
      search_query: query,
      search_params: params
    })

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Alternative approach using direct query execution
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bloodGroup = searchParams.get('blood_group')
    const department = searchParams.get('department')
    const batch = searchParams.get('batch')
    const willing = searchParams.get('willing')
    const query = searchParams.get('q')

    const supabase = getSupabaseServer()

    let supabaseQuery = supabase
      .from('profiles')
      .select('clerk_user_id, blood_group, department, batch, willing, last_donation')
      .not('blood_group', 'is', null)

    // Apply filters
    if (bloodGroup) {
      supabaseQuery = supabaseQuery.eq('blood_group', bloodGroup)
    }

    if (department) {
      supabaseQuery = supabaseQuery.ilike('department', `%${department}%`)
    }

    if (batch) {
      supabaseQuery = supabaseQuery.eq('batch', batch)
    }

    if (willing !== null) {
      supabaseQuery = supabaseQuery.eq('willing', willing === 'true')
    }

    if (query) {
      supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,department.ilike.%${query}%`)
    }

    // Order by relevance
    supabaseQuery = supabaseQuery.order('willing', { ascending: false })
    supabaseQuery = supabaseQuery.order('last_donation', { ascending: true, nullsFirst: true })

    const { data, error } = await supabaseQuery.limit(50)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    // Transform data to include user names
    const profilesWithNames = await Promise.all(
      data.map(async (profile) => {
        // You might want to fetch user names from Clerk or store them in profiles
        // For now, we'll use the clerk_user_id
        return {
          id: profile.clerk_user_id,
          full_name: profile.clerk_user_id, // This should be replaced with actual name
          blood_group: profile.blood_group,
          department: profile.department,
          batch: profile.batch,
          willing: profile.willing,
          last_donation: profile.last_donation
        }
      })
    )

    return NextResponse.json(profilesWithNames)

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
