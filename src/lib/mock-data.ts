// NOTE: Mock data has been removed. All data now comes from Supabase database.
// This file now only exports category and condition constants for form validation.

export const categories = [
  'All',
  'Electronics',
  'Home & Garden',
  'Fashion',
  'Sports',
  'Entertainment',
  'Art & Collectibles',
  'Books',
  'Toys & Games',
  'Automotive',
  'Other',
]

export const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
]