# Stripe Payment Methods Setup Guide

## Configuration Steps

### 1. Stripe Dashboard Setup

1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Use test mode for development

2. **Get API Keys**
   - Navigate to Developers → API keys
   - Copy your test keys:
     - Secret key (starts with `sk_test_`)
     - Publishable key (starts with `pk_test_`)

3. **Configure Customer Portal** (Optional but recommended)
   - Go to Settings → Billing → Customer portal
   - Enable the customer portal
   - Configure which features customers can access

### 2. Environment Variables

Add these to your `.env.local`:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_LITE_MONTHLY=price_xxx
STRIPE_PRICE_LITE_YEARLY=price_xxx
STRIPE_PRICE_CREATOR_MONTHLY=price_xxx
STRIPE_PRICE_CREATOR_YEARLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_YEARLY=price_xxx
```

### 3. Database Setup

The User model already includes `stripeCustomerId` field, so no migration needed.

### 4. Testing Payment Methods

1. **Start Development Server**
   ```bash
   cd ai-video-hub
   pnpm dev
   ```

2. **Navigate to Settings**
   - Go to `/settings`
   - Click on "Billing" tab

3. **Add Test Card**
   - Click "Add Payment Method"
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC and ZIP

### 5. Webhook Configuration (Production)

For production, configure webhooks:

1. **Create Webhook Endpoint**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `payment_method.attached`
     - `payment_method.detached`

2. **Get Webhook Secret**
   - Copy the signing secret (starts with `whsec_`)
   - Add to `STRIPE_WEBHOOK_SECRET` env var

## Features Implemented

### Payment Methods Management
- ✅ List saved payment methods
- ✅ Add new payment methods (PCI compliant)
- ✅ Remove payment methods
- ✅ Set default payment method
- ✅ Show card brand and last 4 digits
- ✅ Show expiration date

### Security Features
- ✅ No card details stored in database
- ✅ Stripe handles all sensitive data
- ✅ Audit logging for all actions
- ✅ Authentication required
- ✅ Customer isolation (can only see own methods)

### UI Features
- ✅ Dark theme Stripe Elements
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Confirmation dialogs

## Next Steps

1. **Subscription Management**
   - Use saved payment methods for subscriptions
   - Handle subscription updates/cancellations

2. **One-time Payments**
   - Use saved payment methods for credit purchases
   - Quick checkout experience

3. **Regional Payment Methods**
   - Add support for regional payment methods
   - PIX for Brazil (via Asaas integration)
   - SEPA for Europe

## Troubleshooting

### Common Issues

1. **"Missing STRIPE_SECRET_KEY environment variable"**
   - Add Stripe keys to `.env.local`
   - Restart development server

2. **Payment form not loading**
   - Check browser console for errors
   - Verify publishable key is correct
   - Ensure you're using HTTPS in production

3. **"Failed to attach payment method"**
   - Verify Stripe customer exists
   - Check Stripe logs in dashboard
   - Ensure payment method ID is valid

### Debug Tips

1. **Check Stripe Logs**
   - Go to Developers → Logs in Stripe Dashboard
   - Filter by API requests to see errors

2. **Test Different Cards**
   - Success: `4242 4242 4242 4242`
   - Requires auth: `4000 0025 0000 3155`
   - Declined: `4000 0000 0000 9995`

3. **Verify Database**
   - Check if user has `stripeCustomerId`
   - Run: `pnpm prisma studio` to inspect data