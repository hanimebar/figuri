export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, STRIPE_PRICES } from '@/lib/stripe'
import type { Accountant } from '@/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const formData = await request.formData()
  const plan = formData.get('plan') as string
  const interval = formData.get('interval') as string

  const priceKey = `${plan.toUpperCase()}_${interval.toUpperCase()}` as keyof typeof STRIPE_PRICES
  const priceId = STRIPE_PRICES[priceKey]

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { data: accountant } = await supabase.from('accountants').select('*').eq('id', user.id).single()
  const acc = accountant as Accountant | null

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: acc?.stripe_customer_id || undefined,
    customer_email: acc?.stripe_customer_id ? undefined : user.email,
    metadata: { accountant_id: user.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    subscription_data: {
      metadata: { accountant_id: user.id },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.redirect(session.url!, { status: 303 })
}
