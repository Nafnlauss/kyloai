'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PaymentMethodsSimple() {
  const { toast } = useToast()
  
  const handleAddPaymentMethod = () => {
    toast({
      title: 'Coming Soon',
      description: 'Payment method management will be available soon.',
    })
  }
  
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-zinc-500">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">No payment methods on file</p>
          <Button 
            variant="outline" 
            className="border-zinc-700"
            onClick={handleAddPaymentMethod}
          >
            Add Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}