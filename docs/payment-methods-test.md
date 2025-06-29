# Payment Methods Test Guide

## Setup Requirements

1. **Environment Variables**
   - Ensure `STRIPE_SECRET_KEY` is set in `.env.local`
   - Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
   - These can be obtained from your Stripe Dashboard

2. **Stripe Test Cards**
   Use these test card numbers for testing:
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0025 0000 3155`
   - Declined: `4000 0000 0000 9995`

## Testing Steps

### 1. View Payment Methods
1. Navigate to `/settings`
2. Click on the "Billing" tab
3. You should see the "Payment Methods" section

### 2. Add Payment Method
1. Click "Add Payment Method" button
2. A modal should appear with Stripe's payment form
3. Enter test card details:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any valid ZIP code
4. Click "Add Payment Method"
5. The modal should close and the new card should appear in the list

### 3. Set Default Payment Method
1. With multiple payment methods, click "Set Default" on a non-default card
2. The card should be marked as default
3. Previous default should no longer show the badge

### 4. Remove Payment Method
1. Click the trash icon on a payment method
2. Confirm in the dialog
3. The payment method should be removed from the list

## API Endpoints

- `GET /api/user/payment-methods` - List all payment methods
- `POST /api/user/payment-methods` - Add new payment method
- `DELETE /api/user/payment-methods/[id]` - Remove payment method
- `PATCH /api/user/payment-methods/[id]` - Set as default
- `POST /api/user/payment-methods/setup-intent` - Create setup intent

## Security Features

1. **PCI Compliance**: Card details are never stored on our servers
2. **Stripe Integration**: All sensitive payment data is handled by Stripe
3. **Audit Logging**: All payment method actions are logged
4. **Authentication**: All endpoints require user authentication
5. **Customer Verification**: Payment methods can only be managed by the owner

## Common Issues

1. **"Failed to load payment methods"**
   - Check if Stripe API keys are configured
   - Verify user has a valid session

2. **"Failed to initialize payment form"**
   - Ensure publishable key is set correctly
   - Check browser console for Stripe.js errors

3. **Card declined errors**
   - Use valid test card numbers
   - Check Stripe dashboard for detailed error logs