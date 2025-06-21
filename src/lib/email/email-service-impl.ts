import { EmailSender } from './email-sender'
import * as templates from './templates'
import { baseTemplate } from './templates/base-template'

// Email sending functions using external templates
export async function sendWelcomeEmail(data: templates.WelcomeEmailData) {
  const template = templates.welcomeTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  })
}

export async function sendPurchaseConfirmationEmail(data: templates.PurchaseConfirmationData & { email: string }) {
  const template = templates.purchaseConfirmationTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  })
}

export async function sendSubscriptionRenewalEmail(data: templates.SubscriptionRenewalData & { email: string }) {
  const template = templates.subscriptionRenewalTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  })
}

export async function sendSubscriptionCancelledEmail(data: {
  email: string
  customerName: string
  planName: string
  creditsRemaining: number
}) {
  const body = `
    <p>Hi ${data.customerName},</p>
    <p>Your ${data.planName} subscription has been cancelled.</p>
    
    <div class="order-details">
      <h2>Important Information</h2>
      <div class="item">
        <span>Credits Remaining</span>
        <span>${data.creditsRemaining.toLocaleString()}</span>
      </div>
    </div>
    
    <p><strong>Good news!</strong> Your ${data.creditsRemaining} credits will remain in your account and can still be used to generate videos.</p>
    
    <p><strong>Note:</strong> Without an active subscription, you won't be able to purchase additional credit packs. To buy more credits in the future, you'll need to reactivate a subscription.</p>
    
    <div style="text-align: center;">
      <a href="https://kylo.video/pricing" class="button">View Plans</a>
    </div>
    
    <p>We hope to see you back soon!</p>
  `

  return EmailSender.sendEmail({
    to: data.email,
    subject: 'Subscription Cancelled',
    html: baseTemplate({
      title: 'Subscription Cancelled',
      body
    })
  })
}

export async function sendVideoCompletedEmail(data: templates.VideoCompletedData & { email: string }) {
  const template = templates.videoCompletedTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
  })
}

export async function sendVideoFailedEmail(data: {
  email: string
  customerName: string
  videoTitle: string
  error: string
  creditsRefunded: boolean
}) {
  const body = `
    <p>Hi ${data.customerName},</p>
    <p>Unfortunately, we encountered an issue while generating your video "${data.videoTitle}".</p>
    
    <div class="order-details" style="background: #fff3cd; border-left: 4px solid #ffc107;">
      <h3>Error Details</h3>
      <p>${data.error}</p>
    </div>
    
    ${data.creditsRefunded ? `
      <p><strong>✅ Your credits have been refunded</strong> and are available for your next video generation.</p>
    ` : ''}
    
    <p>Here are some tips that might help:</p>
    <ul>
      <li>Try simplifying your prompt</li>
      <li>Ensure your prompt doesn't contain restricted content</li>
      <li>Try using a different AI model</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://kylo.video/generate" class="button">Try Again</a>
    </div>
    
    <p>If the issue persists, please contact our support team.</p>
  `

  return EmailSender.sendEmail({
    to: data.email,
    subject: '❌ Video Generation Failed',
    html: baseTemplate({
      title: 'Video Generation Failed',
      body
    })
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const template = templates.passwordResetTemplate({
    email,
    resetToken: token,
    expiresIn: '1 hour'
  })
  
  return EmailSender.sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  })
}

export async function sendCreditsLowEmail(email: string, credits: number) {
  const body = `
    <p>Hi,</p>
    <p>This is a friendly reminder that your credit balance is running low.</p>
    
    <div class="order-details" style="background: #fff3cd; border-left: 4px solid #ffc107;">
      <h3>Current Balance</h3>
      <p style="font-size: 24px; font-weight: bold; color: #ffc107; margin: 10px 0;">
        ${credits} credits remaining
      </p>
    </div>
    
    <p>Don't let your creativity stop! Purchase more credits to continue generating amazing videos.</p>
    
    <div style="text-align: center;">
      <a href="https://kylo.video/dashboard/credits" class="button">Buy More Credits</a>
    </div>
    
    <p>Remember: You need an active subscription to purchase credit packs.</p>
  `

  return EmailSender.sendEmail({
    to: email,
    subject: '⚠️ Low Credit Balance',
    html: baseTemplate({
      title: 'Credits Running Low',
      body
    })
  })
}

// Re-export the base sendEmail function for custom emails
export const sendEmail = EmailSender.sendEmail.bind(EmailSender)