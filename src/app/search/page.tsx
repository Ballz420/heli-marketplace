'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Search } from 'lucide-react'
import { ListingCard } from '@/components/ui/listing-card'
import { Button } from '@/components/ui/button'
import { categories, conditions } from '@/lib/mock-data'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  seller_id: string
  created_at: string
  status?: string
  updated_at?: string
  profiles?: {
    id: string
    full_name: string
    avatar_url: string
    email: string
  }
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'All'

  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Build query parameters
        const params = new URLSearchParams()
        if (query) params.append('q', query)
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory)
        if (selectedCondition && selectedCondition !== 'all') params.append('condition', selectedCondition)
        if (priceRange[0] > 0) params.append('minPrice', String(priceRange[0]))
        if (priceRange[1] < 10000) params.append('maxPrice', String(priceRange[1]))

        const response = await fetch(`/api/listings?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch listings')
        }

        const data = await response.json()
        setListings(data.listings || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [query, selectedCategory, selectedCondition, priceRange])

  // Sort listings client-side
  const sortedListings = React.useMemo(() => {
    let results = [...listings]

    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
    }

    return results
  }, [listings, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
            <div>
              <h3 className="font-semibold text-heli-dark mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-heli-blue"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-heli-dark mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-heli-blue focus:ring-heli-blue"
                    />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-heli-dark mb-3">Condition</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value="all"
                    checked={selectedCondition === 'all'}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-4 h-4 text-heli-blue focus:ring-heli-blue"
                  />
                  <span className="text-sm text-gray-600">All Conditions</span>
                </label>
                {conditions.map((cond) => (
                  <label key={cond.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value={cond.value}
                      checked={selectedCondition === cond.value}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-4 h-4 text-heli-blue focus:ring-heli-blue"
                    />
                    <span className="text-sm text-gray-600">{cond.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-heli-dark mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-20 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-20 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                setQuery('')
                setSelectedCategory('All')
                setSelectedCondition('all')
                setPriceRange([0, 10000])
              }}
            >
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-heli-dark mb-2">Error loading listings</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  {sortedListings.length} {sortedListings.length === 1 ? 'result' : 'results'}
                  {query && ` for "${query}"`}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-heli-blue"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {sortedListings.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-heli-dark mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedListings.map((listing: Listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}