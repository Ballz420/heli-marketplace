'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Clock, PlusCircle } from 'lucide-react'
import { Card, CardImage, CardContent, CardTitle, CardPrice, CardBadge } from './card'
import { Listing, mockProfiles } from '@/lib/mock-data'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const seller = mockProfiles.find((p) => p.id === listing.seller_id)
  const daysAgo = Math.floor(
    (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link href={`/listing/${listing.id}`} className="group block h-full">
      <Card className="h-full flex flex-col">
        <div className="relative overflow-hidden">
          <CardImage
            src={listing.images[0] || '/placeholder.jpg'}
            alt={listing.title}
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
             <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg text-heli-blue hover:bg-heli-blue hover:text-white transition-colors">
               <PlusCircle className="w-5 h-5" />
             </div>
          </div>
          {listing.condition === 'new' && (
            <div className="absolute top-3 left-3">
              <CardBadge variant="success">New Arrival</CardBadge>
            </div>
          )}
        </div>
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col gap-1">
            <CardBadge variant="default" className="w-fit mb-1 bg-heli-blue/5 text-heli-blue border border-heli-blue/10">
              {listing.category}
            </CardBadge>
            <CardTitle>{listing.title}</CardTitle>
          </div>
          
          <CardPrice price={listing.price} />
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
            {seller && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={seller.avatar_url || ''}
                    alt={seller.full_name || ''}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-heli-green rounded-full border border-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">
                  {seller.full_name?.split(' ')[0] ?? 'Unknown'}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <Clock className="w-3 h-3" />
              <span>{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}