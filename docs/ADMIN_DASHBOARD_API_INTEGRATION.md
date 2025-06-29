# Admin Dashboard API Integration Guide

## Overview

This document explains how to integrate real APIs into the admin dashboard to replace mock data with production data.

## API Capabilities

### ✅ Stripe API - Complete Financial Data

The Stripe API provides comprehensive access to all financial data needed for the dashboard:

```typescript
// Available data from Stripe API:
- Customers (stripe.customers.list())
- Subscriptions (stripe.subscriptions.list())
- Payments/Charges (stripe.charges.list())
- Invoices (stripe.invoices.list())
- Balance Transactions (stripe.balanceTransactions.list())
- Refunds (stripe.refunds.list())
- Payment Methods (stripe.paymentMethods.list())
```

### 📊 AI Provider APIs - Usage Tracking

Each AI provider offers different levels of usage tracking:

#### Luma Labs
```typescript
// Can track:
- Job creation and status
- Video generation requests
- Error rates
// Cannot track directly:
- Costs (must calculate based on pricing table)
```

#### Kling AI
```typescript
// Can track:
- Task history
- Video generation status
- Usage statistics
// Cannot track directly:
- Per-request costs
```

#### Other Providers (BFL, ElevenLabs, PiAPI, Newport)
- Similar usage tracking capabilities
- No direct cost information in API responses

## Implementation Strategy

### 1. Create Stripe Service

```typescript
// src/lib/services/stripe-admin.service.ts
import Stripe from 'stripe'

export class StripeAdminService {
  private stripe: Stripe
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-11-20.acacia'
    })
  }

  async getRevenueMetics(startDate: Date, endDate: Date) {
    // Get all charges in date range
    const charges = await this.stripe.charges.list({
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lte: Math.floor(endDate.getTime() / 1000)
      },
      limit: 100
    })
    
    // Calculate metrics
    const totalRevenue = charges.data
      .filter(c => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0)
    
    return {
      totalRevenue,
      transactionCount: charges.data.length,
      averageTransaction: totalRevenue / charges.data.length
    }
  }

  async getSubscriptionMetrics() {
    const subscriptions = await this.stripe.subscriptions.list({
      status: 'active',
      limit: 100
    })
    
    const mrr = subscriptions.data.reduce((sum, sub) => {
      return sum + (sub.items.data[0].price.unit_amount || 0)
    }, 0)
    
    return {
      activeSubscriptions: subscriptions.data.length,
      monthlyRecurringRevenue: mrr
    }
  }
}
```

### 2. Create Cost Tracking Service

```typescript
// src/lib/services/api-cost-tracker.service.ts
export class ApiCostTracker {
  // Define cost tables based on provider pricing
  private readonly COST_TABLE = {
    LUMA_V1: 0.0032,   // $0.0032 per credit
    LUMA_V2: 0.0045,   // $0.0045 per credit
    KLING_V1: 0.004,   // $0.004 per credit
    KLING_V2: 0.006,   // $0.006 per credit
    BFL_FLUX: 0.003,   // $0.003 per image
    ELEVENLABS: 0.001, // $0.001 per character
  }
  
  calculateCost(provider: string, usage: number): number {
    return usage * (this.COST_TABLE[provider] || 0)
  }
  
  async trackApiUsage(videoId: string, provider: string, credits: number) {
    const cost = this.calculateCost(provider, credits)
    
    // Store in database
    await prisma.apiUsageLog.create({
      data: {
        videoId,
        provider,
        credits,
        costUSD: cost,
        timestamp: new Date()
      }
    })
  }
}
```

### 3. Create Admin Stats Aggregator

```typescript
// src/lib/services/admin-stats.service.ts
export class AdminStatsService {
  private stripe: StripeAdminService
  private costTracker: ApiCostTracker
  
  async getDashboardStats() {
    // Get revenue from Stripe
    const stripeMetrics = await this.stripe.getRevenueMetics(
      startOfMonth(new Date()),
      new Date()
    )
    
    // Get costs from database
    const apiCosts = await prisma.apiUsageLog.aggregate({
      _sum: { costUSD: true },
      where: {
        timestamp: {
          gte: startOfMonth(new Date())
        }
      }
    })
    
    // Get user metrics from database
    const userStats = await prisma.user.aggregate({
      _count: true,
      where: {
        lastLoginAt: {
          gte: subDays(new Date(), 30)
        }
      }
    })
    
    return {
      revenue: stripeMetrics.totalRevenue / 100, // Convert cents to dollars
      costs: apiCosts._sum.costUSD || 0,
      profit: (stripeMetrics.totalRevenue / 100) - (apiCosts._sum.costUSD || 0),
      activeUsers: userStats._count,
      profitMargin: calculateProfitMargin(
        stripeMetrics.totalRevenue / 100,
        apiCosts._sum.costUSD || 0
      )
    }
  }
}
```

### 4. Update Admin Overview Page

```typescript
// src/app/admin/overview/page.tsx
import { AdminStatsService } from '@/lib/services/admin-stats.service'

export default async function AdminOverviewPage() {
  const statsService = new AdminStatsService()
  const stats = await statsService.getDashboardStats()
  
  return (
    <div>
      {/* Use real stats instead of mock data */}
      <StatsCards stats={stats} />
    </div>
  )
}
```

## Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Stripe    │────>│ Admin Stats  │<────│  Database   │
│     API     │     │   Service    │     │ (Prisma)    │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │    Admin     │
                    │  Dashboard   │
                    └──────────────┘
```

## Missing Data Solutions

### 1. API Provider Costs
Since AI providers don't return costs in their APIs, we must:
- Maintain a cost table based on their pricing pages
- Update costs periodically as pricing changes
- Store calculated costs in our database

### 2. Real-time Metrics
For real-time updates:
- Use webhooks from Stripe for payment events
- Implement Socket.io for live dashboard updates
- Cache aggregated data with Redis

### 3. Historical Data
For historical analytics:
- Store all API usage in database
- Create aggregation jobs for performance
- Use materialized views for complex queries

## Security Considerations

1. **API Keys**: Store all API keys securely in environment variables
2. **Rate Limiting**: Implement rate limiting for admin endpoints
3. **Access Control**: Ensure only ADMIN role can access dashboard
4. **Audit Logging**: Log all admin actions for security

## Implementation Timeline

1. **Phase 1**: Stripe Integration (1-2 days)
   - Payment data
   - Subscription metrics
   - Revenue tracking

2. **Phase 2**: Cost Tracking (2-3 days)
   - API usage logging
   - Cost calculation
   - Profit margins

3. **Phase 3**: Real-time Updates (2-3 days)
   - Webhook handlers
   - Socket.io integration
   - Live dashboard

4. **Phase 4**: Advanced Analytics (3-4 days)
   - Historical trends
   - Predictive analytics
   - Custom reports

## Conclusion

All the data needed for the admin dashboard is available through the APIs:
- **Financial data**: 100% available via Stripe API
- **User data**: 100% available in our database
- **API usage**: Must be tracked internally
- **Costs**: Must be calculated based on pricing tables

The dashboard is fully feasible with real production data!