// Email service with type-safe mock implementation
import type * as EmailServiceImpl from './email-service-impl'

type EmailService = typeof EmailServiceImpl
type EmailOptions = Parameters<EmailService['sendEmail']>[0]

// Mock implementation for development/testing
const createMockEmailService = (): EmailService => {
  const mockSendEmail = async (config: EmailOptions) => {
    console.log('Email would be sent:', config)
    return { success: true, messageId: 'mock-' + Date.now() }
  }

  return {
    sendEmail: mockSendEmail,
    sendWelcomeEmail: async (data: Parameters<EmailService['sendWelcomeEmail']>[0]) => {
      console.log('Welcome email would be sent:', data)
      return mockSendEmail({ to: data.email, subject: 'Welcome', html: '' })
    },
    sendPurchaseConfirmationEmail: async (data: Parameters<EmailService['sendPurchaseConfirmationEmail']>[0]) => {
      console.log('Purchase confirmation would be sent:', data)
      return mockSendEmail({ to: data.email, subject: 'Purchase Confirmation', html: '' })
    },
    sendSubscriptionRenewalEmail: async (data: Parameters<EmailService['sendSubscriptionRenewalEmail']>[0]) => {
      console.log('Subscription renewal would be sent:', data)
      return mockSendEmail({ to: data.email, subject: 'Subscription Renewed', html: '' })
    },
    sendSubscriptionCancelledEmail: async (data: Parameters<EmailService['sendSubscriptionCancelledEmail']>[0]) => {
      console.log('Subscription cancelled email would be sent:', data)
      return mockSendEmail({ to: data.email, subject: 'Subscription Cancelled', html: '' })
    },
    sendPasswordResetEmail: async (email: string, token: string) => {
      console.log('Password reset email would be sent:', { email, token })
      return mockSendEmail({ to: email, subject: 'Password Reset', html: '' })
    },
    sendCreditsLowEmail: async (email: string, credits: number) => {
      console.log('Credits low email would be sent:', { email, credits })
      return mockSendEmail({ to: email, subject: 'Low Credits', html: '' })
    },
  }
}

// Check if email is configured
const USE_REAL_EMAIL = !!(process.env.ZOHO_MAIL_USER && process.env.ZOHO_MAIL_PASSWORD)

// Create appropriate service
let emailService: EmailService

async function initializeEmailService() {
  if (USE_REAL_EMAIL) {
    try {
      emailService = await import('./email-service-impl')
    } catch (error) {
      console.error('Failed to load email service implementation:', error)
      emailService = createMockEmailService()
    }
  } else {
    emailService = createMockEmailService()
  }
}

// Initialize on first use
const ensureInitialized = async () => {
  if (!emailService) {
    await initializeEmailService()
  }
}

// Export wrapper functions that ensure initialization
export const sendEmail: EmailService['sendEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendEmail(...args)
}

export const sendWelcomeEmail: EmailService['sendWelcomeEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendWelcomeEmail(...args)
}

export const sendPurchaseConfirmationEmail: EmailService['sendPurchaseConfirmationEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendPurchaseConfirmationEmail(...args)
}

export const sendSubscriptionRenewalEmail: EmailService['sendSubscriptionRenewalEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendSubscriptionRenewalEmail(...args)
}

export const sendSubscriptionCancelledEmail: EmailService['sendSubscriptionCancelledEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendSubscriptionCancelledEmail(...args)
}

export const sendPasswordResetEmail: EmailService['sendPasswordResetEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendPasswordResetEmail(...args)
}

export const sendCreditsLowEmail: EmailService['sendCreditsLowEmail'] = async (...args) => {
  await ensureInitialized()
  return emailService.sendCreditsLowEmail(...args)
}