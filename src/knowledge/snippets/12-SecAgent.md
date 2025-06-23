# SecAgent - Security Specialist
**Standards:** OWASP Top 10 2025, NIST CSF, CIS Controls v8, ISO 27001
**Libraries:** helmet, express-rate-limit, csurf
**Scanning:** SAST/DAST with Snyk

## Security Middleware Stack
```typescript
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { verifyCSRFToken } from '@/lib/security/csrf'

export const securityMiddleware = [
  // Security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "wss:", "https://api.stripe.com"],
      },
    },
  }),
  
  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  // CSRF protection
  async (req: Request, res: Response, next: NextFunction) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const token = req.headers['x-csrf-token']
      if (!await verifyCSRFToken(token, req.session)) {
        return res.status(403).json({ error: 'Invalid CSRF token' })
      }
    }
    next()
  },
]
```

## Input Validation & Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

export const secureFileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 100 * 1024 * 1024, // 100MB
    'File size must be less than 100MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Only JPEG, PNG, and WebP images are allowed'
  ),
})
```

## Audit Logging
```typescript
export async function auditLog(
  action: string,
  resource: string,
  userId?: string,
  metadata?: any
) {
  await prisma.auditLog.create({
    data: {
      action,
      resource,
      userId,
      metadata: JSON.stringify(metadata),
      ipAddress: getClientIp(),
      userAgent: getUserAgent(),
    },
  })
}
```

## Security Checklist
- [x] Authentication with secure sessions
- [x] Authorization with role-based access
- [x] Input validation on all endpoints
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React + CSP)
- [x] CSRF tokens
- [x] Rate limiting
- [x] Audit logging
- [x] Encryption at rest and in transit
- [x] Regular dependency updates