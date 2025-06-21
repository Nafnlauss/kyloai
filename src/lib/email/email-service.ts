// Email service that switches between real and mock implementations
const USE_REAL_EMAIL = process.env.ZOHO_MAIL_USER && process.env.ZOHO_MAIL_PASSWORD;

// Import real email service if credentials are available
let emailService: typeof import('./email-service-impl');

if (USE_REAL_EMAIL) {
  // Dynamically import to avoid build issues when credentials are not available
  emailService = require('./email-service-impl');
} else {
  // Mock implementation for development/testing
  const mockSendEmail = async (config: any) => {
    console.log('Email would be sent:', config);
    return { success: true, messageId: 'mock-' + Date.now() };
  };

  emailService = {
    sendEmail: mockSendEmail,
    sendWelcomeEmail: async (data: any) => mockSendEmail(data),
    sendPurchaseConfirmationEmail: async (data: any) => mockSendEmail(data),
    sendSubscriptionRenewalEmail: async (data: any) => mockSendEmail(data),
    sendSubscriptionCancelledEmail: async (data: any) => mockSendEmail(data),
    sendVideoCompletedEmail: async (data: any) => mockSendEmail(data),
    sendVideoFailedEmail: async (data: any) => mockSendEmail(data),
    sendPasswordResetEmail: async (email: string, token: string) => mockSendEmail({ email, token }),
    sendCreditsLowEmail: async (email: string, credits: number) => mockSendEmail({ email, credits }),
  } as any;
}

// Export all email functions
export const { 
  sendEmail,
  sendWelcomeEmail,
  sendPurchaseConfirmationEmail,
  sendSubscriptionRenewalEmail,
  sendSubscriptionCancelledEmail,
  sendVideoCompletedEmail,
  sendVideoFailedEmail,
  sendPasswordResetEmail,
  sendCreditsLowEmail
} = emailService;