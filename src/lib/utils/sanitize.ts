/**
 * Sanitize HTML to prevent XSS attacks
 * Escapes dangerous characters that could be used for XSS
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize object properties to prevent XSS
 * Recursively escapes all string values in an object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = escapeHtml(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'object' && item !== null ? sanitizeObject(item) : 
        typeof item === 'string' ? escapeHtml(item) : item
      )
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

/**
 * Sanitize email content specifically
 * Allows some safe HTML tags but escapes dangerous ones
 */
export function sanitizeEmailHtml(html: string): string {
  // First escape all HTML
  let safe = escapeHtml(html)
  
  // Then allow specific safe tags back
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'div', 'span']
  
  allowedTags.forEach(tag => {
    // Opening tags
    safe = safe.replace(new RegExp(`&lt;${tag}&gt;`, 'gi'), `<${tag}>`)
    // Closing tags
    safe = safe.replace(new RegExp(`&lt;/${tag}&gt;`, 'gi'), `</${tag}>`)
    // Self-closing tags
    safe = safe.replace(new RegExp(`&lt;${tag}/&gt;`, 'gi'), `<${tag}/>`)
  })
  
  return safe
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  const trimmed = email.trim().toLowerCase()
  
  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email address')
  }
  
  // Additional sanitization for email
  return trimmed
    .replace(/[<>'"]/g, '') // Remove potential XSS characters
    .substring(0, 254) // Max email length per RFC
}

/**
 * Sanitize file names to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe chars with underscore
    .replace(/\.{2,}/g, '.') // Prevent directory traversal
    .substring(0, 255) // Max filename length
}