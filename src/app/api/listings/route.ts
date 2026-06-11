import { NextRequest, NextResponse } from 'next/server'
import { mockListings } from '@/lib/mock-data'
import { listingSchema, searchQuerySchema } from '@/lib/validation'
import { sanitizeHtml, sanitizeText, containsSqlInjection } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate and sanitize query parameters
    const rawParams = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
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

    let results = [...mockListings]

    if (params.q) {
      const q = sanitizeText(params.q).toLowerCase()
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      )
    }

    if (params.category && params.category !== 'All') {
      const category = sanitizeText(params.category)
      results = results.filter((l) => l.category === category)
    }

    if (params.condition) {
      results = results.filter((l) => l.condition === params.condition)
    }

    if (params.minPrice !== undefined) {
      results = results.filter((l) => l.price >= params.minPrice!)
    }

    if (params.maxPrice !== undefined) {
      results = results.filter((l) => l.price <= params.maxPrice!)
    }

    return NextResponse.json({ 
      listings: results, 
      count: results.length,
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
    const body = await request.json()
    
    // Validate input with Zod
    const validationResult = listingSchema.safeParse(body)
    
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
    }

    // In a real app, this would insert into Supabase
    // const { data: listing, error } = await supabase
    //   .from('listings')
    //   .insert(sanitizedData)
    //   .select()
    //   .single()
    //
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 })
    // }

    return NextResponse.json(
      { 
        message: 'Listing created successfully', 
        listing: sanitizedData 
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