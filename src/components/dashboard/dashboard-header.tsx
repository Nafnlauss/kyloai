'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Video, Home, Settings, LogOut } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Kylo</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/studio/video">
                <Video className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/videos">
                <Video className="h-4 w-4 mr-2" />
                Meus Vídeos
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/gallery">
                <Video className="h-4 w-4 mr-2" />
                Galeria
              </Link>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}