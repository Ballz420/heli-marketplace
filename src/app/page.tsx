import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/ui/listing-card'
import { mockListings, categories } from '@/lib/mock-data'

export default function HomePage() {
  const trendingListings = mockListings.slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-heli-dark py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-heli-blue/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-heli-purple/10 blur-[120px] rounded-full animate-float [animation-delay:2s]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white text-xs font-bold uppercase tracking-widest mb-8">
                <Zap className="w-3.5 h-3.5 text-heli-blue animate-pulse" />
                <span>Launching in your community</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-heli-blue to-heli-purple">Treasures</span> Near You
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-lg">
                Heli is your local marketplace for unique finds. Buy, sell, and connect with your community through meaningful transactions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/search">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-heli-blue hover:bg-blue-600 shadow-lg shadow-heli-blue/25 transition-all hover:scale-105 gap-2">
                    Start Browsing
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/5 transition-all">
                    Sell an Item
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block animate-fade-in-up [animation-delay:200ms]">
               <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop" 
                    alt="Marketplace" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-heli-dark/60 to-transparent" />
               </div>
               <div className="absolute -top-6 -right-6 w-32 h-32 bg-heli-blue/10 rounded-full blur-2xl" />
               <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-heli-purple/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white/50 backdrop-blur-sm sticky top-16 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-gray-100">
              <Globe className="w-4 h-4 text-heli-blue" />
              <span className="text-xs font-black uppercase tracking-widest text-heli-dark">Explore</span>
            </div>
            <div className="flex gap-2">
              {categories.filter(c => c !== 'All').map((category) => (
                <Link
                  key={category}
                  href={`/search?category=${encodeURIComponent(category)}`}
                  className="px-5 py-2.5 bg-white border border-gray-100 hover:border-heli-blue hover:shadow-md rounded-full text-xs font-bold text-gray-600 hover:text-heli-blue transition-all whitespace-nowrap"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Listings */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-heli-purple">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Most Popular</span>
              </div>
              <h2 className="text-4xl font-black text-heli-dark tracking-tight">Trending Now</h2>
            </div>
            <Link
              href="/search"
              className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-heli-dark hover:text-white rounded-full transition-all duration-300"
            >
              <span className="text-sm font-bold">View Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingListings.map((listing, index) => (
              <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-heli-dark tracking-tight mb-4">Why Choose Heli?</h2>
            <p className="text-gray-500 font-medium">Built for trust, speed, and community impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-heli-blue/5 transition-all duration-500">
              <div className="w-14 h-14 bg-heli-blue/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-heli-blue" />
              </div>
              <h3 className="text-xl font-bold text-heli-dark mb-4">Secure Transactions</h3>
              <p className="text-gray-500 leading-relaxed">Every listing is verified. Buy and sell with confidence in your local community.</p>
            </div>
            <div className="group bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-heli-green/5 transition-all duration-500">
              <div className="w-14 h-14 bg-heli-green/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-heli-green" />
              </div>
              <h3 className="text-xl font-bold text-heli-dark mb-4">Lightning Fast</h3>
              <p className="text-gray-500 leading-relaxed">List an item in under 60 seconds. Our streamlined process gets you selling faster.</p>
            </div>
            <div className="group bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-heli-purple/5 transition-all duration-500">
              <div className="w-14 h-14 bg-heli-purple/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-heli-purple" />
              </div>
              <h3 className="text-xl font-bold text-heli-dark mb-4">Local First</h3>
              <p className="text-gray-500 leading-relaxed">Connect with neighbors, reduce shipping waste, and build community connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-heli-dark overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-heli-blue/10 blur-[100px] rounded-full" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to Start Selling?</h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join thousands of sellers in your community. Turn your unused items into cash today.
            </p>
            <Link href="/sell">
              <Button size="lg" className="h-16 px-10 rounded-full bg-white text-heli-dark hover:bg-gray-100 shadow-xl transition-all hover:scale-105 gap-2 font-bold text-lg">
                Create Your First Listing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}