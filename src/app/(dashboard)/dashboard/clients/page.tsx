import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronRight, Globe } from 'lucide-react'
import { currentPeriod } from '@/lib/utils'
import { LANGUAGE_NAMES } from '@/types'
import type { Client, Narrative, Language } from '@/types'

export const metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const period = currentPeriod()

  const [clientsRes, narrativesRes] = await Promise.all([
    supabase.from('clients').select('*').eq('accountant_id', user.id).order('name'),
    supabase.from('narratives')
      .select('client_id, status, generated_at')
      .eq('accountant_id', user.id)
      .gte('generated_at', `${period}-01`)
      .lte('generated_at', `${period}-31`),
  ])

  const clients = (clientsRes.data ?? []) as Client[]
  const narrativeMap = new Map<string, string>()
  for (const n of (narrativesRes.data ?? [])) {
    narrativeMap.set(n.client_id, n.status)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/clients/new"><Plus className="h-4 w-4" /> Add Client</Link>
          </Button>
        }
      />

      <div className="p-6">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Add your first client</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Each client has their own language setting, contact details, and narrative history.
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/clients/new">Add Client</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map(client => {
              const status = narrativeMap.get(client.id)
              return (
                <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
                  <Card className="card-hover cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                            {client.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{client.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{client.business_type}</p>
                          </div>
                        </div>
                        {status ? (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                            status === 'sent' ? 'status-sent' : 'status-draft'
                          }`}>
                            {status === 'sent' ? 'Sent' : 'Draft'}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 status-missing">
                            Needed
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {LANGUAGE_NAMES[client.language as Language] || client.language}
                        </span>
                        {client.email && (
                          <span className="truncate">{client.email}</span>
                        )}
                      </div>
                      {client.context_notes && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{client.context_notes}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
