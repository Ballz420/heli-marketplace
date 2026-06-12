'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, Settings, Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, isLoading, isAuthenticated } = useAuth()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <p className="text-center text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error if no profile data
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <p className="text-center text-gray-500">Unable to load profile. Please try again.</p>
        </div>
      </div>
    )
  }

  const currentUser = profile

  const menuItems = [
    { icon: Package, label: 'My Listings', href: '/my-listings', count: 4 },
    { icon: Heart, label: 'Saved Items', href: '#', count: 12 },
    { icon: ShoppingBag, label: 'Purchase History', href: '#', count: 3 },
    { icon: Settings, label: 'Settings', href: '#', count: null },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={currentUser.avatar_url || ''}
            alt={currentUser.full_name || ''}
            className="w-24 h-24 rounded-full"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-heli-dark">{currentUser.full_name}</h1>
            <p className="text-gray-500">{currentUser.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-heli-blue/10 text-heli-blue text-xs font-medium rounded-full capitalize">
                {currentUser.role}
              </span>
              <span className="text-sm text-gray-500">Member since 2024</span>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-heli-blue hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <item.icon className="w-6 h-6 text-heli-blue" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-heli-dark">{item.label}</p>
              {item.count !== null && (
                <p className="text-sm text-gray-500">{item.count} items</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-heli-dark mb-4">Seller Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-heli-blue">4</p>
            <p className="text-sm text-gray-500">Active Listings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-heli-green">12</p>
            <p className="text-sm text-gray-500">Items Sold</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl font-bold text-heli-purple">4.9</p>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}