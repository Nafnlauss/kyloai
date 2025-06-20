import { prisma } from '@/lib/prisma'

interface AuditLogParams {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  metadata?: any
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  metadata,
  ipAddress,
  userAgent,
}: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging should not break the application
  }
}

export async function getAuditLogs({
  userId,
  action,
  resource,
  startDate,
  endDate,
  limit = 100,
  offset = 0,
}: {
  userId?: string
  action?: string
  resource?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const where: any = {}
  
  if (userId) where.userId = userId
  if (action) where.action = action
  if (resource) where.resource = resource
  
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }
  
  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    }),
  ])
  
  return {
    total,
    logs,
    hasMore: offset + limit < total,
  }
}

// Common audit actions
export const AUDIT_ACTIONS = {
  // Auth
  USER_REGISTERED: 'USER_REGISTERED',
  USER_SIGNIN: 'USER_SIGNIN',
  USER_SIGNOUT: 'USER_SIGNOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGIN_BLOCKED: 'LOGIN_BLOCKED',
  PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED: 'PASSWORD_RESET_COMPLETED',
  
  // User
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_ENABLED: 'USER_ENABLED',
  USER_DISABLED: 'USER_DISABLED',
  
  // Video
  VIDEO_CREATED: 'VIDEO_CREATED',
  VIDEO_DELETED: 'VIDEO_DELETED',
  VIDEO_DOWNLOADED: 'VIDEO_DOWNLOADED',
  
  // Subscription
  SUBSCRIPTION_CREATED: 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED: 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  
  // Payment
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  REFUND_ISSUED: 'REFUND_ISSUED',
  
  // Admin
  ADMIN_ACCESS: 'ADMIN_ACCESS',
  CONFIG_UPDATED: 'CONFIG_UPDATED',
  PLAN_CREATED: 'PLAN_CREATED',
  PLAN_UPDATED: 'PLAN_UPDATED',
  PLAN_DELETED: 'PLAN_DELETED',
} as const