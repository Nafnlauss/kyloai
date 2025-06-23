import DOMPurify from 'isomorphic-dompurify'

// DOMPurify configuration for different contexts
const purifyConfigs = {
  // For plain text (no HTML allowed)
  plainText: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  
  // For user-generated content (limited HTML)
  userContent: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  },
  
  // For rich text editor content
  richText: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  },
}

// Sanitize HTML content with DOMPurify
export function sanitizeHtml(dirty: string, config: 'plainText' | 'userContent' | 'richText' = 'userContent'): string {
  if (typeof dirty !== 'string') {
    return ''
  }
  
  const purifyConfig = purifyConfigs[config]
  return DOMPurify.sanitize(dirty, purifyConfig)
}

// Sanitize for display in HTML attributes
export function sanitizeAttribute(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Sanitize URL to prevent XSS
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return ''
  }
  
  // Remove any JavaScript protocol
  if (url.match(/^[\s]*javascript:/i)) {
    return ''
  }
  
  // Remove data URLs unless they're images
  if (url.match(/^data:/) && !url.match(/^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/i)) {
    return ''
  }
  
  // Use DOMPurify to sanitize URL
  return DOMPurify.sanitize(url, { ALLOWED_TAGS: [] })
}

// Sanitize JSON data recursively
export function sanitizeJson<T extends object>(data: T): T {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value, 'plainText')
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = Array.isArray(value)
        ? value.map(item => typeof item === 'string' ? sanitizeHtml(item, 'plainText') : item)
        : sanitizeJson(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

// Sanitize user input for video prompts
export function sanitizePrompt(prompt: string): string {
  if (typeof prompt !== 'string') {
    return ''
  }
  
  // Remove any HTML tags
  const cleaned = sanitizeHtml(prompt, 'plainText')
  
  // Additional cleaning for prompts
  return cleaned
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 1000) // Limit length
}

// Export all functions from original sanitize.ts for backward compatibility
export { escapeHtml, sanitizeObject, sanitizeEmailHtml, sanitizeEmail, sanitizeFileName } from './sanitize'