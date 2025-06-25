# DocsAgent - Documentation Specialist
**Tools:** TypeDoc, Storybook, README templates
**Standards:** JSDoc, OpenAPI 3.0
**Hosting:** GitHub Pages / Vercel

## API Documentation Pattern
```typescript
/**
 * Generate a new AI video from a text prompt
 * 
 * @route POST /api/videos/generate
 * @group Videos - Video generation operations
 * @param {VideoGenerateRequest.model} request.body.required - Video generation parameters
 * @returns {VideoGenerateResponse.model} 200 - Video generation started successfully
 * @returns {ErrorResponse.model} 400 - Invalid request parameters
 * @returns {ErrorResponse.model} 401 - Authentication required
 * @returns {ErrorResponse.model} 402 - Insufficient credits
 * @returns {ErrorResponse.model} 429 - Rate limit exceeded
 * @security JWT
 * @example request - Example request
 * {
 *   "prompt": "A serene beach at sunset with waves",
 *   "provider": "LUMA",
 *   "aspectRatio": "16:9",
 *   "duration": 5,
 *   "enhancePrompt": true
 * }
 * @example response - 200 - Success response
 * {
 *   "videoId": "clp5abc123",
 *   "status": "QUEUED",
 *   "estimatedTime": 180,
 *   "creditsUsed": 10
 * }
 */
export async function POST(request: Request) {
  // Implementation
}
```

## Component Documentation
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { VideoCard } from './video-card'

const meta = {
  title: 'Components/VideoCard',
  component: VideoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    video: {
      description: 'Video object containing all display data',
    },
  },
} satisfies Meta<typeof VideoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    video: {
      id: '1',
      prompt: 'A beautiful sunset over mountains',
      url: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      status: 'COMPLETED',
      createdAt: new Date(),
    },
  },
}

export const Processing: Story = {
  args: {
    video: {
      ...Default.args.video,
      status: 'PROCESSING',
      url: undefined,
    },
  },
}
```

## README Template
```markdown
# AI Video Hub

AI-powered video generation platform inspired by Hedra.com

## Features
- 🎬 Text-to-video generation using Luma and Kling AI
- 💳 Stripe payments (USD) with PIX support (BRL)
- 🔒 Enterprise security (OWASP, NIST, CIS, ISO 27001)
- 🌑 Dark theme optimized UI
- ⚡ Real-time progress updates
- 📊 Usage analytics dashboard

## Quick Start
\`\`\`bash
npm install --legacy-peer-deps
npm run dev
\`\`\`

## Architecture
- Next.js 15 with App Router
- SQLite database with Prisma ORM
- BullMQ job queue with Redis
- Socket.io for real-time updates
- 15 specialized MCP agents
```

## Auto-generated Docs
- API docs: `/docs/api`
- Component library: `/docs/storybook`
- Database ERD: `/docs/database-erd.svg`