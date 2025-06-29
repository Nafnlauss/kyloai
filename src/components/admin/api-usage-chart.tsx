'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts'
import { Activity } from 'lucide-react'

interface ApiUsageData {
  date: string
  LUMA_V1: number
  LUMA_V2: number
  KLING_V1: number
  KLING_V2: number
}

interface ApiUsageChartProps {
  data: ApiUsageData[]
  showCosts?: boolean
}

const COLORS = {
  LUMA_V1: '#8b5cf6',
  LUMA_V2: '#6366f1',
  KLING_V1: '#06b6d4',
  KLING_V2: '#10b981',
}

export function ApiUsageChart({ data, showCosts = false }: ApiUsageChartProps) {
  // Transform data to include total
  const transformedData = data.map(item => ({
    ...item,
    total: item.LUMA_V1 + item.LUMA_V2 + item.KLING_V1 + item.KLING_V2,
    // Add cost data if needed
    ...(showCosts && {
      cost: (item.LUMA_V1 * 0.003 + item.LUMA_V2 * 0.005 + 
             item.KLING_V1 * 0.004 + item.KLING_V2 * 0.008) * 6, // Credits per request * cost per credit
    }),
  }))

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'cost') {
      return [`R$ ${value.toFixed(2)}`, 'Cost']
    }
    return [`${value} requests`, name]
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Usage Trends</CardTitle>
            <CardDescription>
              Daily request volume by provider
            </CardDescription>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', { 
                  day: '2-digit',
                  month: 'short' 
                })
              }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            {showCosts && (
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
            )}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={formatTooltipValue}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            
            {/* Stacked bars for each provider */}
            <Bar 
              yAxisId="left"
              dataKey="LUMA_V1" 
              stackId="a" 
              fill={COLORS.LUMA_V1}
              name="Luma V1"
            />
            <Bar 
              yAxisId="left"
              dataKey="LUMA_V2" 
              stackId="a" 
              fill={COLORS.LUMA_V2}
              name="Luma V2"
            />
            <Bar 
              yAxisId="left"
              dataKey="KLING_V1" 
              stackId="a" 
              fill={COLORS.KLING_V1}
              name="Kling V1"
            />
            <Bar 
              yAxisId="left"
              dataKey="KLING_V2" 
              stackId="a" 
              fill={COLORS.KLING_V2}
              name="Kling V2"
            />
            
            {/* Total line */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="total" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Total"
              dot={false}
            />
            
            {/* Cost area if enabled */}
            {showCosts && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cost"
                fill="#ef4444"
                fillOpacity={0.1}
                stroke="#ef4444"
                strokeWidth={2}
                name="Cost"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Most Used</p>
            <p className="text-xl font-semibold text-green-600">Luma V2</p>
            <p className="text-xs text-muted-foreground">45% of requests</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Avg Daily</p>
            <p className="text-xl font-semibold">2.4K</p>
            <p className="text-xs text-muted-foreground">requests</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Peak Day</p>
            <p className="text-xl font-semibold">4.8K</p>
            <p className="text-xs text-muted-foreground">Last Tuesday</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
            <p className="text-xl font-semibold text-green-600">97.2%</p>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}