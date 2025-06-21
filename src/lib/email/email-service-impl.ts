import { EmailSender } from './email-sender'
import * as templates from './templates'

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

export async function sendSubscriptionCancelledEmail(data: templates.SubscriptionCancelledData) {
  const template = templates.subscriptionCancelledTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
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

export async function sendVideoFailedEmail(data: templates.VideoFailedData) {
  const template = templates.videoFailedTemplate(data)
  return EmailSender.sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html
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
  const template = templates.creditsLowTemplate({ email, credits })
  return EmailSender.sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  })
}

// Re-export the base sendEmail function for custom emails
export const sendEmail = EmailSender.sendEmail.bind(EmailSender)