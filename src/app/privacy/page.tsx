import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 21, 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Kylo ("we", "our" or "company") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose and protect 
                  your information when you use our AI video generation service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name and email address when creating an account</li>
                  <li>Payment information (securely processed via Stripe/PayPal)</li>
                  <li>Text prompts and video generation preferences</li>
                  <li>Customer support communications</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>IP address and device information</li>
                  <li>Platform usage data and analytics</li>
                  <li>Cookies and similar technologies</li>
                  <li>Server logs and technical information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-2">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide and improve our video generation services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Communicate about your account and service updates</li>
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Analyze usage and improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                <p className="text-muted-foreground mb-2">We share information only with:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Service Providers:</strong> Stripe, PayPal (payments), Luma AI, Kling AI (video generation)</li>
                  <li><strong>Legal Compliance:</strong> When required by law or court order</li>
                  <li><strong>Rights Protection:</strong> To protect rights, property or safety</li>
                  <li><strong>With Your Consent:</strong> With your explicit authorization</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Strict access controls</li>
                  <li>Regular security monitoring</li>
                  <li>Periodic security audits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR/LGPD)</h2>
                <p className="text-muted-foreground mb-2">Under data protection laws, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your personal data</li>
                  <li>Correct incomplete or outdated data</li>
                  <li>Request deletion of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                  <li>Object to processing</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  To exercise your rights, contact: support@kyloai.xyz
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground">
                  We use essential cookies for functionality and analytics cookies to improve our services. 
                  You can manage your cookie preferences in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your data for as long as necessary to provide our services and comply with legal obligations. 
                  Generated videos are stored for 30 days after creation unless you delete them earlier.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children</h2>
                <p className="text-muted-foreground">
                  Our services are not directed to individuals under 18 years old. We do not knowingly collect 
                  information from minors without parental consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this policy periodically. We will notify you of significant changes 
                  by email or notice on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                <p className="text-muted-foreground">
                  For privacy questions, contact us:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-2">
                  <li>Email: support@kyloai.xyz</li>
                  <li>Website: kylo.video</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}