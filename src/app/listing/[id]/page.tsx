'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  Share2,
  Shield,
  Truck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Tag,
  Box
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { mockListings, mockProfiles } from '@/lib/mock-data'

export default function ListingPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  const listing = mockListings.find((l) => l.id === listingId)
  const seller = listing ? mockProfiles.find((p) => p.id === listing.seller_id) : null

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-heli-dark mb-2">Listing Not Found</h1>
        <p className="text-gray-500 mb-6">This item may have been sold or removed.</p>
        <Button onClick={() => router.push('/search')}>Browse Listings</Button>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    )
  }

  const conditionLabel =
    {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
    }[listing.condition] || listing.condition

  const daysAgo = Math.floor(
    (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-heli-blue transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-heli-red text-heli-red' : 'text-gray-600'}`}
                />
              </button>
              <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {listing.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {listing.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="flex gap-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === currentImageIndex
                      ? 'border-heli-blue'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-heli-blue/10 text-heli-blue text-xs font-medium rounded-full">
                {listing.category}
              </span>
              <span className="px-2.5 py-0.5 bg-green-100 text-heli-green text-xs font-medium rounded-full">
                {conditionLabel}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-heli-dark">
              {listing.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{daysAgo === 0 ? 'Listed today' : `Listed ${daysAgo}d ago`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>ID: {listing.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-heli-blue">
              ${listing.price.toFixed(2)}
            </span>
          </div>

          {/* Seller Card */}
          <Card className="hover:shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src={seller?.avatar_url || ''}
                  alt={seller?.full_name || ''}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-heli-dark">{seller?.full_name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-500">4.9 (12 reviews)</span>
                  </div>
                </div>
                <Link href={`/profile`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-heli-dark mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-heli-green" />
              <span className="text-sm text-gray-600">Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Truck className="w-5 h-5 text-heli-blue" />
              <span className="text-sm text-gray-600">Local Pickup</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href={`/checkout/${listing.id}`} className="flex-1">
              <Button size="lg" className="w-full gap-2">
                Get It Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Message Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}