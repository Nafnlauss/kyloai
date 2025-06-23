import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '@/components/admin/overview'
import { RecentSales } from '@/components/admin/recent-sales'
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Video,
  TrendingUp,
  Activity
} from 'lucide-react'
import { getAdminStats } from '@/lib/admin/stats'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Your platform performance at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(stats.totalRevenue / 100).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.revenueGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.userGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Videos Generated
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.videoGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.churnRate}% churn rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue for the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={stats.revenueChart} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest payments from your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={stats.recentSales} />
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Luma V1</span>
                <span className="text-sm font-medium">{stats.apiUsage.LUMA_V1}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Luma V2</span>
                <span className="text-sm font-medium">{stats.apiUsage.LUMA_V2}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Kling V1</span>
                <span className="text-sm font-medium">{stats.apiUsage.KLING_V1}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Kling V2</span>
                <span className="text-sm font-medium">{stats.apiUsage.KLING_V2}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPlans.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <span className="text-sm">{plan.displayName}</span>
                  <span className="text-sm font-medium">{plan.count} users</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Queue Jobs</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.queueHealth.pending} pending
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Jobs</span>
                <span className="text-sm font-medium text-red-600">
                  {stats.queueHealth.failed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Errors</span>
                <span className="text-sm font-medium">
                  {stats.errorRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}