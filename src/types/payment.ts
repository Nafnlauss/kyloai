export interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
  created: number
}

export interface SetupIntentResponse {
  clientSecret: string
  customerId: string
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
  defaultPaymentMethodId: string | null
}