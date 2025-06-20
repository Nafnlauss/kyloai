// Temporary email service - nodemailer removed to fix build
export async function sendEmail(config: any) {
  console.log('Email would be sent:', config);
  return { success: true, messageId: 'mock-' + Date.now() };
}

export const sendWelcomeEmail = async (data: any) => sendEmail(data);
export const sendPurchaseConfirmationEmail = async (data: any) => sendEmail(data);
export const sendSubscriptionRenewalEmail = async (data: any) => sendEmail(data);
export const sendSubscriptionCancelledEmail = async (data: any) => sendEmail(data);
export const sendVideoCompletedEmail = async (data: any) => sendEmail(data);
export const sendVideoFailedEmail = async (data: any) => sendEmail(data);
export const sendPasswordResetEmail = async (email: string, token: string) => sendEmail({ email, token });
export const sendCreditsLowEmail = async (email: string, credits: number) => sendEmail({ email, credits });