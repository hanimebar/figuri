import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variants = {
  default: { icon: 'bg-primary/10 text-primary', border: '' },
  success: { icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', border: '' },
  warning: { icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', border: '' },
  danger: { icon: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', border: '' },
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = 'default', className }: StatsCardProps) {
  const v = variants[variant]
  return (
    <Card className={cn('card-hover', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn(
                'mt-1 text-xs font-medium',
                trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', v.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
