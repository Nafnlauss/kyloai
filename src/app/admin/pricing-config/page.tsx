'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRICING_CONFIG, formatPrice } from '@/config/pricing'
import { 
  DollarSign, 
  Package, 
  CreditCard,
  CheckCircle,
  X
} from 'lucide-react'

export default function AdminPricingConfigPage() {
  const { plans, creditPacks } = PRICING_CONFIG

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuração de Preços</h2>
        <p className="text-muted-foreground">
          Visualize os planos e pacotes de créditos configurados no sistema
        </p>
      </div>

      {/* Planos de Assinatura */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Planos de Assinatura
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(plans).map(([key, plan]) => (
            <Card key={key} className={plan.popular ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.displayName}</CardTitle>
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.monthlyPrice)}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <div className="text-sm text-muted-foreground">
                      ou {formatPrice(plan.yearlyPrice)}/ano
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {plan.monthlyCredits} créditos/mês
                    </span>
                  </div>
                  {plan.yearlyCredits && (
                    <div className="text-sm text-muted-foreground pl-6">
                      {plan.yearlyCredits} créditos anuais (acumulativos)
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">Recursos incluídos:</p>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="text-xs flex items-start gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pacotes de Créditos */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pacotes de Créditos Avulsos
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(creditPacks).map(([key, pack]) => (
            <Card key={key} className={pack.popular ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  {pack.popular && <Badge>Popular</Badge>}
                  {pack.bestValue && <Badge variant="secondary">Melhor Valor</Badge>}
                  {pack.maximum && <Badge variant="outline">Máximo</Badge>}
                </div>
                <CardDescription>
                  {pack.credits.toLocaleString()} créditos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">
                    {formatPrice(pack.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPrice(pack.pricePerCredit * 100)}/100 créditos
                  </div>
                </div>

                {pack.savings && (
                  <Badge variant="secondary" className="w-full justify-center">
                    {pack.savings}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Informações de Uso de Créditos */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de Créditos por Provedor</CardTitle>
          <CardDescription>
            Consumo de créditos para cada provedor de vídeo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Luma</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>V1 (Standard)</span>
                  <span className="font-mono">{PRICING_CONFIG.creditUsage.luma.v1.creditsPerSecond} créditos/segundo</span>
                </div>
                <div className="flex justify-between">
                  <span>V2 (Premium)</span>
                  <span className="font-mono">{PRICING_CONFIG.creditUsage.luma.v2.creditsPerSecond} créditos/segundo</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Kling</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>V1 (Standard)</span>
                  <span className="font-mono">{PRICING_CONFIG.creditUsage.kling.v1.creditsPerSecond} créditos/segundo</span>
                </div>
                <div className="flex justify-between">
                  <span>V2 (Professional)</span>
                  <span className="font-mono">{PRICING_CONFIG.creditUsage.kling.v2.creditsPerSecond} créditos/segundo</span>
                </div>
                <div className="flex justify-between">
                  <span>V2.1 (Professional+)</span>
                  <span className="font-mono">{PRICING_CONFIG.creditUsage.kling.v2_1.creditsPerSecond} créditos/segundo</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}