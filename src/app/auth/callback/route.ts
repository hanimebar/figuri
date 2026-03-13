export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Ensure accountant record exists (for OAuth sign-ups)
      const { data: existing } = await supabase
        .from('accountants')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existing) {
        const trialEnd = new Date()
        trialEnd.setDate(trialEnd.getDate() + 14)
        await supabase.from('accountants').insert({
          id: data.user.id,
          email: data.user.email,
          business_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          stripe_subscription_status: 'trialing',
          trial_ends_at: trialEnd.toISOString(),
          currency: 'GBP',
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
