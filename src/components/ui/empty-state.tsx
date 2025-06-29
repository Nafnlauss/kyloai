import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  subtitle,
  icon: Icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      )}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}