import { Card, CardContent } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 21, 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using Kylo's services ("Service"), you agree to be bound by these 
                  Terms of Service. If you do not agree to these terms, do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
                <p className="text-muted-foreground">
                  Kylo provides an AI-powered video generation platform. 
                  Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Video generation from text prompts</li>
                  <li>Access to different AI models (Luma Dream Machine, Kling AI)</li>
                  <li>Credit system for service usage</li>
                  <li>Temporary storage of generated videos</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Eligibility Requirements</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You must be at least 18 years old</li>
                  <li>Must provide accurate and complete information when creating an account</li>
                  <li>Are responsible for maintaining your account security</li>
                  <li>Must immediately notify us of unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                
                <h3 className="text-xl font-semibold mb-2">4.1 Prohibited Content</h3>
                <p className="text-muted-foreground mb-2">You may not use our services to generate:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Illegal content or content that promotes illegal activities</li>
                  <li>Material that infringes copyrights or intellectual property</li>
                  <li>Defamatory, discriminatory, or hate content</li>
                  <li>Explicit, pornographic, or sexually suggestive material</li>
                  <li>Malicious deepfakes or misleading content</li>
                  <li>Content that violates third-party privacy</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Usage Restrictions</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>No reverse engineering or attempting to extract source code</li>
                  <li>No unauthorized bots or automation</li>
                  <li>No reselling or redistributing the services</li>
                  <li>No overloading or harming the infrastructure</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Credits System and Payments</h2>
                
                <h3 className="text-xl font-semibold mb-2">5.1 Credits</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>New users receive 300 free credits</li>
                  <li>Credits are consumed based on model and video duration</li>
                  <li>Monthly subscription credits do not accumulate</li>
                  <li>Yearly subscription credits are cumulative</li>
                  <li>Purchased credits do not expire</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Subscriptions</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Automatic monthly or annual renewal</li>
                  <li>Cancellation can be done at any time</li>
                  <li>No refunds for partial periods</li>
                  <li>Price changes will be notified 30 days in advance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                
                <h3 className="text-xl font-semibold mb-2">6.1 Generated Content</h3>
                <p className="text-muted-foreground">
                  You retain all rights to videos you generate, subject to the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Free Plan: Personal use only, no commercial use</li>
                  <li>Paid Plans: Commercial use permitted</li>
                  <li>You are responsible for the content you create</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">6.2 License to Kylo</h3>
                <p className="text-muted-foreground">
                  You grant Kylo a limited license to store and process your content 
                  solely to provide the services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Disclaimers</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Services provided "as is" without warranties</li>
                  <li>We do not guarantee specific AI results</li>
                  <li>We are not responsible for user-generated content</li>
                  <li>AI results may contain inaccuracies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Under no circumstances will Kylo be liable for indirect, incidental, 
                  special, or consequential damages. Our total liability is limited to the amount paid 
                  by you in the last 12 months.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold Kylo harmless from any claims resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Your use of the services</li>
                  <li>Violation of these terms</li>
                  <li>Violation of third-party rights</li>
                  <li>Content you generate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <p className="text-muted-foreground">
                  We may suspend or terminate your account for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Violation of these terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees due</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  You may cancel your account at any time through settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Modifications to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms. Significant changes will be 
                  notified 30 days in advance. Continued use constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms are governed by the laws of Brazil. Any disputes will be resolved 
                  in the competent courts of Brazil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms:
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