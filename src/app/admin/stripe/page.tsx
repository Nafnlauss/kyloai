import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StripeStats } from '@/components/admin/stripe-stats'
import { PaymentsTable } from '@/components/admin/payments-table'

export const dynamic = 'force-dynamic'

export default function AdminStripePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stripe Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time payment analytics and revenue tracking
        </p>
      </div>

      {/* Stripe Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
          <CardDescription>
            Track your revenue, MRR, and payment trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StripeStats />
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            View all payment transactions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsTable />
        </CardContent>
      </Card>
    </div>
  )
}