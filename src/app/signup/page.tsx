'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase-client'

export default function SignupPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [supabase, setSupabase] = React.useState<ReturnType<typeof createClient> | null>(null)

  React.useEffect(() => {
    setSupabase(createClient())
  }, [])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!fullName) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      addToast('Loading authentication...', 'error')
      return
    }
    
    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role: 'buyer',
          })

        if (profileError) {
          throw new Error(profileError.message)
        }

        addToast('Account created successfully! Please check your email to verify.', 'success')
        router.push('/login')
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Signup failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!supabase) {
      addToast('Loading authentication...', 'error')
      return
    }
    
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Google signup failed', 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-heli-blue/5 to-heli-dark/5 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-heli-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-heli-blue/30">
              <span className="text-white font-black text-lg italic">H</span>
            </div>
            <h1 className="text-2xl font-bold text-heli-dark">Create Account</h1>
            <p className="text-gray-500 mt-2">Join Heli marketplace today</p>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-heli-dark mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                    errors.fullName ? 'border-heli-red' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-heli-red">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-heli-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                    errors.email ? 'border-heli-red' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-heli-red">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-heli-dark mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                    errors.password ? 'border-heli-red' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-heli-red">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters, 1 uppercase letter, and 1 number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-heli-dark mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                    errors.confirmPassword ? 'border-heli-red' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-heli-red">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>


          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-heli-blue font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
