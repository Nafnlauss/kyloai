import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface SubscriptionRenewalEmailProps {
  userName: string
  planName: string
  nextBillingDate: Date
  amount: number
}

export const SubscriptionRenewalEmail = ({
  userName,
  planName,
  nextBillingDate,
  amount,
}: SubscriptionRenewalEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your subscription will renew soon</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
            width="150"
            height="50"
            alt="KyloAI"
            style={logo}
          />
          
          <Heading style={h1}>Subscription Renewal Notice</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            Your {planName} subscription will automatically renew on{' '}
            {nextBillingDate.toLocaleDateString('pt-BR')} for R$ {(amount / 100).toFixed(2)}.
          </Text>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`}
            >
              Manage Subscription
            </Button>
          </Section>
          
          <Text style={paragraph}>
            If you wish to cancel or modify your subscription, you can do so at any time
            from your billing settings.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
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

const paragraph = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
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