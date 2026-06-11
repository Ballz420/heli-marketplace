# Heli Marketplace

A high-performance, multi-vendor marketplace MVP built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Responsive Design**: Mobile-first layout with beige "paper" aesthetic
- **Product Discovery**: Hero section, search, category browsing, and trending listings
- **Listing Management**: Create, view, and manage product listings with image uploads
- **Checkout Flow**: Complete purchase experience with shipping details
- **User Profiles**: Seller stats, order history, and account management
- **Mock Data**: Pre-populated with sample listings for immediate testing

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom Heli theme
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set up Supabase Database**:
   Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
src/
  app/                 # Next.js App Router pages
    api/               # API routes
    listing/[id]/      # Product detail page
    search/            # Search & filter page
    sell/              # Create listing form
    my-listings/       # Manage listings
    profile/           # User profile
    checkout/[id]/     # Checkout flow
    order-success/     # Order confirmation
    login/             # Login page (placeholder)
    signup/            # Signup page (placeholder)
  components/
    ui/                # Reusable UI components
    layout/            # Header, Footer
  lib/
    supabase.ts        # Supabase client
    database.types.ts  # TypeScript types
    mock-data.ts       # Sample data
    utils.ts           # Utility functions
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero, categories, trending |
| `/search` | Filterable product grid |
| `/listing/[id]` | Product details with "Get It Now" |
| `/sell` | Create a new listing |
| `/my-listings` | Manage your listings |
| `/profile` | User profile & stats |
| `/checkout/[id]` | Checkout with shipping |
| `/order-success` | Order confirmation |
| `/login` | Sign in (auth coming soon) |
| `/signup` | Create account (auth coming soon) |

## Next Steps

1. **Authentication**: Integrate Supabase Auth with email/password and OAuth
2. **Database**: Connect frontend to Supabase queries instead of mock data
3. **Image Storage**: Upload images to Supabase Storage bucket
4. **Stripe**: Add payment processing to the checkout flow
5. **Search**: Implement full-text search with PostgreSQL

## License

MIT