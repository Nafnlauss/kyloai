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

interface CreditsLowEmailProps {
  userName: string
  remainingCredits: number
}

export const CreditsLowEmail = ({
  userName,
  remainingCredits,
}: CreditsLowEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your credits are running low</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
            width="150"
            height="50"
            alt="KyloAI"
            style={logo}
          />
          
          <Heading style={h1}>Credits Running Low ⚠️</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            You only have <strong>{remainingCredits} credits</strong> remaining in your account.
            Don't let your creativity stop!
          </Text>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`}
            >
              Get More Credits
            </Button>
          </Section>
          
          <Text style={paragraph}>
            Upgrade your plan or purchase additional credits to continue creating amazing videos.
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