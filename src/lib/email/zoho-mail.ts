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

// Import all email templates
import * as templates from './templates'

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