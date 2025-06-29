# Dashboard Production Requirements

## Overview

This document outlines the requirements for making the admin dashboard production-ready with real data from APIs.

## Current Status

- ✅ Demo dashboard with mock data is complete
- ✅ All values converted to USD ($)
- ✅ Pricing updated: Plans ($8, $26, $68) and Credit Packs ($8, $18, $45, $90)
- ❌ Integration with real APIs pending

## Required API Integrations

### 1. Stripe API (Financial Data)

**What we can get:**
- ✅ Customers list and details
- ✅ Subscriptions (active, canceled, past_due)
- ✅ Payments and charges history
- ✅ Invoices and receipts
- ✅ Refunds and disputes
- ✅ Balance and payouts
- ✅ Real-time webhooks for updates

**Implementation needed:**
```typescript
// src/lib/services/stripe-service.ts
import Stripe from 'stripe'

export class StripeService {
  private stripe: Stripe
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  
  async getMonthlyRevenue() {
    const charges = await this.stripe.charges.list({
      created: { gte: startOfMonth },
      limit: 100
    })
    // Process and return revenue data
  }
}
```

### 2. Database Integration (Prisma)

**What we can get:**
- ✅ User statistics and activity
- ✅ Video generation history
- ✅ Credit usage tracking
- ✅ API usage logs
- ✅ System alerts and notifications

**Implementation needed:**
```typescript
// Update src/lib/admin/stats.ts
export async function getAdminStats() {
  // Remove isDemoMode() check
  // Use real Prisma queries
  
  const users = await prisma.user.count({
    where: { lastLoginAt: { gte: subDays(new Date(), 30) } }
  })
  
  const videos = await prisma.video.groupBy({
    by: ['provider'],
    _count: true,
    _sum: { creditsUsed: true }
  })
  
  // Return real statistics
}
```

### 3. AI Provider Cost Tracking

**Challenge:** AI APIs don't return cost information

**Solution:** Implement cost tracking system
```typescript
// src/lib/services/cost-tracker.ts
export class CostTracker {
  private costTable = {
    LUMA_V1: 0.0032,    // $0.0032 per credit
    LUMA_V2: 0.0045,    // $0.0045 per credit  
    KLING_V1: 0.004,    // $0.004 per credit
    KLING_V2: 0.006,    // $0.006 per credit
  }
  
  async logApiUsage(videoId: string, provider: string, credits: number) {
    const cost = credits * this.costTable[provider]
    
    await prisma.apiUsageLog.create({
      data: { videoId, provider, credits, costUSD: cost }
    })
  }
}
```

### 4. Real-time Updates

**Requirements:**
- Socket.io for live dashboard updates
- Redis for caching aggregated data
- Webhook handlers for Stripe events

## Database Schema Updates

```prisma
// Add to prisma/schema.prisma

model ApiUsageLog {
  id         String   @id @default(cuid())
  videoId    String
  provider   String
  credits    Int
  costUSD    Float
  timestamp  DateTime @default(now())
  
  video      Video    @relation(fields: [videoId], references: [id])
  
  @@index([timestamp])
  @@index([provider])
}

model DashboardCache {
  id         String   @id
  data       Json
  expiresAt  DateTime
  
  @@index([expiresAt])
}
```

## Environment Variables Needed

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Feature flags
ENABLE_DASHBOARD_CACHE=true
DASHBOARD_CACHE_TTL=300  # 5 minutes
```

## Implementation Steps

### Phase 1: Basic Integration (3-4 days)
1. Create Stripe service class
2. Update stats.ts to use real Prisma queries
3. Remove demo mode checks
4. Test with production database

### Phase 2: Cost Tracking (2-3 days)
1. Create ApiUsageLog table
2. Implement cost tracking service
3. Update video generation to log costs
4. Create cost aggregation queries

### Phase 3: Performance Optimization (2-3 days)
1. Implement Redis caching
2. Create materialized views for complex queries
3. Add database indexes
4. Optimize query performance

### Phase 4: Real-time Features (3-4 days)
1. Implement Stripe webhooks
2. Add Socket.io for live updates
3. Create notification system
4. Test real-time features

## Security Considerations

1. **API Keys**: Store securely in environment variables
2. **Access Control**: Ensure only ADMIN role can access
3. **Rate Limiting**: Implement for dashboard endpoints
4. **Audit Logging**: Log all admin actions
5. **Data Sanitization**: Validate all inputs

## Testing Requirements

1. **Unit Tests**: For all service methods
2. **Integration Tests**: For API endpoints
3. **Load Tests**: Dashboard performance under load
4. **Security Tests**: Permission and access control

## Monitoring

1. **Error Tracking**: Sentry integration
2. **Performance**: Track query times
3. **Uptime**: Monitor API availability
4. **Alerts**: Set up for anomalies

## Total Estimated Time

- **Phase 1**: 3-4 days
- **Phase 2**: 2-3 days  
- **Phase 3**: 2-3 days
- **Phase 4**: 3-4 days
- **Testing**: 2-3 days

**Total**: 12-17 days for complete production implementation

## Conclusion

All data needed for the dashboard is available:
- Financial data: 100% from Stripe API
- User/video data: 100% from our database
- API costs: Must be calculated and stored
- Real-time updates: Achievable with webhooks/Socket.io

The dashboard is ready to be connected to production APIs!