'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('id')
  // TODO: Fetch listing from Supabase API
  const listing = null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-heli-green" />
      </div>

      <h1 className="text-3xl font-bold text-heli-dark mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. We've sent a confirmation email with your order details.
      </p>

      {listing && (
        <Card className="mb-8 hover:shadow-none text-left">
          <CardContent className="p-5">
            <h2 className="font-semibold text-heli-dark mb-3">Order Details</h2>
            <div className="flex gap-4">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-heli-dark">{listing.title}</p>
                <p className="text-sm text-gray-500">Order #{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                <p className="text-lg font-bold text-heli-blue mt-1">
                  ${listing.price.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/search">
          <Button variant="outline" className="w-full gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/profile">
          <Button className="w-full gap-2">
            <Package className="w-4 h-4" />
            View Orders
          </Button>
        </Link>
      </div>

      <Link href="/" className="inline-block mt-6 text-sm text-gray-500 hover:text-heli-blue transition-colors">
        <span className="flex items-center gap-1">
          <Home className="w-4 h-4" />
          Back to Home
        </span>
      </Link>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}