'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function AuthHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/logo_sem_fundo.png" 
            alt="Kylo Logo" 
            width={32} 
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="font-bold text-xl">Kylo</span>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  )
}