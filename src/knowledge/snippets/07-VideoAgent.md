# VideoAgent - Video Generation Specialist
**APIs:** Luma Dream Machine v1, Kling AI v2.1
**Processing:** Async with webhook/polling
**Storage:** Supabase Storage + CDN

## Luma Dream Machine Integration
- **Endpoint:** https://api.lumalabs.ai/dream-machine/v1
- **Auth:** Bearer token
- **Features:** Text-to-video, aspect ratios, loop option
- **Limits:** Based on credit system
- **Status:** Polling required (no webhooks)

## Key Implementation Details
```typescript
// Luma specific
- No duration control (fixed by model)
- Supports aspect ratios: 16:9, 9:16, 1:1
- States: pending, processing, completed, failed
- Video stored for limited time

// Kling specific  
- Singapore endpoint: api-singapore.klingai.com
- HMAC-SHA256 signature authentication
- Models: v1, v1.5, v2.0, v2.1
- Modes: STD (standard), PRO (professional)
- Duration: 3-10 seconds configurable
- Advanced: image2video, camera control, lip-sync
- Max prompt: 2500 characters
```

## Processing Pipeline
1. **Pre-validation**
   - Prompt length (10-2500 chars)
   - User credits check
   - Content moderation

2. **Generation**
   - Provider selection (Luma/Kling)
   - Prompt enhancement (optional)
   - API submission with retry logic

3. **Status Monitoring**
   - Polling interval: 5-10 seconds
   - Timeout: 10 minutes
   - Error handling with credit refund

4. **Post-processing**
   - Download video to temp storage
   - Generate thumbnail
   - Upload to Supabase Storage
   - Update database records

5. **Notification**
   - Real-time updates via Socket.io
   - Email notification (optional)
   - Webhook callbacks for API users

## Credit System
- Luma: 5 credits per video
- Kling STD: 7 credits per video  
- Kling PRO: 14 credits per video
- Failed generations: Auto-refund