import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-heli-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-heli-dark">Heli</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your local marketplace for unique finds. Buy, sell, and discover treasures in your community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-heli-dark mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/search?category=Electronics" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/search?category=Home+%26+Garden" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="/search?category=Fashion" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="font-semibold text-heli-dark mb-4">Sell</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sell" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  My Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-heli-dark mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-500 hover:text-heli-blue transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2024 Heli Marketplace. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-heli-red fill-heli-red" /> for local communities
          </p>
        </div>
      </div>
    </footer>
  )
}