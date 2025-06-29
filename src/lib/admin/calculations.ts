import { PRICING_CONFIG } from '@/config/pricing'

// Calculate profit margin percentage
export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue <= 0) return 0
  return ((revenue - cost) / revenue) * 100
}

// Calculate growth percentage
export function calculateGrowth(current: number, previous: number): number {
  if (previous <= 0) return 0
  return ((current - previous) / previous) * 100
}

// Format currency in USD
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

// Format large numbers with abbreviations
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Calculate credit price based on plan
export function calculateCreditPrice(planId: string): number {
  const plan = Object.values(PRICING_CONFIG.plans).find(p => p.id === planId)
  if (!plan || plan.monthlyPrice === 0) return 0
  
  return plan.monthlyPrice / plan.monthlyCredits / 100 // Price per credit in USD
}

// Calculate estimated revenue from credits
export function calculateRevenueFromCredits(credits: number, averagePlanId: string = 'CREATOR'): number {
  const creditPrice = calculateCreditPrice(averagePlanId)
  return credits * creditPrice
}

// API cost estimates (mock values for demo)
export const API_COST_PER_CREDIT = {
  LUMA_V1: 0.003,
  LUMA_V2: 0.005,
  KLING_V1: 0.004,
  KLING_V2: 0.008,
}

// Calculate API cost
export function calculateApiCost(provider: string, credits: number): number {
  const costPerCredit = API_COST_PER_CREDIT[provider as keyof typeof API_COST_PER_CREDIT] || 0.005
  return credits * costPerCredit
}

// Calculate churn rate
export function calculateChurnRate(
  previousMonthSubscribers: number,
  currentMonthSubscribers: number,
  newSubscribers: number
): number {
  if (previousMonthSubscribers === 0) return 0
  
  const churned = previousMonthSubscribers + newSubscribers - currentMonthSubscribers
  return (churned / previousMonthSubscribers) * 100
}

// Calculate average revenue per user (ARPU)
export function calculateARPU(totalRevenue: number, totalUsers: number): number {
  if (totalUsers === 0) return 0
  return totalRevenue / totalUsers
}

// Calculate lifetime value (LTV) - simplified
export function calculateLTV(arpu: number, averageMonthsRetained: number = 6): number {
  return arpu * averageMonthsRetained
}

// Get plan distribution
export function getPlanDistribution(users: any[]): Record<string, number> {
  const distribution: Record<string, number> = {
    FREE: 0,
    LITE: 0,
    CREATOR: 0,
    PROFESSIONAL: 0,
  }
  
  users.forEach(user => {
    const planId = user.subscription?.planId || 'FREE'
    if (planId in distribution) {
      distribution[planId]++
    }
  })
  
  return distribution
}

// Calculate provider usage distribution
export function getProviderDistribution(apiLogs: any[]): Record<string, number> {
  const distribution: Record<string, number> = {
    LUMA_V1: 0,
    LUMA_V2: 0,
    KLING_V1: 0,
    KLING_V2: 0,
  }
  
  const total = apiLogs.length
  
  apiLogs.forEach(log => {
    if (log.apiName in distribution) {
      distribution[log.apiName]++
    }
  })
  
  // Convert to percentages
  Object.keys(distribution).forEach(key => {
    distribution[key] = total > 0 ? (distribution[key] / total) * 100 : 0
  })
  
  return distribution
}

// Calculate time-based metrics
export function getTimeBasedMetrics(data: any[], dateField: string = 'createdAt') {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastMonth = new Date(today)
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  
  return {
    today: data.filter(item => new Date(item[dateField]) >= today).length,
    yesterday: data.filter(item => {
      const date = new Date(item[dateField])
      return date >= yesterday && date < today
    }).length,
    lastWeek: data.filter(item => new Date(item[dateField]) >= lastWeek).length,
    lastMonth: data.filter(item => new Date(item[dateField]) >= lastMonth).length,
  }
}

// Calculate conversion rate
export function calculateConversionRate(visitors: number, conversions: number): number {
  if (visitors === 0) return 0
  return (conversions / visitors) * 100
}

// Get top performing content (by revenue)
export function getTopPerformingUsers(users: any[], transactions: any[], limit: number = 10) {
  const userRevenue = new Map<string, number>()
  
  // Calculate revenue per user
  transactions
    .filter(t => t.status === 'COMPLETED')
    .forEach(t => {
      const current = userRevenue.get(t.userId) || 0
      userRevenue.set(t.userId, current + t.amount)
    })
  
  // Sort and get top users
  const sortedUsers = Array.from(userRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
  
  return sortedUsers.map(([userId, revenue]) => {
    const user = users.find(u => u.id === userId)
    return {
      id: userId,
      name: user?.name || 'Unknown',
      email: user?.email || 'unknown@email.com',
      revenue: revenue / 100, // Convert to USD
    }
  })
}

// Calculate retention rate
export function calculateRetentionRate(
  totalUsers: number,
  activeUsers: number
): number {
  if (totalUsers === 0) return 0
  return (activeUsers / totalUsers) * 100
}

// Get alert severity color
export function getAlertSeverityColor(severity: string): string {
  const colors = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50',
  }
  return colors[severity as keyof typeof colors] || colors.medium
}

// Format uptime percentage
export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(2)}%`
}

// Format latency
export function formatLatency(latency: number): string {
  if (latency < 1000) {
    return `${latency}ms`
  }
  return `${(latency / 1000).toFixed(2)}s`
}

// Get status color
export function getStatusColor(status: string): string {
  const colors = {
    operational: 'text-green-600 bg-green-50',
    degraded: 'text-yellow-600 bg-yellow-50',
    down: 'text-red-600 bg-red-50',
  }
  return colors[status as keyof typeof colors] || colors.operational
}

// Calculate daily average
export function calculateDailyAverage(total: number, days: number): number {
  if (days === 0) return 0
  return total / days
}

// Get trend direction
export function getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
  const threshold = 0.01 // 1% threshold for stability
  const change = calculateGrowth(current, previous) / 100
  
  if (Math.abs(change) < threshold) return 'stable'
  return change > 0 ? 'up' : 'down'
}

// Calculate success rate
export function calculateSuccessRate(successful: number, total: number): number {
  if (total === 0) return 0
  return (successful / total) * 100
}