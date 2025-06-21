// Centralized URL configuration
export const APP_URLS = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://kylo.video',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://kylo.video/api',
  
  // Public pages
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  
  // Dashboard pages
  DASHBOARD: '/dashboard',
  GENERATE: '/generate',
  VIDEOS: '/dashboard/videos',
  CREDITS: '/dashboard/credits',
  SETTINGS: '/dashboard/settings',
  
  // Admin pages
  ADMIN: '/admin',
  ADMIN_OVERVIEW: '/admin/overview',
  ADMIN_USERS: '/admin/users',
  ADMIN_VIDEOS: '/admin/videos',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  
  // External URLs
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@kylo.video',
  COMPANY_WEBSITE: process.env.COMPANY_WEBSITE || 'https://kylo.video',
  
  // Helper functions
  getVideoUrl: (videoId: string) => `/dashboard/videos/${videoId}`,
  getPasswordResetUrl: (token: string) => `/reset-password?token=${encodeURIComponent(token)}`,
  getAbsoluteUrl: (path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kylo.video'
    return `${baseUrl}${path}`
  },
}

// Email specific URLs
export const EMAIL_URLS = {
  DASHBOARD: APP_URLS.getAbsoluteUrl(APP_URLS.DASHBOARD),
  GENERATE: APP_URLS.getAbsoluteUrl(APP_URLS.GENERATE),
  PRICING: APP_URLS.getAbsoluteUrl(APP_URLS.PRICING),
  CREDITS: APP_URLS.getAbsoluteUrl(APP_URLS.CREDITS),
  getVideoUrl: (videoId: string) => APP_URLS.getAbsoluteUrl(APP_URLS.getVideoUrl(videoId)),
  getPasswordResetUrl: (token: string) => APP_URLS.getAbsoluteUrl(APP_URLS.getPasswordResetUrl(token)),
}