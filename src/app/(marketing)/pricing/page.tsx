import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Building2 } from 'lucide-react'
import { PLANS } from '@/lib/stripe'

export const metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-muted-foreground text-lg">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Solo */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>{PLANS.solo.name}</CardTitle>
              </div>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">€{PLANS.solo.monthlyEUR}</span>
                  <span className="text-muted-foreground pb-1">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  or €{PLANS.solo.annualEUR}/year — save €{(PLANS.solo.monthlyEUR * 12) - PLANS.solo.annualEUR}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ul className="space-y-2.5">
                {PLANS.solo.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/signup">Start free trial</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Growing */}
          <Card className="border-primary/50 shadow-lg relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-white px-4">Most Popular</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{PLANS.growing.name}</CardTitle>
              </div>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">€{PLANS.growing.monthlyEUR}</span>
                  <span className="text-muted-foreground pb-1">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  or €{PLANS.growing.annualEUR}/year — save €{(PLANS.growing.monthlyEUR * 12) - PLANS.growing.annualEUR}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <ul className="space-y-2.5">
                {PLANS.growing.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/signup">Start free trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Common questions</h2>
          <div className="space-y-5">
            {[
              { q: 'How does the free trial work?', a: '14 days, 5 narratives, no credit card required. After the trial you can subscribe to continue, or your account moves to read-only.' },
              { q: 'Can I switch plans?', a: 'Yes — upgrade or downgrade at any time via the Stripe Customer Portal. Changes take effect immediately; billing is prorated.' },
              { q: 'What counts as an "active client"?', a: 'Any client on your roster, whether or not you\'ve sent a narrative that month. Archive clients to free up slots.' },
              { q: 'Is there a per-language premium?', a: 'No. All languages (10+) are included in both plans at no extra cost.' },
              { q: 'What payment methods are accepted?', a: 'All major cards (Visa, Mastercard, Amex) via Stripe. Bank transfer available for annual plans on request.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border pb-5">
                <p className="font-semibold mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
