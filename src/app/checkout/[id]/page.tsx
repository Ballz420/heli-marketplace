'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Truck, CreditCard, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const listingId = params.id as string

  // TODO: Fetch listing from Supabase API
  const listing = null
  const seller = null

  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-heli-dark">Listing Not Found</h1>
        <Button className="mt-4" onClick={() => router.push('/search')}>
          Browse Listings
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addToast('Order placed successfully!', 'success')
    router.push(`/order-success?id=${listing.id}`)
    setIsProcessing(false)
  }

  const isValid =
    shippingAddress.fullName.trim() &&
    shippingAddress.street.trim() &&
    shippingAddress.city.trim() &&
    shippingAddress.state.trim() &&
    shippingAddress.zip.trim()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-heli-blue transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listing
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-heli-dark mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-heli-dark mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-heli-blue" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, city: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={shippingAddress.zip}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, zip: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue"
                  />
                  <input
                    type="text"
                    value={shippingAddress.country}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-heli-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-heli-blue" />
                Payment Method
              </h2>
              <Card className="hover:shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded" />
                    <div>
                      <p className="font-medium text-heli-dark">Stripe Integration</p>
                      <p className="text-sm text-gray-500">Coming soon - secure payments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isProcessing}
              disabled={!isValid}
            >
              {isProcessing ? 'Processing...' : `Pay $${listing.price.toFixed(2)}`}
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4 text-heli-green" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold text-heli-dark mb-4">Order Summary</h2>
          <Card className="hover:shadow-none">
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-4">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-heli-dark line-clamp-2">{listing.title}</p>
                  <p className="text-sm text-gray-500">{listing.condition}</p>
                  <p className="text-sm text-gray-500">Sold by {seller?.full_name}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${listing.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-heli-green">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">${(listing.price * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-heli-dark">Total</span>
                  <span className="text-xl font-bold text-heli-blue">
                    ${(listing.price * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}