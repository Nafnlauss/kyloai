import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}