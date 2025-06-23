import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VideoCompletedEmailProps {
  userName: string
  videoUrl: string
  videoId: string
}

export const VideoCompletedEmail = ({
  userName,
  videoUrl,
  videoId,
}: VideoCompletedEmailProps) => {
  const previewText = 'Your video is ready!'

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
          
          <Heading style={h1}>Your Video is Ready! 🎬</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            Great news! Your AI-generated video has been completed successfully 
            and is ready for viewing.
          </Text>
          
          <Section style={videoPreview}>
            <Img
              src={`${videoUrl}/thumbnail`}
              width="480"
              height="270"
              alt="Video thumbnail"
              style={thumbnail}
            />
          </Section>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/gallery?video=${videoId}`}
            >
              Watch Your Video
            </Button>
          </Section>
          
          <Text style={paragraph}>
            Your video will be available in your gallery for 30 days. 
            Don't forget to download it if you want to keep it permanently!
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

const paragraph = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
}

const videoPreview = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const thumbnail = {
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
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