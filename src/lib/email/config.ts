import { z } from 'zod'

// Email configuration schema
const emailConfigSchema = z.object({
  provider: z.enum(['zoho', 'sendgrid', 'mailgun', 'ses', 'smtp']).default('smtp'),
  smtp: z.object({
    host: z.string(),
    port: z.number(),
    secure: z.boolean(),
    auth: z.object({
      user: z.string().email(),
      pass: z.string().min(1),
    }),
    tls: z.object({
      rejectUnauthorized: z.boolean().default(true),
      minVersion: z.enum(['TLSv1.2', 'TLSv1.3']).default('TLSv1.2'),
    }).optional(),
  }).optional(),
  from: z.object({
    name: z.string().default('Kylo'),
    email: z.string().email().default('noreply@kylo.video'),
  }),
  replyTo: z.string().email().optional(),
  supportEmail: z.string().email().default('support@kylo.video'),
  maxRetries: z.number().min(0).max(5).default(3),
  retryDelay: z.number().min(1000).default(5000), // milliseconds
  timeout: z.number().min(5000).default(30000), // milliseconds
})

export type EmailConfig = z.infer<typeof emailConfigSchema>

// Load configuration from environment
export function loadEmailConfig(): EmailConfig | null {
  try {
    const config: EmailConfig = {
      provider: (process.env.EMAIL_PROVIDER as any) || 'smtp',
      smtp: {
        host: process.env.SMTP_HOST || 'smtppro.zoho.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.ZOHO_MAIL_USER || process.env.SMTP_USER || '',
          pass: process.env.ZOHO_MAIL_PASSWORD || process.env.SMTP_PASSWORD || '',
        },
        tls: {
          rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
          minVersion: 'TLSv1.2',
        },
      },
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Kylo',
        email: process.env.EMAIL_FROM_ADDRESS || 'noreply@kylo.video',
      },
      replyTo: process.env.EMAIL_REPLY_TO,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@kylo.video',
      maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES || '3'),
      retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY || '5000'),
      timeout: parseInt(process.env.EMAIL_TIMEOUT || '30000'),
    }

    // Validate configuration
    return emailConfigSchema.parse(config)
  } catch (error) {
    console.error('Invalid email configuration:', error)
    return null
  }
}

// Check if email is configured
export function isEmailConfigured(): boolean {
  const config = loadEmailConfig()
  if (!config) return false
  
  // Check if we have valid SMTP credentials
  if (config.provider === 'smtp' && config.smtp) {
    return !!(config.smtp.auth.user && config.smtp.auth.pass)
  }
  
  // Add checks for other providers when implemented
  return false
}

// Email rate limiting configuration
export const EMAIL_RATE_LIMITS = {
  // Max emails per minute per recipient
  perMinute: parseInt(process.env.EMAIL_RATE_LIMIT_PER_MINUTE || '5'),
  // Max emails per hour per recipient
  perHour: parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR || '20'),
  // Max emails per day per recipient
  perDay: parseInt(process.env.EMAIL_RATE_LIMIT_PER_DAY || '50'),
}

// Email queue configuration
export const EMAIL_QUEUE_CONFIG = {
  // Queue name
  name: 'email-queue',
  // Max concurrent jobs
  concurrency: parseInt(process.env.EMAIL_QUEUE_CONCURRENCY || '5'),
  // Job timeout
  timeout: parseInt(process.env.EMAIL_QUEUE_TIMEOUT || '60000'), // 1 minute
  // Remove completed jobs after
  removeOnComplete: parseInt(process.env.EMAIL_QUEUE_REMOVE_COMPLETED || '100'),
  // Remove failed jobs after
  removeOnFail: parseInt(process.env.EMAIL_QUEUE_REMOVE_FAILED || '500'),
}