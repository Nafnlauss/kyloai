import { ReferralDashboard } from '@/components/referral/referral-dashboard'

export const metadata = {
  title: 'Referral Program - Kylo AI',
  description: 'Earn 5% lifetime commission by referring new users to Kylo AI'
}

export default function ReferralsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
        <p className="text-muted-foreground mt-2">
          Earn 5% lifetime commission on all purchases made by users you refer
        </p>
      </div>
      
      <ReferralDashboard />
    </div>
  )
}