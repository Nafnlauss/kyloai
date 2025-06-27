# API Providers Documentation

This document provides comprehensive information about all AI API providers integrated into the Kylo platform.

## Table of Contents
- [Video APIs](#video-apis)
  - [Luma Labs Dream Machine](#luma-labs-dream-machine)
  - [Kling AI](#kling-ai)
- [Image APIs](#image-apis)
  - [Black Forest Labs (FLUX)](#black-forest-labs-flux)
- [Audio APIs](#audio-apis)
  - [ElevenLabs](#elevenlabs)
- [Multi-Service APIs](#multi-service-apis)
  - [PiAPI](#piapi)
  - [Newport AI](#newport-ai)
- [Configuration Guide](#configuration-guide)
- [Rate Limits & Best Practices](#rate-limits--best-practices)

## Video APIs

### Luma Labs Dream Machine

**Official Documentation**: https://docs.lumalabs.ai/docs/api

**Endpoint**: `https://api.lumalabs.ai/dream-machine/v1`

**Authentication**: Bearer token
```
Authorization: Bearer YOUR_LUMA_API_KEY
```

**Available Models**:
- Dream Machine v1 (Standard quality)
- Dream Machine v2 (Premium quality)

**Key Features**:
- Text-to-video generation
- Image-to-video generation
- Aspect ratios: 16:9, 1:1, 9:16
- Duration: 5-9 seconds
- Polling-based status checking

**Implementation**: `src/lib/video-providers/luma.ts`

### Kling AI

**Official Documentation**: Limited access at https://app.klingai.com/global/dev/document-api/

**Note**: The platform supports multiple Kling API providers:
1. **Official API** - Requires minimum $1,400/month subscription
2. **PiAPI** - Popular unofficial provider (recommended)
3. **Other unofficial APIs**

**Configuration**:
Set `KLING_API_TYPE` in your `.env` file:
- `official` - Uses official Kling API with signature authentication
- `piapi` - Uses PiAPI (default, recommended)
- `unofficial` - Uses other unofficial providers

#### Official API Configuration
```env
KLING_API_TYPE=official
KLING_ACCESS_KEY=your_access_key
KLING_SECRET_KEY=your_secret_key
```

#### PiAPI Configuration
```env
KLING_API_TYPE=piapi
KLING_API_KEY=your_piapi_key
```

**Available Models**:
- Kling 1.0, 1.1, 1.2 (Standard)
- Kling 1.5, 1.6 (Enhanced)
- Kling 2.0, 2.1 (Premium with native lip-sync)
- Kling 2.1 Master (8K)
- Kling Professional (up to 120s)

**Implementation**: `src/lib/video-providers/kling-v2.ts`

## Image APIs

### Black Forest Labs (FLUX)

**Official Documentation**: https://docs.bfl.ai

**Endpoint**: `https://api.bfl.ai`

**Authentication**: API Key header
```
x-key: YOUR_BFL_API_KEY
```

**Available Models**:
- `flux-schnell` - Ultra-fast generation
- `flux-dev` - Development-friendly
- `flux-pro` - Professional quality
- `flux-pro-1.1` - Enhanced pro version
- `flux-pro-1.1-ultra` - Ultra high quality

**Key Features**:
- Text-to-image generation
- Multiple aspect ratios
- Resolutions up to 4K
- Polling-based result retrieval
- Webhook support

**Implementation**: `src/lib/ai-providers/image/bfl.ts`

## Audio APIs

### ElevenLabs

**Official Documentation**: https://elevenlabs.io/docs/api-reference/

**Endpoint**: `https://api.elevenlabs.io/v1`

**Authentication**: API Key header
```
xi-api-key: YOUR_ELEVENLABS_API_KEY
```

**Default Model**: `eleven_multilingual_v2`

**Available Models**:
- `eleven_monolingual_v1` - English only
- `eleven_multilingual_v1` - Multiple languages
- `eleven_multilingual_v2` - Latest multilingual (default)
- `eleven_turbo_v2` - Fast generation

**Key Features**:
- Text-to-speech in multiple languages
- Voice cloning
- Real-time streaming
- WebSocket support
- Multiple output formats (MP3, PCM, μ-law)

**Popular Voice IDs**:
```javascript
RACHEL: '21m00Tcm4TlvDq8ikWAM'
BELLA: 'EXAVITQu4vr4xnSDxMaL' // Default
ANTONI: 'ErXwobaYiN019PkySvjV'
DOMI: 'AZnzlk1XvdvUeBnXmlld'
```

**Implementation**: `src/lib/ai-providers/audio/elevenlabs.ts`

## Multi-Service APIs

### PiAPI

**Website**: https://piapi.ai

**Services**: Access to multiple AI providers through a single API
- Midjourney (Image)
- FLUX (Image)
- Suno (Music)
- Kling (Video)
- Luma (Video)

**Authentication**: Simple API key
```
X-API-Key: YOUR_PIAPI_KEY
```

**Benefits**:
- Single API key for multiple services
- Simplified billing
- Consistent API interface
- Good documentation

### Newport AI

**Services**:
- SDXL image generation
- DALL-E 3 integration
- Video generation
- LLM text generation
- Image editing tools

**Authentication**: API key based

## Configuration Guide

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Luma Labs
LUMA_API_KEY=your_luma_api_key

# Kling AI - Choose your API type
KLING_API_TYPE=piapi # Options: official, piapi, unofficial

# For PiAPI (recommended)
KLING_API_KEY=your_piapi_key

# For Official API (if using)
KLING_ACCESS_KEY=your_access_key
KLING_SECRET_KEY=your_secret_key

# Black Forest Labs
BFL_API_KEY=your_bfl_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# PiAPI (for multi-service)
PIAPI_API_KEY=your_piapi_key

# Newport AI
NEWPORT_API_KEY=your_newport_api_key
```

### Getting API Keys

1. **Luma Labs**: Sign up at https://lumalabs.ai and access API keys in dashboard
2. **Kling AI (PiAPI)**: Register at https://piapi.ai
3. **Black Forest Labs**: Apply for access at https://bfl.ai
4. **ElevenLabs**: Sign up at https://elevenlabs.io
5. **Newport AI**: Contact their sales team

## Rate Limits & Best Practices

### Rate Limits

- **Luma Labs**: 10 requests/minute (varies by plan)
- **Kling AI**: Depends on provider
  - Official: Based on subscription tier
  - PiAPI: 100 requests/minute
- **BFL**: 100 requests/minute
- **ElevenLabs**: Based on subscription (10,000 characters/month free tier)

### Best Practices

1. **Implement Exponential Backoff**
   - Start with 1s delay
   - Double on each retry
   - Max 5 retries

2. **Use Webhooks When Available**
   - Reduces polling overhead
   - More efficient for long-running tasks

3. **Cache Results**
   - Store generated content
   - Implement CDN for media files

4. **Error Handling**
   - Log all API errors
   - Implement fallback providers
   - Notify users of failures

5. **Cost Management**
   - Track usage per user
   - Set spending limits
   - Monitor API costs

6. **Security**
   - Never expose API keys in client code
   - Use environment variables
   - Implement request validation

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API key is correct
   - Check header format
   - Ensure key has proper permissions

2. **Rate Limit Errors**
   - Implement retry logic
   - Add delays between requests
   - Consider upgrading plan

3. **Timeout Errors**
   - Increase polling intervals
   - Use webhooks if available
   - Check provider status page

4. **Invalid Parameters**
   - Verify model names
   - Check dimension limits
   - Validate prompt length

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_API_CALLS=true
```

This will log all API requests and responses for troubleshooting.

## Updates and Maintenance

This documentation is maintained alongside the codebase. When adding new providers or updating existing ones:

1. Update this documentation
2. Test all endpoints
3. Update type definitions
4. Add unit tests
5. Update pricing configuration

Last updated: December 2024