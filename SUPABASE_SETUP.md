# Supabase Setup Guide for KyloAI

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `kyloai` (or your preference)
   - Database Password: (save this securely)
   - Region: Choose nearest to your users
4. Click "Create new project"

## 2. Configure Environment Variables

After project creation, go to Settings > API and copy:

```env
# Replace these values in your .env file
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

## 3. Run Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to SQL Editor in Supabase Dashboard
2. Click "New query"
3. Copy the entire content of `/supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run migrations
supabase db push
```

## 4. Seed Initial Data

1. Go to SQL Editor in Supabase Dashboard
2. Copy content of `/supabase/seed.sql`
3. Paste and click "Run"

## 5. Configure Authentication

### Enable Email/Password Auth:
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure:
   - Enable email confirmations (recommended)
   - Customize email templates if needed

### Enable Google OAuth:
1. Still in Authentication > Providers
2. Enable Google
3. Add your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
4. Add redirect URL to Google Console:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```

## 6. Configure Storage (Optional)

If you want to store videos in Supabase Storage:

1. Go to Storage
2. Create a new bucket called `videos`
3. Set policies:
   - Public read for video thumbnails
   - Authenticated write for video uploads

## 7. Update Prisma Configuration

Run Prisma commands to sync with Supabase:

```bash
# Generate Prisma Client
npx prisma generate

# Pull database schema (optional - to sync any manual changes)
npx prisma db pull

# Format schema file
npx prisma format
```

## 8. Test Connection

Create a test file `test-connection.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Plans:', data)
  }
}

testConnection()
```

Run: `node test-connection.js`

## Security Notes

1. **Never commit** `.env` file with real credentials
2. **Use Row Level Security (RLS)** - already configured in migration
3. **Enable 2FA** on your Supabase account
4. **Monitor usage** in Supabase Dashboard
5. **Set up alerts** for unusual activity

## Troubleshooting

### "Permission denied" errors
- Check RLS policies
- Ensure user is authenticated
- Verify service role key for admin operations

### Connection timeouts
- Check if project is paused (free tier pauses after 1 week of inactivity)
- Verify DATABASE_URL is correct
- Check firewall/network settings

### Migration errors
- Ensure you're using latest PostgreSQL features
- Check for conflicting table names
- Verify all extensions are enabled

## Next Steps

1. Configure payment webhooks
2. Set up monitoring (Sentry)
3. Configure backup strategy
4. Implement rate limiting
5. Set up CI/CD pipeline