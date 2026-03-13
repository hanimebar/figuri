import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, Send, AlertCircle, Plus, ChevronRight, Clock } from 'lucide-react'
import { formatPeriod, currentPeriod } from '@/lib/utils'
import type { Client, Narrative } from '@/types'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const period = currentPeriod()

  const [clientsRes, narrativesRes] = await Promise.all([
    supabase.from('clients').select('*').eq('accountant_id', user.id).order('name'),
    supabase.from('narratives')
      .select('*, clients(name, email)')
      .eq('accountant_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(20),
  ])

  const clients = (clientsRes.data ?? []) as Client[]
  const narratives = (narrativesRes.data ?? []) as (Narrative & { clients: { name: string; email: string } })[]

  const thisMonthNarratives = narratives.filter(n => {
    const d = new Date(n.generated_at)
    const thisMonth = new Date().toISOString().slice(0, 7)
    return d.toISOString().slice(0, 7) === thisMonth
  })

  const sent = thisMonthNarratives.filter(n => n.status === 'sent').length
  const drafted = thisMonthNarratives.filter(n => n.status === 'draft').length
  const missing = clients.length - thisMonthNarratives.length

  const recentActivity = narratives.slice(0, 6)

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Dashboard"
        description={`${formatPeriod(period)} overview`}
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/clients/new">
              <Plus className="h-4 w-4" /> Add Client
            </Link>
          </Button>
        }
      />

      <div className="p-6 space-y-6 flex-1">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Clients" value={clients.length} icon={Users} />
          <StatsCard title="Sent This Month" value={sent} icon={Send} variant="success" />
          <StatsCard title="Drafts Pending" value={drafted} icon={FileText} variant="warning" />
          <StatsCard
            title="Missing Update"
            value={Math.max(0, missing)}
            icon={AlertCircle}
            variant={missing > 0 ? 'danger' : 'default'}
            subtitle="clients with no narrative yet"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client list */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Client Roster</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/clients">View all <ChevronRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">No clients yet</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first client to get started</p>
                  <Button asChild size="sm">
                    <Link href="/dashboard/clients/new"><Plus className="h-4 w-4" /> Add first client</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {clients.slice(0, 8).map(client => {
                    const clientNarrative = narratives.find(n =>
                      n.client_id === client.id &&
                      new Date(n.generated_at).toISOString().slice(0, 7) === period
                    )
                    return (
                      <Link
                        key={client.id}
                        href={`/dashboard/clients/${client.id}`}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {client.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.business_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {clientNarrative ? (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              clientNarrative.status === 'sent' ? 'status-sent' : 'status-draft'
                            }`}>
                              {clientNarrative.status === 'sent' ? 'Sent' : 'Draft'}
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 rounded-full font-medium status-missing">
                              Needed
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivity.length === 0 ? (
                <p className="px-6 py-8 text-sm text-muted-foreground text-center">No activity yet</p>
              ) : (
                <div className="divide-y divide-border">
                  {recentActivity.map(n => (
                    <Link
                      key={n.id}
                      href={`/dashboard/clients/${n.client_id}/narratives/${n.id}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                        n.status === 'sent' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-amber-100 dark:bg-amber-900'
                      }`}>
                        {n.status === 'sent'
                          ? <Send className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          : <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{n.clients?.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(n.generated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Onboarding checklist for new users */}
        {clients.length === 0 && (
          <Card className="border-primary/30 bg-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-accent-foreground">Getting started checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Set up your practice settings (name, logo, reply-to email)', href: '/dashboard/settings', done: false },
                  { label: 'Add your first client', href: '/dashboard/clients/new', done: false },
                  { label: 'Enter monthly figures and generate your first narrative', href: '/dashboard/clients', done: false },
                  { label: 'Send the narrative to your client', href: '/dashboard/clients', done: false },
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      step.done ? 'bg-primary text-white' : 'border-2 border-primary/40 text-primary'
                    }`}>
                      {step.done ? '✓' : i + 1}
                    </div>
                    <Link href={step.href} className="text-accent-foreground hover:underline">{step.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button asChild size="sm">
                  <Link href="/dashboard/help">View full guide →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
