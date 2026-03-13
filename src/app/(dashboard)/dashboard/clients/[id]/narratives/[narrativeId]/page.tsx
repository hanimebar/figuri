import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Send, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatPeriod, formatCurrency } from '@/lib/utils'
import type { Narrative, MonthlyFigures, Client } from '@/types'

interface Props { params: Promise<{ id: string; narrativeId: string }> }

export async function generateMetadata({ params }: Props) {
  const { narrativeId } = await params
  return { title: `Narrative ${narrativeId.slice(0, 8)}` }
}

export default async function NarrativeViewPage({ params }: Props) {
  const { id, narrativeId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [narRes, clientRes] = await Promise.all([
    supabase.from('narratives').select('*, monthly_figures(*)').eq('id', narrativeId).eq('accountant_id', user.id).single(),
    supabase.from('clients').select('*').eq('id', id).single(),
  ])

  if (!narRes.data) notFound()

  const narrative = narRes.data as Narrative & { monthly_figures: MonthlyFigures }
  const client = clientRes.data as Client
  const figures = narrative.monthly_figures

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title={`${formatPeriod(figures?.period_month ?? '')} Narrative`}
        description={client?.name}
      />
      <div className="p-6 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-1">
          <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Back to client</Link>
        </Button>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {formatPeriod(figures?.period_month ?? '')} — {client?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {narrative.status === 'sent' ? (
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 mr-1" /> Sent
                    </Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="narrative-prose whitespace-pre-wrap rounded-lg bg-muted/40 p-4 leading-relaxed">
                {narrative.body_text}
              </div>

              <Separator />

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Generated {new Date(narrative.generated_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                </span>
                {narrative.sent_at && (
                  <span className="flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    Sent {new Date(narrative.sent_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                  </span>
                )}
              </div>

              {narrative.status === 'draft' && (
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/dashboard/clients/${id}/figures/${narrative.figures_id}/narrative`}>
                      Continue editing
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {figures && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Original Figures</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {[
                  { label: 'Revenue', value: formatCurrency(figures.revenue) },
                  { label: 'Op. Expenses', value: formatCurrency(figures.operating_expenses) },
                  { label: 'Net Profit', value: formatCurrency(figures.net_profit) },
                  { label: 'Cash Position', value: formatCurrency(figures.cash_position) },
                  figures.cost_of_goods != null ? { label: 'COGS', value: formatCurrency(figures.cost_of_goods) } : null,
                  figures.gross_margin_pct != null ? { label: 'Gross Margin', value: `${figures.gross_margin_pct}%` } : null,
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{item!.label}</p>
                    <p className="font-medium">{item!.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
