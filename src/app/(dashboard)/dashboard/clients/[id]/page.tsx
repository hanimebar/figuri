import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Plus, FileText, Send, Globe, Mail, Calendar, Edit } from 'lucide-react'
import { formatPeriod } from '@/lib/utils'
import { LANGUAGE_NAMES } from '@/types'
import type { Client, MonthlyFigures, Narrative, Language } from '@/types'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Client' }
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [clientRes, figuresRes, narrativesRes] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).eq('accountant_id', user.id).single(),
    supabase.from('monthly_figures').select('*').eq('client_id', id).order('period_month', { ascending: false }),
    supabase.from('narratives').select('*').eq('client_id', id).order('generated_at', { ascending: false }),
  ])

  if (!clientRes.data) notFound()

  const client = clientRes.data as Client
  const figures = (figuresRes.data ?? []) as MonthlyFigures[]
  const narratives = (narrativesRes.data ?? []) as Narrative[]

  const narrativeByFigures = new Map<string, Narrative>()
  for (const n of narratives) {
    narrativeByFigures.set(n.figures_id, n)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title={client.name}
        description={client.business_type}
        action={
          <Button asChild size="sm">
            <Link href={`/dashboard/clients/${id}/figures/new`}>
              <Plus className="h-4 w-4" /> Enter Monthly Figures
            </Link>
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <Button variant="ghost" size="sm" asChild className="-ml-1">
          <Link href="/dashboard/clients"><ArrowLeft className="h-4 w-4 mr-1" /> All clients</Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client Details</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/clients/${id}/edit`}><Edit className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  {LANGUAGE_NAMES[client.language as Language] || client.language}
                </span>
              </div>
              {client.booking_link_url && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={client.booking_link_url} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline truncate">
                    Booking link
                  </a>
                </div>
              )}
              {client.context_notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Standing context</p>
                    <p className="text-sm leading-relaxed">{client.context_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Figures and narratives */}
          <div className="lg:col-span-2 space-y-4">
            {figures.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">No monthly figures yet</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Enter this month&apos;s figures to generate a narrative
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/clients/${id}/figures/new`}>
                      <Plus className="h-4 w-4" /> Enter figures
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Monthly Reports
                </h2>
                {figures.map(f => {
                  const narrative = narrativeByFigures.get(f.id)
                  return (
                    <Card key={f.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm">{formatPeriod(f.period_month)}</p>
                              {narrative && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  narrative.status === 'sent' ? 'status-sent' : 'status-draft'
                                }`}>
                                  {narrative.status === 'sent' ? 'Sent' : 'Draft'}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span>Revenue: £{f.revenue.toLocaleString()}</span>
                              <span>Net profit: £{f.net_profit.toLocaleString()}</span>
                              <span>Cash: £{f.cash_position.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {narrative ? (
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/dashboard/clients/${id}/narratives/${narrative.id}`}>
                                  {narrative.status === 'sent' ? (
                                    <><Send className="h-3.5 w-3.5 mr-1" /> View Sent</>
                                  ) : (
                                    <><FileText className="h-3.5 w-3.5 mr-1" /> Continue</>
                                  )}
                                </Link>
                              </Button>
                            ) : (
                              <Button asChild size="sm">
                                <Link href={`/dashboard/clients/${id}/figures/${f.id}/narrative`}>
                                  Generate narrative
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
