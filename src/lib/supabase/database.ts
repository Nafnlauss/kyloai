import { createClient } from '@supabase/supabase-js'

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface User {
  id: string
  email: string
  emailVerified?: Date | null
  name?: string | null
  passwordHash?: string | null
  image?: string | null
  credits: number
  creditsLastReset: Date
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  isActive: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  lastLoginAt?: Date | null
  lastLoginIp?: string | null
  failedLoginAttempts: number
  lockedUntil?: Date | null
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Plan {
  id: string
  name: string
  displayName: string
  credits: number
  priceMonthly: number
  priceYearly: number
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Helper functions that work like Prisma
export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: string } }) {
      const query = supabase.from('User').select('*')
      
      if (where.email) {
        query.eq('email', where.email.toLowerCase())
      } else if (where.id) {
        query.eq('id', where.id)
      }
      
      const { data, error } = await query.single()
      if (error) throw error
      return data
    },
    
    async create({ data }: { data: Partial<User> }) {
      const { data: user, error } = await supabase
        .from('User')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return user
    },
    
    async update({ where, data }: { where: { id: string }; data: Partial<User> }) {
      const { data: user, error } = await supabase
        .from('User')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      
      if (error) throw error
      return user
    }
  },
  
  plan: {
    async findUnique({ where }: { where: { name: string } }) {
      const { data, error } = await supabase
        .from('Plan')
        .select('*')
        .eq('name', where.name)
        .single()
      
      if (error) throw error
      return data
    },
    
    async findMany() {
      const { data, error } = await supabase
        .from('Plan')
        .select('*')
      
      if (error) throw error
      return data || []
    }
  },
  
  subscription: {
    async create({ data }: { data: any }) {
      const { data: subscription, error } = await supabase
        .from('Subscription')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return subscription
    }
  },
  
  auditLog: {
    async create({ data }: { data: any }) {
      const { data: log, error } = await supabase
        .from('AuditLog')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return log
    }
  }
}