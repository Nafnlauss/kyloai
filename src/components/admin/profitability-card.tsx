'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calculator,
  ChartBar
} from 'lucide-react'
import { formatCurrency, calculateProfitMargin } from '@/lib/admin/calculations'

interface ProfitabilityCardProps {
  revenue: number
  costs: number
  previousRevenue?: number
  previousCosts?: number
  period?: string
}

export function ProfitabilityCard({
  revenue,
  costs,
  previousRevenue = 0,
  previousCosts = 0,
  period = 'This Month'
}: ProfitabilityCardProps) {
  const profit = revenue - costs
  const previousProfit = previousRevenue - previousCosts
  const profitMargin = calculateProfitMargin(revenue, costs)
  const previousProfitMargin = calculateProfitMargin(previousRevenue, previousCosts)
  
  const profitGrowth = previousProfit > 0 
    ? ((profit - previousProfit) / previousProfit) * 100 
    : 0
    
  const marginChange = profitMargin - previousProfitMargin
  const isPositiveGrowth = profitGrowth >= 0
  const isPositiveMarginChange = marginChange >= 0
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Profitability Analysis</CardTitle>
            <CardDescription>{period}</CardDescription>
          </div>
          <ChartBar className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Revenue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Revenue</span>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(revenue)}
            </div>
            {previousRevenue > 0 && (
              <div className="flex items-center gap-1 text-sm">
                {revenue >= previousRevenue ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={revenue >= previousRevenue ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(((revenue - previousRevenue) / previousRevenue) * 100).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
          
          {/* Costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Costs</span>
              <Calculator className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(costs)}
            </div>
            {previousCosts > 0 && (
              <div className="flex items-center gap-1 text-sm">
                {costs <= previousCosts ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
                <span className={costs <= previousCosts ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(((costs - previousCosts) / previousCosts) * 100).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            )}
          </div>
          
          {/* Profit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Net Profit</span>
              <Badge variant={profit >= 0 ? 'success' : 'destructive'}>
                {profit >= 0 ? 'Profitable' : 'Loss'}
              </Badge>
            </div>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            {previousProfit !== 0 && (
              <div className="flex items-center gap-1 text-sm">
                {isPositiveGrowth ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={isPositiveGrowth ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(profitGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">growth</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Profit Margin */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Profit Margin</p>
              <p className="text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
            </div>
            {previousProfitMargin > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {isPositiveMarginChange ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${isPositiveMarginChange ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveMarginChange ? '+' : ''}{marginChange.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">vs last period</p>
              </div>
            )}
          </div>
          <Progress value={profitMargin} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>Target: 30%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Breakdown */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Cost Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Costs</span>
              <span className="font-medium">{formatCurrency(costs * 0.6)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Infrastructure</span>
              <span className="font-medium">{formatCurrency(costs * 0.25)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Other Operational</span>
              <span className="font-medium">{formatCurrency(costs * 0.15)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}