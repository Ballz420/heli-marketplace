'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'buyer' | 'seller' | 'admin'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }

    if (!isLoading && user && requiredRole && profile?.role !== requiredRole) {
      router.push('/')
    }
  }, [user, isLoading, requiredRole, profile, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heli-blue" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
