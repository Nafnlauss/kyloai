'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
  created: number
}

// Component for the payment form inside the modal
function PaymentMethodForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess: () => void
  onCancel: () => void 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Confirm the setup
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message || 'An error occurred')
        return
      }

      if (setupIntent?.payment_method) {
        // Add the payment method to our backend
        const response = await fetch('/api/user/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: setupIntent.payment_method,
            setAsDefault: false,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save payment method')
        }

        toast({
          title: 'Success',
          description: 'Payment method added successfully',
        })
        
        onSuccess()
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-zinc-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isLoading}
          className="bg-[#A259FF] hover:bg-[#9148e0]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Add Payment Method'
          )}
        </Button>
      </div>
    </form>
  )
}

// Card brand icons mapping
const cardBrandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  diners: '💳',
  jcb: '💳',
  unionpay: '💳',
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/user/payment-methods')
      if (!response.ok) throw new Error('Failed to fetch payment methods')
      
      const data = await response.json()
      setPaymentMethods(data.paymentMethods || [])
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Temporarily disabled until Stripe is fully configured
    // fetchPaymentMethods()
    setIsLoading(false)
  }, [])

  // Create setup intent when modal opens
  useEffect(() => {
    if (showAddModal && !clientSecret) {
      fetch('/api/user/payment-methods/setup-intent', {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret)
          }
        })
        .catch(err => {
          console.error('Error creating setup intent:', err)
          toast({
            title: 'Error',
            description: 'Failed to initialize payment form',
            variant: 'destructive',
          })
          setShowAddModal(false)
        })
    }
  }, [showAddModal, clientSecret, toast])

  // Handle delete payment method
  const handleDelete = async (methodId: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${methodId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove payment method')

      toast({
        title: 'Success',
        description: 'Payment method removed',
      })

      // Refresh the list
      fetchPaymentMethods()
    } catch (error) {
      console.error('Error removing payment method:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove payment method',
        variant: 'destructive',
      })
    } finally {
      setDeleteMethodId(null)
    }
  }

  // Handle set as default
  const handleSetDefault = async (methodId: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${methodId}`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to update default payment method')

      toast({
        title: 'Success',
        description: 'Default payment method updated',
      })

      // Refresh the list
      fetchPaymentMethods()
    } catch (error) {
      console.error('Error updating default payment method:', error)
      toast({
        title: 'Error',
        description: 'Failed to update default payment method',
        variant: 'destructive',
      })
    }
  }

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">No payment methods on file</p>
              <Button 
                variant="outline" 
                className="border-zinc-700"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {cardBrandIcons[method.brand] || '💳'}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {formatCardBrand(method.brand)} •••• {method.last4}
                        {method.isDefault && (
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                            Default
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetDefault(method.id)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteMethodId(method.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4 border-zinc-700"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Method Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new card for subscriptions and purchases
            </DialogDescription>
          </DialogHeader>
          
          {clientSecret ? (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#A259FF',
                    colorBackground: '#18181b',
                    colorSurface: '#27272a',
                    colorText: '#ffffff',
                    colorTextSecondary: '#a1a1aa',
                    colorDanger: '#ef4444',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <PaymentMethodForm
                onSuccess={() => {
                  setShowAddModal(false)
                  setClientSecret(null)
                  fetchPaymentMethods()
                }}
                onCancel={() => {
                  setShowAddModal(false)
                  setClientSecret(null)
                }}
              />
            </Elements>
          ) : (
            <div className="py-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              <p className="text-sm text-zinc-500 mt-2">Loading payment form...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMethodId} onOpenChange={() => setDeleteMethodId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMethodId && handleDelete(deleteMethodId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}