import nodemailer from 'nodemailer'
import { loadEmailConfig, isEmailConfigured } from './config'
import type { EmailOptions } from './zoho-mail'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Email sending queue to prevent overwhelming the server
const emailQueue: Array<() => Promise<void>> = []
let isProcessing = false

export class EmailSender {
  private static transporter: nodemailer.Transporter | null = null
  private static config = loadEmailConfig()

  /**
   * Initialize the email transporter
   */
  private static async initTransporter() {
    if (this.transporter || !this.config) return

    try {
      if (this.config.provider === 'smtp' && this.config.smtp) {
        this.transporter = nodemailer.createTransport({
          host: this.config.smtp.host,
          port: this.config.smtp.port,
          secure: this.config.smtp.secure,
          auth: this.config.smtp.auth,
          tls: this.config.smtp.tls,
        })

        // Verify connection
        await this.transporter.verify()
        console.log('Email transporter initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize email transporter:', error)
      this.transporter = null
      throw error
    }
  }

  /**
   * Check rate limits for an email address
   */
  private static checkRateLimit(email: string): boolean {
    const now = Date.now()
    const key = email.toLowerCase()
    const limit = rateLimitMap.get(key)

    if (!limit || now > limit.resetAt) {
      // Reset rate limit
      rateLimitMap.set(key, {
        count: 1,
        resetAt: now + 60000, // 1 minute window
      })
      return true
    }

    if (limit.count >= 5) {
      // Rate limit exceeded
      return false
    }

    limit.count++
    return true
  }

  /**
   * Send email with retry logic
   */
  public static async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Check if email is configured
    if (!isEmailConfigured()) {
      console.log('Email not configured, skipping send')
      return { success: false, error: 'Email service not configured' }
    }

    // Check rate limit
    const recipient = Array.isArray(options.to) ? options.to[0] : options.to
    if (!this.checkRateLimit(recipient)) {
      return { success: false, error: 'Rate limit exceeded. Please try again later.' }
    }

    // Add to queue
    return new Promise((resolve) => {
      emailQueue.push(async () => {
        try {
          await this.sendEmailWithRetry(options)
          resolve({ success: true })
        } catch (error) {
          console.error('Failed to send email after retries:', error)
          resolve({ success: false, error: error instanceof Error ? error.message : 'Failed to send email' })
        }
      })

      // Process queue
      this.processQueue()
    })
  }

  /**
   * Send email with retry logic
   */
  private static async sendEmailWithRetry(options: EmailOptions, attempt = 1): Promise<void> {
    if (!this.config) throw new Error('Email configuration not loaded')

    try {
      // Initialize transporter if needed
      if (!this.transporter) {
        await this.initTransporter()
      }

      if (!this.transporter) {
        throw new Error('Email transporter not available')
      }

      // Prepare email options
      const mailOptions = {
        from: `"${this.config.from.name}" <${this.config.from.email}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        replyTo: options.replyTo || this.config.replyTo || this.config.supportEmail,
        attachments: options.attachments,
      }

      // Send email with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout')), this.config.timeout)
      })

      const sendPromise = this.transporter.sendMail(mailOptions)
      
      await Promise.race([sendPromise, timeoutPromise])
      console.log(`Email sent successfully to ${mailOptions.to}`)
      
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed:`, error)
      
      // Retry logic
      if (attempt < this.config.maxRetries) {
        const delay = this.config.retryDelay * attempt
        console.log(`Retrying email send in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.sendEmailWithRetry(options, attempt + 1)
      }
      
      throw error
    }
  }

  /**
   * Process email queue
   */
  private static async processQueue() {
    if (isProcessing || emailQueue.length === 0) return

    isProcessing = true
    
    while (emailQueue.length > 0) {
      const task = emailQueue.shift()
      if (task) {
        try {
          await task()
        } catch (error) {
          console.error('Error processing email task:', error)
        }
        
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    isProcessing = false
  }

  /**
   * Strip HTML tags from content
   */
  private static stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove tags
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim()
  }

  /**
   * Test email connection
   */
  public static async testConnection(): Promise<boolean> {
    try {
      await this.initTransporter()
      return this.transporter !== null
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }

  /**
   * Close transporter connection
   */
  public static async close() {
    if (this.transporter) {
      await this.transporter.close()
      this.transporter = null
    }
  }
}