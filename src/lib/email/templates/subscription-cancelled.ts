import { baseTemplate } from './base-template'
import { escapeHtml } from '@/lib/utils/sanitize'
import { EMAIL_URLS } from '@/config/urls'

export interface SubscriptionCancelledData {
  email: string
  customerName: string
  planName: string
  creditsRemaining: number
}

export const subscriptionCancelledTemplate = (data: SubscriptionCancelledData) => {
  const body = `
    <p>Hi ${escapeHtml(data.customerName)},</p>
    <p>Your ${escapeHtml(data.planName)} subscription has been cancelled.</p>
    
    <div class="order-details">
      <h2>Important Information</h2>
      <div class="item">
        <span>Credits Remaining</span>
        <span>${data.creditsRemaining.toLocaleString()}</span>
      </div>
    </div>
    
    <p><strong>Good news!</strong> Your ${data.creditsRemaining.toLocaleString()} credits will remain in your account and can still be used to generate videos.</p>
    
    <p><strong>Note:</strong> Without an active subscription, you won't be able to purchase additional credit packs. To buy more credits in the future, you'll need to reactivate a subscription.</p>
    
    <div style="text-align: center;">
      <a href="${EMAIL_URLS.PRICING}" class="button">View Plans</a>
    </div>
    
    <p>We hope to see you back soon!</p>
  `

  return {
    subject: 'Subscription Cancelled',
    html: baseTemplate({
      title: 'Subscription Cancelled',
      body
    })
  }
}