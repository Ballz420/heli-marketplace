'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, PlusCircle, User, Package, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/toast'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, profile, isLoading, logout } = useAuth()
  const { addToast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      addToast('Logged out successfully', 'success')
      router.push('/')
      setIsMenuOpen(false)
    } catch (error) {
      addToast('Failed to logout', 'error')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-heli-blue rounded-2xl flex items-center justify-center shadow-lg shadow-heli-blue/30 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-lg italic">H</span>
            </div>
            <span className="text-2xl font-black text-heli-dark tracking-tighter hidden sm:block">
              Heli<span className="text-heli-blue">.</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-heli-blue transition-colors" />
              <input
                type="text"
                placeholder="Search treasures, sellers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-heli-blue/10 focus:border-heli-blue/20 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="font-bold text-gray-600 hover:text-heli-blue">Browse</Button>
            </Link>
            {!isLoading && user ? (
              <>
                <Link href="/sell">
                  <Button size="sm" className="bg-heli-blue hover:bg-blue-600 rounded-xl font-bold gap-2 px-5">
                    <PlusCircle className="w-4 h-4" />
                    Sell
                  </Button>
                </Link>
                <div className="w-px h-6 bg-gray-100 mx-2" />
                <Link href="/my-listings">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-heli-blue transition-colors">
                    <Package className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-heli-blue transition-colors">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="w-px h-6 bg-gray-100 mx-2" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{profile?.full_name || user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-heli-red transition-colors gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : !isLoading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-gray-600 hover:text-heli-blue">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-heli-blue hover:bg-blue-600 rounded-xl font-bold px-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 space-y-2 animate-fade-in-up">
            <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
              <Package className="w-5 h-5 text-gray-400" />
              Browse Marketplace
            </Link>
            {!isLoading && user ? (
              <>
                <Link href="/sell" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-heli-blue hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="w-5 h-5" />
                  Sell an Item
                </Link>
                <Link href="/my-listings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                  <Package className="w-5 h-5 text-gray-400" />
                  My Listings
                </Link>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-5 h-5 text-gray-400" />
                  Your Profile
                </Link>
                <div className="w-full h-px bg-gray-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-heli-red hover:bg-heli-red/5 rounded-2xl w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : !isLoading ? (
              <>
                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-5 h-5 text-gray-400" />
                  Login
                </Link>
                <Link href="/signup" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-heli-blue hover:bg-heli-blue/5 rounded-2xl" onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="w-5 h-5" />
                  Sign Up
                </Link>
              </>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  )
}