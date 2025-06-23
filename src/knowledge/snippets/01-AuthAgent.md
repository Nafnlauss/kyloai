# AuthAgent - Authentication Specialist
**Library:** next-auth@5.0.0-beta.25
**Adapter:** @auth/prisma-adapter@2.7.2
**Security:** bcryptjs, iron-session, csrf

## Implementation Pattern
```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authOptions } from '@/lib/auth/auth-options';

// Authentication middleware
export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

// Client hook
export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
  };
}
```

## Security Features
- Rate limiting on login attempts (5 failures = 30min lock)
- Account lockout after failed attempts
- Audit logging for all auth events
- JWT sessions with refresh tokens
- Optional 2FA with TOTP