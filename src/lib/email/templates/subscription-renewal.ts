import { baseTemplate } from './base-template'
import { escapeHtml } from '@/lib/utils/sanitize'
import { EMAIL_URLS } from '@/config/urls'

export interface SubscriptionRenewalData {
  customerName: string
  planName: string
  amount: string
  credits: number
  isAccumulative: boolean
  nextRenewalDate: string
}

export const subscriptionRenewalTemplate = (data: SubscriptionRenewalData) => {
  const body = `
    <p>Hi ${escapeHtml(data.customerName)},</p>
    <p>Your <strong>${escapeHtml(data.planName)}</strong> subscription has been renewed successfully!</p>
    
    <div class="order-details">
      <h2>Renewal Details</h2>
      <div class="item">
        <span>Plan</span>
        <span>${escapeHtml(data.planName)}</span>
      </div>
      <div class="item">
        <span>Amount</span>
        <span>${escapeHtml(data.amount)}</span>
      </div>
      <div class="item">
        <span>Credits Added</span>
        <span>${data.credits.toLocaleString()}</span>
      </div>
      <div class="item">
        <span>Next Renewal</span>
        <span>${escapeHtml(data.nextRenewalDate)}</span>
      </div>
    </div>
    
    ${data.isAccumulative ? 
      '<p><strong>✨ Good news!</strong> Your annual plan credits accumulate over time, so any unused credits will carry forward!</p>' :
      '<p><strong>Note:</strong> With your monthly plan, credits are refreshed each month. Any unused credits from the previous month have been replaced with your new monthly allocation.</p>'
    }
    
    <div style="text-align: center;">
      <a href="${EMAIL_URLS.DASHBOARD}" class="button">View Dashboard</a>
    </div>
    
    <p>Thank you for continuing your creative journey with Kylo!</p>
  `

  return {
    subject: `Subscription Renewed - ${escapeHtml(data.planName)}`,
    html: baseTemplate({
      title: 'Subscription Renewed Successfully!',
      body
    })
  }
}