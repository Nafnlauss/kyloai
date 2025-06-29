'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FAQAccordion } from '@/components/ui/faq-accordion'
import { useToast } from '@/hooks/use-toast'
import { 
  Mail, 
  MessageSquare, 
  Send,
  Clock,
  Loader2
} from 'lucide-react'

const faqItems = [
  {
    id: '1',
    question: 'How do I purchase extra credits?',
    answer: 'You can purchase additional credits directly from your dashboard. Navigate to the "Billing" section and choose from our credit packages. Credits are added instantly to your account after payment confirmation.'
  },
  {
    id: '2',
    question: 'Do my credits expire?',
    answer: 'For monthly plans, credits do not accumulate and expire at the end of each billing cycle. However, for annual plans, credits are cumulative and never expire as long as your subscription is active. Purchased credit packages also never expire.'
  },
  {
    id: '3',
    question: 'What video resolutions are supported?',
    answer: 'We support multiple resolutions depending on your plan and the AI model used. Standard quality offers 720p, while premium plans can generate videos in Full HD (1080p) and 4K resolution. The Kling V2.1 model supports up to cinematic 4K quality.'
  },
  {
    id: '4',
    question: 'Can I use the videos for commercial purposes?',
    answer: 'Yes! All paid plans (Lite, Creator, and Professional) allow full commercial use of generated videos without any watermarks. Only the free plan restricts commercial use and includes a watermark.'
  },
  {
    id: '5',
    question: 'How long does video generation take?',
    answer: 'Generation time varies by model and video length. API V1 models typically take 2-3 minutes, while API V2 premium models take 3-5 minutes. Priority queue access (available in Creator and Professional plans) can reduce wait times significantly.'
  },
  {
    id: '6',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processing.'
  },
  {
    id: '7',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of the current billing period, and you\'ll retain access to all features until then.'
  },
  {
    id: '8',
    question: 'Is there an API available for developers?',
    answer: 'Yes! Creator and Professional plans include API access. You can find detailed documentation and your API keys in the dashboard. Our API supports both REST and webhook integrations for seamless automation.'
  }
]

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
          title: 'Message sent!',
          description: 'We will respond as soon as possible.',
        })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not send your message. Please try again.',
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
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help. Send us a message and we'll respond as soon as possible.
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
                <p className="text-muted-foreground mb-2">Technical and sales support</p>
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
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-muted-foreground">Monday to Friday</p>
                <p className="text-muted-foreground">9 AM to 6 PM (GMT-3)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-muted-foreground">We respond within</p>
                <p className="text-primary font-semibold">24 business hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Send Your Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form and we'll get back to you as soon as possible. 
                For urgent support, email us directly at support@kyloai.xyz.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Common Questions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• How do credits work?</li>
                    <li>• Can I cancel my subscription?</li>
                    <li>• Do videos have watermarks?</li>
                    <li>• Can I use for commercial purposes?</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Priority Support</h3>
                  <p className="text-muted-foreground">
                    Creator and Professional plan subscribers have access to priority support 
                    with reduced response time.
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
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
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What would you like to talk about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your question or suggestion..."
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to common questions
            </p>
          </div>
          
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-muted-foreground mb-8">
            Check our documentation and tutorials for quick answers
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <a href="/docs">Documentation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/tutorials">Tutorials</a>
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