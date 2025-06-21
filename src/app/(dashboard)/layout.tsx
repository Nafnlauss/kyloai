import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { CreditBalance } from '@/components/ui/credit-balance'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Video, Home, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header do Dashboard */}
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/generate">
                  <Video className="h-4 w-4 mr-2" />
                  Gerar Vídeo
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/videos">
                  <Video className="h-4 w-4 mr-2" />
                  Meus Vídeos
                </Link>
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <CreditBalance />
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

      {/* Conteúdo da página */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}