'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  Mail, 
  MessageSquare, 
  Send,
  Clock,
  MapPin,
  Phone,
  Loader2
} from 'lucide-react'

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: 'Mensagem enviada!',
          description: 'Responderemos o mais breve possível.',
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Falha ao enviar mensagem')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aqui para ajudar. Envie sua mensagem e responderemos o mais breve possível.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-2">Suporte técnico e comercial</p>
                <a 
                  href="mailto:support@kyloai.xyz" 
                  className="text-primary hover:underline"
                >
                  support@kyloai.xyz
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Horário de Atendimento</h3>
                <p className="text-muted-foreground">Segunda a Sexta</p>
                <p className="text-muted-foreground">9h às 18h (Horário de Brasília)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Resposta Rápida</h3>
                <p className="text-muted-foreground">Respondemos em até</p>
                <p className="text-primary font-semibold">24 horas úteis</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Envie sua Mensagem</h2>
              <p className="text-muted-foreground mb-8">
                Preencha o formulário ao lado e entraremos em contato o mais breve possível. 
                Para suporte urgente, envie um email diretamente para support@kyloai.xyz.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Dúvidas Frequentes</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Como funcionam os créditos?</li>
                    <li>• Posso cancelar minha assinatura?</li>
                    <li>• Os vídeos têm marca d'água?</li>
                    <li>• Posso usar para fins comerciais?</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Suporte Prioritário</h3>
                  <p className="text-muted-foreground">
                    Assinantes dos planos Creator e Professional têm acesso a suporte prioritário 
                    com tempo de resposta reduzido.
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulário de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Sobre o que deseja falar?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva sua dúvida ou sugestão..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de Ajuda Imediata?
          </h2>
          <p className="text-muted-foreground mb-8">
            Confira nossa documentação e tutoriais para respostas rápidas
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/docs">Documentação</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/tutorials">Tutoriais</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/faq">FAQ</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}