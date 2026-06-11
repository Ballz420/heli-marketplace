'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, DollarSign, Tag, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categories, conditions } from '@/lib/mock-data'
import { useToast } from '@/components/ui/toast'
import { listingSchema } from '@/lib/validation'
import { sanitizeHtml, sanitizeText } from '@/lib/security'

export default function SellPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('good')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (images.length + files.length > 8) {
      addToast('Maximum 8 images allowed', 'error')
      return
    }

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addToast('Only image files are allowed', 'error')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image must be less than 5MB', 'error')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const result = listingSchema.safeParse({
      title,
      description,
      price: Number(price),
      category,
      condition,
      images: images.length > 0 ? ['https://placeholder.com/image.jpg'] : [], // Validate structure
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]
        if (path) {
          fieldErrors[String(path)] = issue.message
        }
      })
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Sanitize inputs before sending
      const sanitizedData = {
        title: sanitizeText(title),
        description: sanitizeHtml(description),
        price: Number(price),
        category: sanitizeText(category),
        condition,
        images,
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create listing')
      }

      addToast('Item listed successfully!', 'success')
      router.push('/my-listings')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to create listing', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-heli-dark">Sell an Item</h1>
        <p className="mt-2 text-gray-500">List your item in under 60 seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Photos <span className="text-heli-red">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-heli-blue flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-heli-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.images}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Add up to 8 photos. First photo will be the cover image. Max 5MB each.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Title <span className="text-heli-red">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                errors.title ? 'border-heli-red' : 'border-gray-200'
              }`}
              maxLength={100}
            />
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-heli-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Description <span className="text-heli-red">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item - include details about condition, features, and why someone should buy it..."
              rows={5}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue resize-none ${
                errors.description ? 'border-heli-red' : 'border-gray-200'
              }`}
              maxLength={2000}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-heli-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 text-right">{description.length}/2000</p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Price <span className="text-heli-red">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
                errors.price ? 'border-heli-red' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-heli-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.price}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Category <span className="text-heli-red">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-heli-blue ${
              errors.category ? 'border-heli-red' : 'border-gray-200'
            }`}
          >
            <option value="">Select a category</option>
            {categories.filter(c => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-heli-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-heli-dark mb-2">
            Condition
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {conditions.map((cond) => (
              <button
                key={cond.value}
                type="button"
                onClick={() => setCondition(cond.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  condition === cond.value
                    ? 'bg-heli-blue text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-heli-blue'
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            List Item for Sale
          </Button>
          <p className="mt-3 text-xs text-gray-400 text-center">
            By listing this item, you agree to our Terms of Service and Community Guidelines.
          </p>
        </div>
      </form>
    </div>
  )
}