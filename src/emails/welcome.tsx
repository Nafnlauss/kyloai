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

interface WelcomeEmailProps {
  userName: string
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
  const previewText = 'Welcome to KyloAI - Start creating amazing videos!'

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
          
          <Heading style={h1}>Welcome to KyloAI! 🚀</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            We're thrilled to have you on board! You've just joined thousands of creators 
            who are transforming their ideas into stunning AI-generated videos.
          </Text>
          
          <Section style={highlightBox}>
            <Heading as="h2" style={h2}>
              Here's what you can do:
            </Heading>
            
            <Text style={feature}>
              ✨ Create videos from text prompts in minutes
            </Text>
            <Text style={feature}>
              🎥 Choose between multiple AI models (Luma & Kling)
            </Text>
            <Text style={feature}>
              💎 Start with 10 free credits
            </Text>
            <Text style={feature}>
              📊 Track your video generation history
            </Text>
          </Section>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/create`}
            >
              Create Your First Video
            </Button>
          </Section>
          
          <Text style={paragraph}>
            Need help getting started? Check out our{' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/help`} style={link}>
              help center
            </Link>{' '}
            or reply to this email - we're here to help!
          </Text>
          
          <Hr style={hr} />
          
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

const highlightBox = {
  backgroundColor: '#f3f0ff',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const feature = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '28px',
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