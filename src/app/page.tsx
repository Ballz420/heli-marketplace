'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/ui/listing-card'
import { categories } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase-client'

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

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?limit=6')
        const data = await response.json()
        setListings(data.listings || [])
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-heli-blue/10 via-white to-heli-dark/5 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-heli-dark leading-tight">
                  Buy & Sell <span className="text-heli-blue">Treasures</span> Locally
                </h1>
                <p className="text-lg text-gray-600 max-w-xl">
                  Discover amazing deals on secondhand items in your community. Safe, secure, and simple.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Listings
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Start Selling
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-heli-dark">10K+</p>
                  <p className="text-sm text-gray-600">Active Listings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-heli-dark">5K+</p>
                  <p className="text-sm text-gray-600">Happy Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-heli-dark">100%</p>
                  <p className="text-sm text-gray-600">Secure</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-heli-blue/20 to-heli-dark/20 rounded-3xl" />
                <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-heli-blue mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Fast & Easy Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-heli-dark mb-4">Why Choose Heli?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make buying and selling secondhand items safe, easy, and rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Transactions',
                description: 'All transactions are protected with buyer and seller guarantees',
              },
              {
                icon: Users,
                title: 'Verified Community',
                description: 'Connect with trusted buyers and sellers in your local area',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'List items in seconds and get responses from interested buyers',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-heli-blue mb-4" />
                <h3 className="text-xl font-bold text-heli-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-heli-dark mb-4">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.filter(c => c !== 'All').map((category) => (
              <Link
                key={category}
                href={`/search?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-heli-blue/10 to-heli-dark/10 rounded-2xl p-6 text-center hover:shadow-lg transition-all group-hover:scale-105">
                  <p className="font-semibold text-heli-dark group-hover:text-heli-blue transition-colors">
                    {category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Listings Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-heli-dark mb-2">Trending Now</h2>
              <p className="text-gray-600">Latest listings from our community</p>
            </div>
            <Link href="/search">
              <Button variant="ghost" className="hidden sm:flex">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={{
                    ...listing,
                    status: (listing.status || 'active') as 'active' | 'sold' | 'reserved',
                    condition: (listing.condition || 'good') as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
                    updated_at: listing.updated_at || listing.created_at,
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No listings yet. Be the first to list something!</p>
              <Link href="/sell">
                <Button>Start Selling</Button>
              </Link>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link href="/search" className="block">
              <Button variant="ghost" className="w-full">
                View All Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-heli-blue to-heli-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users buying and selling amazing items in their community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Create Account
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
