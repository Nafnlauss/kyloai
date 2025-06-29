import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Novo usuário premium',
    message: 'João Silva assinou o plano Professional',
    type: 'success',
    category: 'user',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/admin/users',
    actionLabel: 'Ver usuário',
  },
  {
    id: '2',
    title: 'Falha no processamento',
    message: '3 vídeos falharam no processamento com Kling AI',
    type: 'error',
    category: 'video',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/admin/videos?status=FAILED',
    actionLabel: 'Ver vídeos',
  },
  {
    id: '3',
    title: 'Limite de API atingido',
    message: 'Luma Dream Machine atingiu 80% do limite diário',
    type: 'warning',
    category: 'system',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '4',
    title: 'Pagamento processado',
    message: 'Recebido R$ 450,00 via Stripe',
    type: 'success',
    category: 'payment',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '5',
    title: 'Tentativa de login suspeita',
    message: 'Múltiplas tentativas falhadas para admin@example.com',
    type: 'warning',
    category: 'security',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/admin/audit',
    actionLabel: 'Ver logs',
  },
]

// GET /api/admin/notifications - Get all notifications
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // In a real implementation, fetch from database
    // const notifications = await prisma.adminNotification.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    //   take: 50
    // })

    return NextResponse.json({ notifications: mockNotifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationIds, markAllRead } = body

    // In a real implementation, update in database
    // if (markAllRead) {
    //   await prisma.adminNotification.updateMany({
    //     where: { userId: session.user.id, read: false },
    //     data: { read: true }
    //   })
    // } else if (notificationIds && notificationIds.length > 0) {
    //   await prisma.adminNotification.updateMany({
    //     where: {
    //       id: { in: notificationIds },
    //       userId: session.user.id
    //     },
    //     data: { read: true }
    //   })
    // }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/notifications - Delete notifications
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    // In a real implementation, delete from database
    // if (clearAll) {
    //   await prisma.adminNotification.deleteMany({
    //     where: { userId: session.user.id }
    //   })
    // } else if (notificationId) {
    //   await prisma.adminNotification.delete({
    //     where: {
    //       id: notificationId,
    //       userId: session.user.id
    //     }
    //   })
    // }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}