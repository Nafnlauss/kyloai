'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Sale {
  id: string
  user: {
    name: string
    email: string
    image?: string
  }
  amount: number
  createdAt: string
}

interface RecentSalesProps {
  sales: Sale[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.user.image} alt={sale.user.name} />
            <AvatarFallback>
              {sale.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.user.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +R$ {(sale.amount / 100).toLocaleString('pt-BR')}
          </div>
        </div>
      ))}
    </div>
  )
}