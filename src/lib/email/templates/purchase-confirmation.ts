import { baseTemplate } from './base-template'

export interface PurchaseConfirmationData {
  customerName: string
  orderId: string
  amount: string
  credits?: number
  planName?: string
  items: Array<{ name: string; price: string }>
}

export const purchaseConfirmationTemplate = (data: PurchaseConfirmationData) => {
  const itemsHtml = data.items.map(item => `
    <div class="item">
      <span>${item.name}</span>
      <span>${item.price}</span>
    </div>
  `).join('')

  const body = `
    <p>Hi ${data.customerName},</p>
    <p>Your order has been confirmed successfully!</p>
    
    <div class="order-details">
      <h2>Order Details #${data.orderId}</h2>
      ${itemsHtml}
      <div class="item" style="font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
        <span>Total</span>
        <span>${data.amount}</span>
      </div>
    </div>
    
    ${data.credits ? `
      <p><strong>${data.credits.toLocaleString()} credits</strong> have been added to your account!</p>
    ` : ''}
    
    ${data.planName ? `
      <p>Your <strong>${data.planName}</strong> plan is now active!</p>
    ` : ''}
    
    <div style="text-align: center;">
      <a href="https://kylo.video/dashboard" class="button">Access Dashboard</a>
    </div>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
  `

  return {
    subject: `Order Confirmation - Order #${data.orderId}`,
    html: baseTemplate({
      title: 'Thank you for your purchase!',
      body
    })
  }
}