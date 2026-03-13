import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Building2, ExternalLink, AlertCircle } from 'lucide-react'
import { PLANS } from '@/lib/stripe'
import { trialDaysRemaining, isOnActiveSubscription } from '@/lib/utils'
import type { Accountant } from '@/types'

export const metadata = { title: 'Billing' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: accountant } = await supabase.from('accountants').select('*').eq('id', user.id).single()
  const acc = accountant as Accountant | null
  const isActive = isOnActiveSubscription(acc?.stripe_subscription_status ?? null)
  const trialDays = trialDaysRemaining(acc?.trial_ends_at ?? null)
  const onTrial = acc?.stripe_subscription_status === 'trialing'

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Billing" description="Manage your subscription" />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Current plan status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              {acc?.stripe_subscription_status ? (
                <Badge variant={isActive ? 'success' : 'warning'}>
                  {acc.stripe_subscription_status}
                </Badge>
              ) : (
                <Badge variant="secondary">No subscription</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {onTrial && trialDays > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>
                  Free trial — <strong>{trialDays} day{trialDays !== 1 ? 's' : ''} remaining</strong>.
                  Subscribe to keep full access.
                </p>
              </div>
            )}
            {!isActive && !onTrial && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>Your subscription is inactive. Narrative generation is paused. Subscribe below to resume.</p>
              </div>
            )}
            {isActive && !onTrial && (
              <p className="text-sm text-muted-foreground">
                Your subscription is active. Manage it below.
              </p>
            )}
            {acc?.stripe_subscription_id && (
              <form action="/api/billing/portal" method="POST">
                <Button variant="outline" size="sm" type="submit">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Subscription (Stripe Portal)
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Solo */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>{PLANS.solo.name}</CardTitle>
              </div>
              <div>
                <span className="text-3xl font-bold">£{PLANS.solo.monthlyGBP}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">or £{PLANS.solo.annualGBP}/year (save £{(PLANS.solo.monthlyGBP * 12) - PLANS.solo.annualGBP})</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {PLANS.solo.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <form action="/api/billing/checkout" method="POST">
                <input type="hidden" name="plan" value="solo" />
                <input type="hidden" name="interval" value="month" />
                <Button className="w-full" variant={isActive ? 'outline' : 'default'} type="submit">
                  {isActive ? 'Switch to Solo' : 'Start with Solo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Growing */}
          <Card className="relative border-primary/50 shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-white">Most Popular</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{PLANS.growing.name}</CardTitle>
              </div>
              <div>
                <span className="text-3xl font-bold">£{PLANS.growing.monthlyGBP}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">or £{PLANS.growing.annualGBP}/year (save £{(PLANS.growing.monthlyGBP * 12) - PLANS.growing.annualGBP})</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {PLANS.growing.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <form action="/api/billing/checkout" method="POST">
                <input type="hidden" name="plan" value="growing" />
                <input type="hidden" name="interval" value="month" />
                <Button className="w-full" type="submit">
                  {isActive ? 'Switch to Growing' : 'Start with Growing'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 14-day trial note */}
        <p className="text-xs text-center text-muted-foreground">
          All plans include a 14-day free trial (5 narratives), no card required.
          Cancel anytime.
        </p>
      </div>
    </div>
  )
}
