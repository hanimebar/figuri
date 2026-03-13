export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getAnthropic, CLAUDE_MODEL } from '@/lib/claude'
import { buildSystemPrompt, buildUserMessage } from '@/lib/prompts'
import { isOnActiveSubscription, isTrialExpired } from '@/lib/utils'
import type { Client, MonthlyFigures, Accountant, Language } from '@/types'

const TRIAL_NARRATIVE_LIMIT = 5

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { figures_id, client_id } = await request.json()
    if (!figures_id || !client_id) {
      return NextResponse.json({ error: 'figures_id and client_id required' }, { status: 400 })
    }

    // Load accountant + check subscription
    const { data: accountant } = await supabase.from('accountants').select('*').eq('id', user.id).single()
    if (!accountant) return NextResponse.json({ error: 'Accountant not found' }, { status: 404 })

    const acc = accountant as Accountant
    const isActive = isOnActiveSubscription(acc.stripe_subscription_status)

    if (!isActive) {
      return NextResponse.json({ error: 'Subscription required. Please subscribe to generate narratives.' }, { status: 403 })
    }

    // Trial gate: max 5 narratives
    if (acc.stripe_subscription_status === 'trialing') {
      if (isTrialExpired(acc.trial_ends_at)) {
        return NextResponse.json({ error: 'Your free trial has expired. Please subscribe to continue.' }, { status: 403 })
      }
      const { count } = await supabase
        .from('narratives')
        .select('id', { count: 'exact', head: true })
        .eq('accountant_id', user.id)
      if ((count ?? 0) >= TRIAL_NARRATIVE_LIMIT) {
        return NextResponse.json({
          error: `Trial limit reached (${TRIAL_NARRATIVE_LIMIT} narratives). Subscribe to continue.`,
        }, { status: 403 })
      }
    }

    // Load figures and client
    const [figuresRes, clientRes] = await Promise.all([
      supabase.from('monthly_figures').select('*').eq('id', figures_id).eq('accountant_id', user.id).single(),
      supabase.from('clients').select('*').eq('id', client_id).eq('accountant_id', user.id).single(),
    ])

    if (!figuresRes.data || !clientRes.data) {
      return NextResponse.json({ error: 'Figures or client not found' }, { status: 404 })
    }

    const figures = figuresRes.data as MonthlyFigures
    const client = clientRes.data as Client

    // Generate narrative with Claude
    const anthropic = getAnthropic()
    const systemPrompt = buildSystemPrompt(client.language as Language)
    const userMessage = buildUserMessage(client, figures, acc)

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const bodyText = (message.content[0] as { type: string; text: string }).text.trim()

    // Upsert narrative (replace draft if exists)
    const serviceClient = await createServiceClient()
    const { data: existingNarrative } = await serviceClient
      .from('narratives')
      .select('id')
      .eq('figures_id', figures_id)
      .maybeSingle()

    let narrative
    if (existingNarrative) {
      const { data } = await serviceClient
        .from('narratives')
        .update({ body_text: bodyText, status: 'draft', generated_at: new Date().toISOString() })
        .eq('id', existingNarrative.id)
        .select()
        .single()
      narrative = data
    } else {
      const { data } = await serviceClient
        .from('narratives')
        .insert({
          figures_id,
          client_id,
          accountant_id: user.id,
          language: client.language,
          body_text: bodyText,
          status: 'draft',
          booking_link_included: !!(acc.default_booking_link_url || client.booking_link_url),
        })
        .select()
        .single()
      narrative = data
    }

    return NextResponse.json({ body_text: bodyText, narrative })
  } catch (error: unknown) {
    console.error('generate-narrative error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
