import { baseTemplate } from './base-template'
import { EMAIL_URLS } from '@/config/urls'

export interface CreditsLowData {
  email: string
  credits: number
}

export const creditsLowTemplate = (data: CreditsLowData) => {
  const body = `
    <p>Hi,</p>
    <p>This is a friendly reminder that your credit balance is running low.</p>
    
    <div class="order-details" style="background: #fff3cd; border-left: 4px solid #ffc107;">
      <h3>Current Balance</h3>
      <p style="font-size: 24px; font-weight: bold; color: #ffc107; margin: 10px 0;">
        ${data.credits} credits remaining
      </p>
    </div>
    
    <p>Don't let your creativity stop! Purchase more credits to continue generating amazing videos.</p>
    
    <div style="text-align: center;">
      <a href="${EMAIL_URLS.CREDITS}" class="button">Buy More Credits</a>
    </div>
    
    <p>Remember: You need an active subscription to purchase credit packs.</p>
  `

  return {
    subject: '⚠️ Low Credit Balance',
    html: baseTemplate({
      title: 'Credits Running Low',
      body
    })
  }
}