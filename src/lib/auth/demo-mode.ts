// Demo Mode Helper for Admin Access
// IMPORTANT: Remove this file and all references in production!

export const DEMO_MODE = process.env.ADMIN_DEMO_MODE === 'true'

export const DEMO_SESSION = {
  user: {
    id: 'demo-admin',
    email: 'demo@admin.com',
    name: 'Demo Admin',
    role: 'ADMIN' as const,
    image: null
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

export function isDemoMode(): boolean {
  if (DEMO_MODE) {
    console.log('⚠️  ADMIN DEMO MODE ACTIVE - Remove before production!')
  }
  return DEMO_MODE
}

export function getDemoSession() {
  return DEMO_SESSION
}