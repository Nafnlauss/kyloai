# DbAgent - Database Specialist
**Library:** prisma@5.22.0, @supabase/supabase-js@2.50.0
**Database:** PostgreSQL via Supabase
**Migrations:** Supabase Dashboard or CLI

## Secure Query Patterns
```typescript
// Always use prepared statements
const user = await prisma.user.findUnique({
  where: { email: sanitizedEmail.toLowerCase() },
  select: {
    id: true,
    email: true,
    // Never expose passwordHash
  },
});

// ACID transactions
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({ ... });
  await tx.auditLog.create({ ... });
  return user;
});

// Soft deletes
await prisma.user.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

## Supabase Integration
```typescript
// Direct database queries with RLS
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: videos, error } = await supabase
  .from('videos')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

## Optimizations
- Indexes on frequently searched fields
- Connection pooling via Supabase
- Row Level Security (RLS) for data isolation
- Automatic backups with point-in-time recovery
- Real-time subscriptions available