import { baseTemplate } from './base-template'
import { escapeHtml, sanitizeObject } from '@/lib/utils/sanitize'
import { EMAIL_URLS } from '@/config/urls'

export interface PurchaseConfirmationData {
  customerName: string
  orderId: string
  amount: string
  credits?: number
  planName?: string
  items: Array<{ name: string; price: string }>
}

export const purchaseConfirmationTemplate = (rawData: PurchaseConfirmationData) => {
  // Sanitize all input data to prevent XSS
  const data = sanitizeObject(rawData)
  
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <span>${escapeHtml(item.name)}</span>
      <span>${escapeHtml(item.price)}</span>
    </div>
  `).join('')

  const body = `
    <p>Hi ${escapeHtml(data.customerName)},</p>
    <p>Your order has been confirmed successfully!</p>
    
    <div class="order-details">
      <h2>Order Details #${escapeHtml(data.orderId)}</h2>
      ${itemsHtml}
      <div class="item" style="font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
        <span>Total</span>
        <span>${escapeHtml(data.amount)}</span>
      </div>
    </div>
    
    ${data.credits ? `
      <p><strong>${data.credits.toLocaleString()} credits</strong> have been added to your account!</p>
    ` : ''}
    
    ${data.planName ? `
      <p>Your <strong>${escapeHtml(data.planName)}</strong> plan is now active!</p>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="${EMAIL_URLS.DASHBOARD}" class="button">Access Dashboard</a>
    </div>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
  `

  return {
    subject: `Order Confirmation - Order #${escapeHtml(data.orderId)}`,
    html: baseTemplate({
      title: 'Thank you for your purchase!',
      body
    })
  }
}