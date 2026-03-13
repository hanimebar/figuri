'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { formatPeriod, formatCurrency } from '@/lib/utils'
import {
  ArrowLeft, Sparkles, RefreshCw, Send, Save,
  CheckCircle, TrendingUp, DollarSign, Landmark, Info
} from 'lucide-react'
import Link from 'next/link'
import type { MonthlyFigures, Client, Narrative } from '@/types'

export default function NarrativeGeneratorPage() {
  const { id, figuresId } = useParams() as { id: string; figuresId: string }
  const router = useRouter()

  const [figures, setFigures] = useState<MonthlyFigures | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [narrative, setNarrative] = useState<Narrative | null>(null)
  const [bodyText, setBodyText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    setWordCount(bodyText.trim().split(/\s+/).filter(Boolean).length)
  }, [bodyText])

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const [figRes, clientRes, narrativeRes] = await Promise.all([
      supabase.from('monthly_figures').select('*').eq('id', figuresId).single(),
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('narratives').select('*').eq('figures_id', figuresId).maybeSingle(),
    ])
    if (figRes.data) setFigures(figRes.data as MonthlyFigures)
    if (clientRes.data) setClient(clientRes.data as Client)
    if (narrativeRes.data) {
      setNarrative(narrativeRes.data as Narrative)
      setBodyText(narrativeRes.data.body_text)
      if (narrativeRes.data.status === 'sent') setSent(true)
    }
  }, [id, figuresId])

  useEffect(() => { loadData() }, [loadData])

  const generate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figures_id: figuresId, client_id: id }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Generation failed')
      }
      const data = await res.json()
      setBodyText(data.body_text)
      setNarrative(data.narrative)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const saveDraft = async () => {
    if (!narrative) return
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase.from('narratives').update({ body_text: bodyText }).eq('id', narrative.id)
    } finally {
      setSaving(false)
    }
  }

  const send = async () => {
    if (!narrative) return
    setSending(true)
    setError(null)
    try {
      // First save current edits
      const supabase = createClient()
      await supabase.from('narratives').update({ body_text: bodyText }).eq('id', narrative.id)

      const res = await fetch('/api/send-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narrative_id: narrative.id }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Send failed')
      }
      setSent(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  const wordCountColor = wordCount < 200 ? 'text-amber-600' : wordCount > 260 ? 'text-red-500' : 'text-emerald-600'

  if (!figures || !client) {
    return (
      <div className="flex flex-col min-h-full">
        <Header title="Generate Narrative" />
        <div className="p-6 max-w-3xl space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Generate Narrative" description={`${client.name} — ${formatPeriod(figures.period_month)}`} />
      <div className="p-6 max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-1">
          <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Back to client</Link>
        </Button>

        {sent && (
          <Alert variant="success" className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Narrative sent to {client.email}! You can view it in the client&apos;s history.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Figures reference panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Figures — {formatPeriod(figures.period_month)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(figures.revenue)}</span>
              </div>
              {figures.cost_of_goods != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">COGS</span>
                  <span className="font-medium">{formatCurrency(figures.cost_of_goods)}</span>
                </div>
              )}
              {figures.gross_margin_pct != null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross margin</span>
                  <span className="font-medium">{figures.gross_margin_pct}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Op. expenses</span>
                <span className="font-medium">{formatCurrency(figures.operating_expenses)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net profit</span>
                <span className={`font-semibold ${figures.net_profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatCurrency(figures.net_profit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash position</span>
                <span className="font-semibold">{formatCurrency(figures.cash_position)}</span>
              </div>
              {figures.one_off_items && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">One-off items</p>
                    <p className="text-xs">{figures.one_off_items}</p>
                  </div>
                </>
              )}
              {figures.context_note && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Your context</p>
                    <p className="text-xs">{figures.context_note}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Narrative editor */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {sent ? 'Sent Narrative' : bodyText ? 'Edit Narrative' : 'Generate Narrative'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {bodyText && (
                      <span className={`text-xs font-medium ${wordCountColor}`}>
                        {wordCount} words
                        {wordCount >= 200 && wordCount <= 260 ? ' ✓' : ' (target: 200–260)'}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!bodyText && !generating ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium mb-1">Ready to generate</p>
                    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                      Claude Haiku will write a 200–260 word narrative in {client.language === 'en' ? 'English' : client.language} based on these figures.
                    </p>
                    <Button onClick={generate}>
                      <Sparkles className="h-4 w-4 mr-1" /> Generate Narrative
                    </Button>
                  </div>
                ) : generating ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Generating in {client.language}...
                    </p>
                  </div>
                ) : (
                  <Textarea
                    value={bodyText}
                    onChange={e => setBodyText(e.target.value)}
                    className="narrative-editor min-h-[280px] font-serif text-base leading-relaxed"
                    readOnly={sent}
                    placeholder="Generated narrative will appear here..."
                  />
                )}

                {bodyText && !generating && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {!sent && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={generate}
                          disabled={generating}
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Regenerate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={saveDraft}
                          disabled={saving}
                        >
                          <Save className="h-3.5 w-3.5 mr-1" />
                          {saving ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={send}
                          disabled={sending || wordCount < 100}
                        >
                          <Send className="h-3.5 w-3.5 mr-1" />
                          {sending ? 'Sending...' : `Send to ${client.email}`}
                        </Button>
                      </>
                    )}
                    {sent && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/clients/${id}`}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> View client history
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {bodyText && !sent && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/40 text-xs text-accent-foreground">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <p>
                  Review the narrative carefully before sending. You are responsible for the accuracy of all figures and content per our Terms of Service.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
