import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB (reduzido para segurança)
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const AVATAR_SIZE = 256 // Square avatar size

// Magic bytes para validação de tipo de arquivo
const MAGIC_BYTES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/jpg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46]
}

// Função para validar magic bytes
function validateFileType(buffer: Buffer, mimeType: string): boolean {
  const magicBytes = MAGIC_BYTES[mimeType as keyof typeof MAGIC_BYTES]
  if (!magicBytes) return false

  for (let i = 0; i < magicBytes.length; i++) {
    if (buffer[i] !== magicBytes[i]) return false
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer for magic byte validation
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes to prevent file type spoofing
    if (!validateFileType(buffer, file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. File content does not match declared type.' },
        { status: 400 }
      )
    }

    // Get current user to check for existing avatar
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    // Buffer já foi criado acima para validação

    // Process image with sharp
    const processedImage = await sharp(buffer)
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toBuffer()

    // Generate unique filename
    const filename = `${session.user.id}-${randomUUID()}.webp`
    
    // Define upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    const filePath = join(uploadDir, filename)
    const publicUrl = `/uploads/avatars/${filename}`

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true })

    // Save processed image
    await writeFile(filePath, processedImage)

    // Delete old avatar if exists
    if (user?.image && user.image.startsWith('/uploads/avatars/')) {
      const oldFilePath = join(process.cwd(), 'public', user.image)
      try {
        await unlink(oldFilePath)
      } catch (error) {
        console.error('Error deleting old avatar:', error)
        // Continue even if deletion fails
      }
    }

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Update user avatar
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
      select: {
        id: true,
        image: true,
      }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'user_avatar',
      resourceId: session.user.id,
      metadata: { 
        filename,
        fileSize: file.size,
        fileType: file.type,
      },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Avatar uploaded successfully',
      image: updatedUser.image,
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.image) {
      return NextResponse.json(
        { error: 'No avatar to delete' },
        { status: 400 }
      )
    }

    // Delete file if it's a local upload
    if (user.image.startsWith('/uploads/avatars/')) {
      const filePath = join(process.cwd(), 'public', user.image)
      try {
        await unlink(filePath)
      } catch (error) {
        console.error('Error deleting avatar file:', error)
        // Continue even if deletion fails
      }
    }

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Remove avatar from database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'user_avatar',
      resourceId: session.user.id,
      metadata: { action: 'avatar_removed' },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Avatar removed successfully' 
    })
  } catch (error) {
    console.error('Error removing avatar:', error)
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    )
  }
}