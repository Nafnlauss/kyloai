import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { 
  PurchaseConfirmationEmail,
  WelcomeEmail,
  PasswordResetEmail,
  SubscriptionRenewalEmail,
  CreditsLowEmail,
  VideoCompletedEmail
} from '@/emails'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_FROM}>`,
      ...options,
    })
    
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

// Email templates
export async function sendWelcomeEmail(user: {
  email: string
  name: string
}) {
  const html = render(WelcomeEmail({ userName: user.name }))
  
  return sendEmail({
    to: user.email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
    html,
  })
}

export async function sendPurchaseConfirmationEmail(data: {
  email: string
  name: string
  plan: string
  amount: number
  invoiceUrl?: string
  credits?: number
}) {
  const html = render(PurchaseConfirmationEmail({
    userName: data.name,
    planName: data.plan,
    amount: data.amount,
    invoiceUrl: data.invoiceUrl,
    credits: data.credits,
  }))
  
  return sendEmail({
    to: data.email,
    subject: 'Payment Confirmation - Thank you for your purchase!',
    html,
  })
}

export async function sendPasswordResetEmail(data: {
  email: string
  name: string
  resetUrl: string
}) {
  const html = render(PasswordResetEmail({
    userName: data.name,
    resetUrl: data.resetUrl,
  }))
  
  return sendEmail({
    to: data.email,
    subject: 'Reset your password',
    html,
  })
}

export async function sendSubscriptionRenewalEmail(data: {
  email: string
  name: string
  plan: string
  nextBillingDate: Date
  amount: number
}) {
  const html = render(SubscriptionRenewalEmail({
    userName: data.name,
    planName: data.plan,
    nextBillingDate: data.nextBillingDate,
    amount: data.amount,
  }))
  
  return sendEmail({
    to: data.email,
    subject: 'Subscription Renewal Reminder',
    html,
  })
}

export async function sendCreditsLowEmail(data: {
  email: string
  name: string
  remainingCredits: number
}) {
  const html = render(CreditsLowEmail({
    userName: data.name,
    remainingCredits: data.remainingCredits,
  }))
  
  return sendEmail({
    to: data.email,
    subject: 'Your credits are running low',
    html,
  })
}

export async function sendVideoCompletedEmail(data: {
  email: string
  name: string
  videoUrl: string
  videoId: string
}) {
  const html = render(VideoCompletedEmail({
    userName: data.name,
    videoUrl: data.videoUrl,
    videoId: data.videoId,
  }))
  
  return sendEmail({
    to: data.email,
    subject: 'Your video is ready!',
    html,
  })
}