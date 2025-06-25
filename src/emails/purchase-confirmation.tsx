import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PurchaseConfirmationEmailProps {
  userName: string
  planName: string
  amount: number
  invoiceUrl?: string
  credits?: number
}

export const PurchaseConfirmationEmail = ({
  userName,
  planName,
  amount,
  invoiceUrl,
  credits,
}: PurchaseConfirmationEmailProps) => {
  const previewText = `Payment confirmation for ${planName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
            width="150"
            height="50"
            alt="KyloAI"
            style={logo}
          />
          
          <Heading style={h1}>Payment Confirmed! 🎉</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            Thank you for your purchase! Your payment has been successfully processed.
          </Text>
          
          <Section style={orderDetails}>
            <Heading as="h2" style={h2}>
              Order Details
            </Heading>
            
            <Text style={detailRow}>
              <strong>Plan:</strong> {planName}
            </Text>
            
            <Text style={detailRow}>
              <strong>Amount:</strong> R$ {(amount / 100).toFixed(2)}
            </Text>
            
            {credits && (
              <Text style={detailRow}>
                <strong>Credits Added:</strong> {credits}
              </Text>
            )}
          </Section>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
            >
              Go to Dashboard
            </Button>
          </Section>
          
          {invoiceUrl && (
            <Text style={paragraph}>
              <Link href={invoiceUrl} style={link}>
                Download Invoice
              </Link>
            </Text>
          )}
          
          <Hr style={hr} />
          
          <Text style={footer}>
            If you have any questions, please don't hesitate to contact our support team.
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0',
}

const paragraph = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
}

const orderDetails = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailRow = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#8B5CF6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
}

const link = {
  color: '#8B5CF6',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '16px 0',
}