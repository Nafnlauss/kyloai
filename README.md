# KyloAI - AI Video Generation Platform

A modern web platform for creating AI-generated videos using Luma Dream Machine and Kling AI APIs.

## 🚀 Features

- **AI Video Generation**: Create videos from text prompts using multiple AI providers
- **Multiple AI Models**: Choose between Luma V1/V2 and Kling V1/V2.1
- **Subscription System**: Monthly and yearly plans with Stripe integration
- **Credit System**: Pay-as-you-go credit purchases
- **Admin Dashboard**: Complete admin panel for user and content management
- **Email Notifications**: Automated emails for purchases, video completion, etc.
- **Real-time Updates**: WebSocket integration for live video processing status
- **Security**: Enterprise-grade security with OWASP compliance

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe
- **Email**: Nodemailer with React Email
- **Real-time**: Socket.io
- **Queue**: BullMQ with Redis
- **Monitoring**: Sentry

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL or SQLite
- Redis (for queue system)
- Stripe account
- Email SMTP service

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-video-hub.git
cd ai-video-hub
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with:
- Database connection
- NextAuth secret
- Stripe API keys
- Email SMTP settings
- AI provider API keys

5. Run database migrations:
```bash
pnpm prisma migrate dev
```

6. Seed the database:
```bash
pnpm prisma db seed
```

7. Start the development server:
```bash
pnpm dev
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on Vercel
3. Configure environment variables
4. Deploy!

### Docker

```bash
docker build -t ai-video-hub .
docker run -p 3000:3000 ai-video-hub
```

## 📝 Environment Variables

Key environment variables needed:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI Providers
LUMA_API_KEY="..."
KLING_API_KEY="..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASSWORD="your-password"
```

## 🔐 Security

This project implements:
- OWASP Top 10 protection
- Rate limiting
- Input validation
- XSS prevention
- CSRF protection
- Secure headers
- Audit logging

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📧 Support

For support, email support@kyloai.com or open an issue on GitHub.