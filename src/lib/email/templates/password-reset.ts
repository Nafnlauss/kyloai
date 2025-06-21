import { baseTemplate } from './base-template'

export interface PasswordResetData {
  email: string
  resetToken: string
  expiresIn: string
}

export const passwordResetTemplate = (data: PasswordResetData) => {
  const resetUrl = `https://kylo.video/reset-password?token=${data.resetToken}`
  
  const body = `
    <p>Hi,</p>
    <p>We received a request to reset the password for your account associated with ${data.email}.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    
    <p><strong>This link will expire in ${data.expiresIn}.</strong></p>
    
    <p>If you didn't request this password reset, please ignore this email. Your password won't be changed.</p>
    
    <p style="color: #666; font-size: 14px;">
      For security reasons, if you didn't make this request, we recommend you:
      <ul style="color: #666; font-size: 14px;">
        <li>Check your account for any suspicious activity</li>
        <li>Enable two-factor authentication if available</li>
        <li>Contact our support team if you have concerns</li>
      </ul>
    </p>
  `

  return {
    subject: 'Password Reset Request - Kylo',
    html: baseTemplate({
      title: 'Password Reset Request',
      body
    })
  }
}