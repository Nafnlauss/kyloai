import nodemailer from 'nodemailer'
import { render } from '@react-email/render'

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Base email sending function
export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: from || 'KyloAI <noreply@kyloai.com>',
      to,
      subject,
      html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

// Welcome email
export async function sendWelcomeEmail(data: {
  email: string
  name: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! 🎉</h1>
      <p>Hi ${data.name},</p>
      <p>We're excited to have you on board! You can now start creating amazing AI-powered videos.</p>
      <p>As a welcome gift, we've added <strong>10 free credits</strong> to your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Creating
        </a>
      </div>
      <p>Need help getting started? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/guide">quick start guide</a>.</p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! 🎉`,
    html,
  })
}

// Purchase confirmation email
export async function sendPurchaseConfirmationEmail(data: {
  email: string
  name: string
  plan: string
  amount: number
  invoiceUrl?: string
  credits?: number
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Payment Confirmation 🎯</h1>
      <p>Hi ${data.name},</p>
      <p>Thank you for your purchase! Your payment has been successfully processed.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details:</h3>
        <p><strong>Plan:</strong> ${data.plan}</p>
        <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
        ${data.credits ? `<p><strong>Credits:</strong> ${data.credits}</p>` : ''}
      </div>
      
      ${data.invoiceUrl ? `
        <p>
          <a href="${data.invoiceUrl}" style="color: #8B5CF6;">Download Invoice</a>
        </p>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        If you have any questions about your purchase, please contact our support team.
      </p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'Payment Confirmation - ' + data.plan,
    html,
  })
}

// Subscription renewal email
export async function sendSubscriptionRenewalEmail(data: {
  email: string
  name: string
  plan: string
  amount: number
  nextBillingDate: Date
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Subscription Renewed ✅</h1>
      <p>Hi ${data.name},</p>
      <p>Your ${data.plan} subscription has been successfully renewed.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Plan:</strong> ${data.plan}</p>
        <p><strong>Amount:</strong> $${(data.amount / 100).toFixed(2)}</p>
        <p><strong>Next billing date:</strong> ${data.nextBillingDate.toLocaleDateString()}</p>
      </div>
      
      <p>Your credits have been refreshed for the new billing period.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Manage Subscription
        </a>
      </div>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'Subscription Renewed - ' + data.plan,
    html,
  })
}

// Subscription cancelled email
export async function sendSubscriptionCancelledEmail(data: {
  email: string
  name: string
  plan: string
  endDate: Date
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Subscription Cancelled</h1>
      <p>Hi ${data.name},</p>
      <p>Your ${data.plan} subscription has been cancelled.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>You'll continue to have access to your plan benefits until <strong>${data.endDate.toLocaleDateString()}</strong>.</p>
        <p>After this date, your account will revert to the free plan.</p>
      </div>
      
      <p>We're sorry to see you go! If you change your mind, you can reactivate your subscription at any time.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Plans
        </a>
      </div>
      
      <p>If you have any feedback about why you're cancelling, we'd love to hear from you.</p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'Subscription Cancelled',
    html,
  })
}

// Video completion email
export async function sendVideoCompletedEmail(data: {
  email: string
  name: string
  videoUrl: string
  thumbnailUrl?: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Your Video is Ready! 🎬</h1>
      <p>Hi ${data.name},</p>
      <p>Great news! Your video has been successfully generated and is ready to view.</p>
      
      ${data.thumbnailUrl ? `
        <div style="margin: 20px 0; text-align: center;">
          <img src="${data.thumbnailUrl}" alt="Video thumbnail" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>
      ` : ''}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.videoUrl}" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Watch Your Video
        </a>
      </div>
      
      <p>You can also view and manage all your videos in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/gallery">dashboard</a>.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Thank you for using ${process.env.NEXT_PUBLIC_APP_NAME}!
      </p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'Your video is ready! 🎬',
    html,
  })
}

// Video failed email
export async function sendVideoFailedEmail(data: {
  email: string
  name: string
  reason: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Video Generation Failed</h1>
      <p>Hi ${data.name},</p>
      <p>Unfortunately, we encountered an issue while generating your video.</p>
      
      <div style="background-color: #FEE2E2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #991B1B;"><strong>Error:</strong> ${data.reason}</p>
      </div>
      
      <p>Your credits have been automatically refunded. You can try generating the video again from your dashboard.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/create" 
           style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Try Again
        </a>
      </div>
      
      <p>If you continue to experience issues, please contact our support team.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        Need help? Reply to this email or visit our support center.
      </p>
    </div>
  `

  return sendEmail({
    to: data.email,
    subject: 'Video generation failed',
    html,
  })
}

// Add more email functions as needed