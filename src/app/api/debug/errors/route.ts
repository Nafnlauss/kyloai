import { NextRequest, NextResponse } from 'next/server'

// Store errors in memory (for development only)
let errors: any[] = []

export async function POST(request: NextRequest) {
  try {
    const error = await request.json()
    errors.push({
      ...error,
      timestamp: new Date().toISOString()
    })
    
    console.error('Client Error:', error)
    
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to log error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ errors })
}

export async function DELETE() {
  errors = []
  return NextResponse.json({ success: true })
}