'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  period_month: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-MM'),
  revenue: z.coerce.number().min(0, 'Must be 0 or more'),
  cost_of_goods: z.coerce.number().optional().nullable(),
  gross_margin_pct: z.coerce.number().min(0).max(100).optional().nullable(),
  operating_expenses: z.coerce.number().min(0),
  net_profit: z.coerce.number(),
  cash_position: z.coerce.number().min(0),
  one_off_items: z.string().optional(),
  context_note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function currentMonth() {
  const now = new Date()
  now.setMonth(now.getMonth() - 1) // Default to last month
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function currencySymbolFor(code: string): string {
  const map: Record<string, string> = { GBP: '£', EUR: '€', USD: '$', SEK: 'kr', NOK: 'kr', DKK: 'kr', CHF: 'Fr' }
  return map[code] ?? code
}

export default function NewFiguresPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currencySymbol, setCurrencySymbol] = useState('£')

  useEffect(() => {
    const loadCurrency = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('accountants').select('currency').eq('id', user.id).single()
      if (data?.currency) setCurrencySymbol(currencySymbolFor(data.currency))
    }
    loadCurrency()
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { period_month: currentMonth() },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: inserted, error: insertError } = await supabase.from('monthly_figures').insert({
        client_id: id,
        accountant_id: user.id,
        period_month: data.period_month,
        revenue: data.revenue,
        cost_of_goods: data.cost_of_goods ?? null,
        gross_margin_pct: data.gross_margin_pct ?? null,
        operating_expenses: data.operating_expenses,
        net_profit: data.net_profit,
        cash_position: data.cash_position,
        one_off_items: data.one_off_items || null,
        context_note: data.context_note || null,
      }).select().single()

      if (insertError) throw insertError
      router.push(`/dashboard/clients/${id}/figures/${inserted.id}/narrative`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save figures')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Enter Monthly Figures" />
      <div className="p-6 max-w-2xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-1">
          <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Back to client</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Figures</CardTitle>
            <CardDescription>
              Enter the financial figures for this period. These take about 90 seconds to complete.
              Leave COGS blank for service businesses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="period_month">Reporting Period *</Label>
                <Input id="period_month" type="month" {...register('period_month')} />
                {errors.period_month && <p className="text-xs text-destructive">{errors.period_month.message}</p>}
              </div>

              <Separator />
              <h3 className="text-sm font-semibold">Revenue & Margin</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue *</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                    <Input id="revenue" type="number" step="0.01" inputMode="decimal" aria-required="true" placeholder="0.00" className="pl-7" {...register('revenue')} />
                  </div>
                  {errors.revenue && <p className="text-xs text-destructive">{errors.revenue.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_of_goods">
                    Cost of Goods Sold
                    <span className="ml-1 text-xs font-normal text-muted-foreground">(leave blank for service businesses)</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                    <Input id="cost_of_goods" type="number" step="0.01" inputMode="decimal" placeholder="Leave blank if N/A" className="pl-7" {...register('cost_of_goods')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_margin_pct">Gross Margin %</Label>
                  <Input id="gross_margin_pct" type="number" step="0.1" min="0" max="100" inputMode="decimal" placeholder="e.g. 65.5" {...register('gross_margin_pct')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operating_expenses">Operating Expenses *</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                    <Input id="operating_expenses" type="number" step="0.01" inputMode="decimal" aria-required="true" placeholder="0.00" className="pl-7" {...register('operating_expenses')} />
                  </div>
                  {errors.operating_expenses && <p className="text-xs text-destructive">{errors.operating_expenses.message}</p>}
                </div>
              </div>

              <Separator />
              <h3 className="text-sm font-semibold">Bottom Line</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="net_profit">Net Profit *</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                    <Input id="net_profit" type="number" step="0.01" inputMode="decimal" aria-required="true" placeholder="0.00 (can be negative)" className="pl-7" {...register('net_profit')} />
                  </div>
                  {errors.net_profit && <p className="text-xs text-destructive">{errors.net_profit.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_position">Cash in Bank (month end) *</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{currencySymbol}</span>
                    <Input id="cash_position" type="number" step="0.01" inputMode="decimal" aria-required="true" placeholder="0.00" className="pl-7" {...register('cash_position')} />
                  </div>
                  {errors.cash_position && <p className="text-xs text-destructive">{errors.cash_position.message}</p>}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="one_off_items">One-Off Items</Label>
                <Input
                  id="one_off_items"
                  placeholder="e.g. £5,000 insurance payment, refund from supplier"
                  {...register('one_off_items')}
                />
                <p className="text-xs text-muted-foreground">Any non-recurring items that affected the figures</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context_note">Accountant's Context for This Month</Label>
                <Textarea
                  id="context_note"
                  placeholder="e.g. Revenue higher than usual due to Christmas trading. Owner took £2k director's loan."
                  rows={3}
                  {...register('context_note')}
                />
                <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/50 text-xs text-accent-foreground">
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <p>This context is included in the Claude prompt and directly shapes the narrative. Be specific.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Continue to Narrative →'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/clients/${id}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
