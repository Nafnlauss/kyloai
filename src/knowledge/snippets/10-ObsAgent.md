# ObsAgent - Observability Specialist
**Library:** @sentry/nextjs@8.47.0, pino@9.5.0
**Metrics:** Custom performance tracking
**Monitoring:** Error tracking, performance, user analytics

## Sentry Configuration
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies
    }
    return event
  },
})
```

## Structured Logging
```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
  redact: ['req.headers.authorization', 'req.headers.cookie'],
})

// Usage
logger.info({
  action: 'video.generated',
  userId: user.id,
  provider: 'LUMA',
  duration: 5,
  creditsUsed: 10,
}, 'Video generation completed')
```

## Performance Monitoring
```typescript
export function trackVideoGeneration(data: {
  provider: string
  duration: number
  processingTime: number
  success: boolean
}) {
  // Custom metrics
  Sentry.metrics.increment('video.generation.count', 1, {
    tags: {
      provider: data.provider,
      success: data.success.toString(),
    },
  })
  
  Sentry.metrics.distribution(
    'video.generation.processing_time',
    data.processingTime,
    {
      unit: 'millisecond',
      tags: { provider: data.provider },
    }
  )
}
```

## Alerts
- Error rate > 5%
- Response time > 3s
- Queue depth > 1000
- Payment failures spike