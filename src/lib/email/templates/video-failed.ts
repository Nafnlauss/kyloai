import { baseTemplate } from './base-template'
import { escapeHtml } from '@/lib/utils/sanitize'
import { EMAIL_URLS } from '@/config/urls'

export interface VideoFailedData {
  email: string
  customerName: string
  videoTitle: string
  error: string
  creditsRefunded: boolean
}

export const videoFailedTemplate = (data: VideoFailedData) => {
  const body = `
    <p>Hi ${escapeHtml(data.customerName)},</p>
    <p>Unfortunately, we encountered an issue while generating your video "${escapeHtml(data.videoTitle)}".</p>
    
    <div class="order-details" style="background: #fff3cd; border-left: 4px solid #ffc107;">
      <h3>Error Details</h3>
      <p>${escapeHtml(data.error)}</p>
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
      <a href="${EMAIL_URLS.GENERATE}" class="button">Try Again</a>
    </div>
    
    <p>If the issue persists, please contact our support team.</p>
  `

  return {
    subject: '❌ Video Generation Failed',
    html: baseTemplate({
      title: 'Video Generation Failed',
      body
    })
  }
}