import { baseTemplate } from './base-template'
import { escapeHtml } from '@/lib/utils/sanitize'
import { EMAIL_URLS } from '@/config/urls'

export interface WelcomeEmailData {
  name: string
  email: string
  verificationUrl?: string
}

export const welcomeTemplate = (data: WelcomeEmailData) => {
  const body = `
    <p>Hi ${escapeHtml(data.name || 'Creator')},</p>
    <p>We're thrilled to have you with us! You've just taken the first step towards creating amazing AI-powered videos.</p>
    
    ${data.verificationUrl ? `
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="color: #d97706; margin: 0 0 10px 0;">⚠️ Please verify your email</h3>
      <p style="margin: 0 0 15px 0;">To start using your account, please click the button below to verify your email address:</p>
      <div style="text-align: center;">
        <a href="${data.verificationUrl}" class="button" style="background-color: #f59e0b; color: white;">Verify Email</a>
      </div>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">This link will expire in 24 hours.</p>
    </div>
    ` : ''}
    
    <h2>🎁 Congratulations! You've received 300 free credits!</h2>
    <p style="color: #9333ea; font-size: 18px; font-weight: bold;">These credits are already in your account and ready to use!</p>
    
    <div class="feature">
      <h3>✨ What you can do:</h3>
      <ul>
        <li>Generate videos up to 15 seconds</li>
        <li>Choose between different AI models</li>
        <li>Download HD videos without watermark</li>
        <li>Experience all platform features</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="${EMAIL_URLS.GENERATE}" class="button">Create Your First Video</a>
    </div>
    
    <p>Tip: Start with simple prompts and gradually increase complexity as you learn!</p>
  `

  return {
    subject: 'Welcome to Kylo! 🎬',
    html: baseTemplate({
      title: 'Welcome to Kylo! 🚀',
      body
    })
  }
}