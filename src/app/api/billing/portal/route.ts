export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import type { Accountant } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: accountant } = await supabase.from('accountants').select('*').eq('id', user.id).single()
  const acc = accountant as Accountant | null

  if (!acc?.stripe_customer_id) {
    return NextResponse.redirect(new URL('/dashboard/billing', request.url))
  }

  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: acc.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  })

  return NextResponse.redirect(session.url, { status: 303 })
}
