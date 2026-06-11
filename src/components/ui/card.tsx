import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300',
        hover && 'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={cn('relative aspect-[4/3] overflow-hidden bg-gray-50', className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

export function CardContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)}>{children}</div>
}

export function CardTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-bold text-lg text-heli-dark line-clamp-1 group-hover:text-heli-blue transition-colors', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-500 line-clamp-2 mt-1.5 leading-relaxed', className)}>
      {children}
    </p>
  )
}

export function CardPrice({ price, className }: { price: number; className?: string }) {
  return (
    <div className={cn('flex items-baseline gap-1 mt-3', className)}>
      <span className="text-sm font-medium text-heli-blue">$</span>
      <span className="text-2xl font-black text-heli-blue tracking-tight">
        {Math.floor(price)}
      </span>
      <span className="text-sm font-bold text-heli-blue/70">
        .{(price % 1).toFixed(2).split('.')[1]}
      </span>
    </div>
  )
}

export function CardBadge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
        {
          'bg-gray-100 text-gray-600': variant === 'default',
          'bg-green-100/80 text-heli-green backdrop-blur-sm': variant === 'success',
          'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm': variant === 'warning',
          'bg-red-100/80 text-heli-red backdrop-blur-sm': variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </span>
  )
}