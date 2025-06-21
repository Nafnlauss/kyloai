import nodemailer from 'nodemailer'
import { z } from 'zod'
import { getOptimizedHeaders } from './email-headers'

// Schema para validação de configuração
const zohoConfigSchema = z.object({
  user: z.string().email(),
  pass: z.string().min(1),
  from: z.string().email().optional(),
})

// Configuração do Zoho Mail
export const zohoMailConfig = {
  host: 'smtppro.zoho.com',
  port: 587,
  secure: false, // false para STARTTLS na porta 587
  auth: {
    user: process.env.ZOHO_MAIL_USER || process.env.SMTP_USER || '',
    pass: process.env.ZOHO_MAIL_PASSWORD || process.env.SMTP_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
}

// Criar transportador do Nodemailer
let transporter: nodemailer.Transporter | null = null

export function getMailTransporter() {
  if (!transporter) {
    // Validar configuração
    try {
      zohoConfigSchema.parse(zohoMailConfig.auth)
    } catch (error) {
      console.error('Configuração do Zoho Mail inválida:', error)
      throw new Error('Configuração de email inválida')
    }

    transporter = nodemailer.createTransport(zohoMailConfig)
  }
  
  return transporter
}

// Interface para opções de email
export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content?: Buffer | string
    path?: string
  }>
}

// Função para enviar email
export async function sendEmail(options: EmailOptions) {
  const transporter = getMailTransporter()
  
  const mailOptions = {
    from: options.from || `"Kylo" <noreply@kylo.video>`,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || stripHtml(options.html),
    replyTo: options.replyTo || process.env.SUPPORT_EMAIL || 'support@kylo.video',
    attachments: options.attachments,
    headers: getOptimizedHeaders('kylo.video'),
    encoding: 'utf-8',
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw error
  }
}

// Função auxiliar para remover HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim()
}

// Templates de email pré-definidos
export const emailTemplates = {
  // Purchase confirmation template
  purchaseConfirmation: (data: {
    customerName: string
    orderId: string
    amount: string
    credits?: number
    planName?: string
    items: Array<{ name: string; price: string }>
  }) => ({
    subject: `Order Confirmation - Order #${data.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your purchase!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.customerName},</p>
            <p>Your order has been confirmed successfully!</p>
            
            <div class="order-details">
              <h2>Order Details #${data.orderId}</h2>
              ${data.items.map(item => `
                <div class="item">
                  <span>${item.name}</span>
                  <span>${item.price}</span>
                </div>
              `).join('')}
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
          </div>
          <div class="footer">
            <p>© 2024 Kylo. All rights reserved.</p>
            <p>This is an automated email. For support, please email support@kylo.video</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Welcome email template
  welcome: (data: { name: string; email: string }) => ({
    subject: 'Welcome to Kylo! 🎬',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Kylo! 🚀</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name || 'Creator'},</p>
            <p>We're thrilled to have you with us! You've just taken the first step towards creating amazing AI-powered videos.</p>
            
            <h2>🎁 Your 300 free credits are ready to use!</h2>
            
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
              <a href="https://kylo.video/generate" class="button">Create Your First Video</a>
            </div>
            
            <p>Tip: Start with simple prompts and gradually increase complexity as you learn!</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

// Função para testar conexão
export async function testEmailConnection() {
  try {
    const transporter = getMailTransporter()
    await transporter.verify()
    console.log('Conexão com Zoho Mail estabelecida com sucesso')
    return true
  } catch (error) {
    console.error('Erro ao conectar com Zoho Mail:', error)
    return false
  }
}