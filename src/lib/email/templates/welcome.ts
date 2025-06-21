import { baseTemplate } from './base-template'

export interface WelcomeEmailData {
  name: string
  email: string
}

export const welcomeTemplate = (data: WelcomeEmailData) => {
  const body = `
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
  `

  return {
    subject: 'Welcome to Kylo! 🎬',
    html: baseTemplate({
      title: 'Welcome to Kylo! 🚀',
      body
    })
  }
}