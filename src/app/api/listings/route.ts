import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { listingSchema, searchQuerySchema } from '@/lib/validation'
import { sanitizeHtml, sanitizeText, containsSqlInjection } from '@/lib/security'

async function createSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate and sanitize query parameters
    const rawParams = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    }

    const validationResult = searchQuerySchema.safeParse(rawParams)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const params = validationResult.data

    // Check for SQL injection attempts
    if (params.q && containsSqlInjection(params.q)) {
      return NextResponse.json(
        { error: 'Invalid search query' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseClient()

    // Build query
    let query = supabase
      .from('listings')
      .select('*, profiles(id, full_name, avatar_url, email)')
      .eq('status', 'active')

    // Apply filters
    if (params.q) {
      const q = sanitizeText(params.q)
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    if (params.category && params.category !== 'All') {
      query = query.eq('category', sanitizeText(params.category))
    }

    if (params.condition) {
      query = query.eq('condition', params.condition)
    }

    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice)
    }

    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice)
    }

    // Order by newest first
    query = query.order('created_at', { ascending: false })

    const { data: listings, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      listings: listings || [], 
      count: listings?.length || 0,
      filters: params 
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validationResult = listingSchema.safeParse({
      ...body,
      seller_id: user.id,
    })
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid listing data', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Sanitize text fields to prevent XSS
    const sanitizedData = {
      ...data,
      title: sanitizeText(data.title),
      description: sanitizeHtml(data.description),
      category: sanitizeText(data.category),
      seller_id: user.id,
    }

    // Insert into Supabase
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert(sanitizedData)
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: insertError.message || 'Failed to create listing' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Listing created successfully', 
        listing 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
