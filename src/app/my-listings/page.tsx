'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Eye, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardImage, CardContent, CardTitle, CardBadge } from '@/components/ui/card'
import { mockListings, mockProfiles } from '@/lib/mock-data'

export default function MyListingsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all')

  // Simulate current user
  const currentUserId = 'user-1'
  const myListings = mockListings.filter(
    (l) => l.seller_id === currentUserId && (filter === 'all' || l.status === filter)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-heli-dark">My Listings</h1>
          <p className="mt-1 text-gray-500">Manage your items for sale</p>
        </div>
        <Link href="/sell">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Sell New Item
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'sold'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-heli-blue text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-heli-blue'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {myListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-heli-dark mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-6">Start selling your first item today</p>
          <Link href="/sell">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <Card key={listing.id}>
              <div className="relative">
                <CardImage src={listing.images[0]} alt={listing.title} />
                <div className="absolute top-3 left-3">
                  <CardBadge
                    variant={
                      listing.status === 'active'
                        ? 'success'
                        : listing.status === 'sold'
                        ? 'destructive'
                        : 'warning'
                    }
                  >
                    {listing.status}
                  </CardBadge>
                </div>
              </div>
              <CardContent>
                <CardTitle>{listing.title}</CardTitle>
                <p className="text-xl font-bold text-heli-blue mt-2">
                  ${listing.price.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/listing/${listing.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}