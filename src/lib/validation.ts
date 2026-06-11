import { z } from 'zod'

// Listing validation schema
export const listingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price is too high'),
  category: z
    .string()
    .min(1, 'Category is required'),
  condition: z
    .enum(['new', 'like_new', 'good', 'fair', 'poor'])
    .default('good'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(8, 'Maximum 8 images allowed'),
  seller_id: z
    .string()
    .uuid('Invalid seller ID')
    .optional(),
})

export type ListingInput = z.infer<typeof listingSchema>

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().max(100).optional(),
  category: z.string().optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(999999).optional(),
})

// Contact/message validation
export const messageSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).trim(),
  message: z.string().min(1).max(2000).trim(),
})

// Order validation
export const orderSchema = z.object({
  listing_id: z.string().uuid(),
  shipping_address: z.object({
    fullName: z.string().min(1).max(100).trim(),
    street: z.string().min(1).max(255).trim(),
    city: z.string().min(1).max(100).trim(),
    state: z.string().min(1).max(100).trim(),
    zip: z.string().min(1).max(20).trim(),
    country: z.string().min(1).max(100).trim(),
  }),
})

// Auth validation
export const loginSchema = z.object({
  email: z.string().email().max(255).trim(),
  password: z.string().min(8).max(100),
})

export const signupSchema = z.object({
  full_name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})