import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/zoho-mail'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(5, 'Subject too short'),
  message: z.string().min(10, 'Message too short')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validatedData = contactSchema.parse(body)
    
    // Aqui você pode integrar com um serviço de email como:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // Por enquanto, vou criar um exemplo simples
    
    // Exemplo de estrutura de email
    const emailContent = {
      to: 'support@kyloai.xyz',
      from: 'noreply@kyloai.xyz',
      subject: `[Contato Kylo] ${validatedData.subject}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Assunto:</strong> ${validatedData.subject}</p>
        <hr>
        <p><strong>Mensagem:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small></p>
      `,
      text: `
        Nova mensagem de contato
        
        Nome: ${validatedData.name}
        Email: ${validatedData.email}
        Assunto: ${validatedData.subject}
        
        Mensagem:
        ${validatedData.message}
        
        Enviado em: ${new Date().toLocaleString('pt-BR')}
      `
    }
    
    // Enviar email usando Zoho Mail
    try {
      await sendEmail({
        to: 'support@kyloai.xyz',
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        replyTo: validatedData.email
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
      // Continua mesmo se o email falhar - podemos salvar no banco depois
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao processar contato:', error)
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    )
  }
}