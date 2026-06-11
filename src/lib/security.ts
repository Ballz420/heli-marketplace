// Lazy-load DOMPurify to avoid evaluation issues in some environments
let purifyInstance: any = null

const getPurify = () => {
  if (purifyInstance) return purifyInstance

  try {
    const DOMPurify = require('isomorphic-dompurify')
    purifyInstance = DOMPurify.default || DOMPurify
  } catch (e) {
    console.error('Failed to load DOMPurify:', e)
    purifyInstance = {
      sanitize: (str: string) => str,
    }
  }
  return purifyInstance
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Used for listing descriptions and any user-generated HTML content
 */
export function sanitizeHtml(dirty: string): string {
  const purify = getPurify()
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Sanitize plain text - removes all HTML tags
 * Used for titles, names, and other plain text fields
 */
export function sanitizeText(dirty: string): string {
  const purify = getPurify()
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Validate and sanitize file upload metadata
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts and special characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '_')
    .substring(0, 255)
}

/**
 * Check if a string contains potential SQL injection patterns
 * Note: This is a basic check - parameterized queries are the real defense
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION\s+SELECT/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /DROP\s+TABLE/i,
  ]
  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Rate limiter using a simple in-memory store
 * In production, use Redis or similar distributed store
 */
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  check(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now()
    const record = this.requests.get(key)

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 300000)
}