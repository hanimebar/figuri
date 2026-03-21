import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, CheckCircle, Globe, Clock, Send,
  FileText, Users, TrendingUp, ArrowRight, Star, Quote,
  Zap, Shield, Languages,
} from 'lucide-react'

export const metadata = {
  title: 'Figuri — Monthly Financial Narratives for Accountants',
}

const EXAMPLE_NARRATIVE = `March was a strong month for Rose's Florist. Revenue came in at £14,200, which is £1,800 ahead of February and represents healthy growth heading into spring. After covering your £4,100 in cost of goods and £7,300 in operating expenses, the business delivered a net profit of £2,800 — a solid result for a busy retail month.

Your cash position at month end stands at £9,400, which gives you comfortable headroom for the next few weeks of trading. The £800 one-off marketing spend you made in late March should start showing in April's footfall numbers.

One thing worth keeping an eye on: operating expenses were slightly higher than the same period last year, largely driven by the increased rent following your lease renewal. This is a known cost, but it does mean your margin is tighter than it was twelve months ago.

Overall, the business is in a good position — profitable, cash-positive, and growing.

Here's my question for you: now that spring is here and footfall should increase, do you have plans to adjust your buying or staffing levels to make the most of it?`

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-powered · Multilingual · Dispatched in one click
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Your clients&apos; monthly numbers,<br />
              <span className="text-blue-200">explained in plain English.</span>
            </h1>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl leading-relaxed">
              Figuri turns your monthly management figures into a clear, friendly narrative
              that small business owners actually read — in their own language.
              Enter figures, generate, edit, send. Under 60 seconds per client.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="xl" className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-black/20">
                <Link href="/signup">Start free trial <ArrowRight className="h-5 w-5 ml-1" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                <Link href="/example">See an example →</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-200">14-day free trial · 5 narratives · No card required</p>
          </div>
        </div>
      </section>

      {/* Example narrative */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Example Output</Badge>
            <h2 className="text-3xl font-bold">What your client receives</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              A warm, jargon-free email that explains the month in plain language they understand.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <Card className="shadow-xl overflow-hidden">
              {/* Email header mockup */}
              <div className="bg-gradient-to-r from-slate-800 to-primary px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Smith & Associates</span>
                  <span className="text-blue-200 text-sm">Financial Update</span>
                </div>
                <div className="mt-3">
                  <p className="text-blue-200 text-xs uppercase tracking-wider">Monthly Report</p>
                  <h3 className="text-xl font-bold mt-0.5">March 2026</h3>
                  <p className="text-blue-100 text-sm mt-0.5">Dear Rose,</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{EXAMPLE_NARRATIVE}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Kind regards,</p>
                  <p className="font-semibold text-sm">James Smith, Smith & Associates</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Have questions about these figures?{' '}
                    <span className="text-primary font-medium">Book a 20-minute review call →</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 text-center">
              <Link href="/example" className="text-sm text-primary hover:underline">
                See full example with figures and editing flow →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-white dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '72%', label: 'of SMB clients want their accountant to explain financials proactively' },
              { value: '28%', label: 'currently receive a proactive explanation (Xero 2025)' },
              { value: '<60s', label: 'to generate and send a narrative per client' },
              { value: '10+', label: 'languages supported at launch' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold">Everything you need. Nothing you don&apos;t.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Languages,
                title: 'Native multilingual generation',
                desc: 'English, French, German, Finnish, Spanish and more — generated natively in the client\'s language, not translated.',
              },
              {
                icon: Clock,
                title: '90 seconds per client',
                desc: '8 fields to fill in. Click generate. Edit if you want. Send. The whole flow from blank to delivered email in under a minute.',
              },
              {
                icon: Sparkles,
                title: 'Claude AI — no jargon',
                desc: 'Powered by Claude Haiku. No EBITDA, no amortisation, no prepayments. Just plain language a business owner can act on.',
              },
              {
                icon: Send,
                title: 'Branded email dispatch',
                desc: 'Your logo, your reply-to email, your booking link. Clients see your brand, not Figuri\'s.',
              },
              {
                icon: Users,
                title: 'Full client roster',
                desc: 'Manage all your clients in one place. Set language, booking link, standing context, and history per client.',
              },
              {
                icon: Shield,
                title: 'GDPR compliant',
                desc: 'Data stored in Supabase EU West. Row-level security on all tables. Privacy policy and right-to-deletion included.',
              },
            ].map((f, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">From the beta</Badge>
            <h2 className="text-3xl font-bold">Accountants who tried it first</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote: "I used to spend 20 minutes writing these summaries for each client. Now it's 60 seconds and the quality is better than what I was writing myself.",
                name: 'Sarah T.',
                role: 'Sole practitioner · 22 clients',
              },
              {
                quote: "My Finnish clients actually read the reports now. The narratives come out in proper Finnish — not translated English. That alone makes it worth it.",
                name: 'Mikko L.',
                role: 'Accounting practice · Helsinki',
              },
              {
                quote: "I was sceptical about the AI part, but the edit step keeps me in control. I've changed maybe 10% of the generated text across 30 narratives.",
                name: 'James P.',
                role: 'Sole trader accountant · Manchester',
              },
            ].map((t, i) => (
              <Card key={i} className="relative">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-primary/30 mb-3" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-foreground mb-4">{t.quote}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Why Figuri</Badge>
            <h2 className="text-3xl font-bold">Purpose-built for sole practitioners</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-6 font-medium text-muted-foreground">Tool</th>
                  <th className="text-left py-3 pr-6 font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { tool: 'Fathom', price: '£100–200+/mo', gap: 'Overbuilt for sole practitioners; no multilingual generation' },
                  { tool: 'Futrli / Spotlight', price: '£100+/mo', gap: 'Enterprise-focused; complex onboarding' },
                  { tool: 'Manual (accountant writes it)', price: '~30 min/client', gap: 'Time cost, inconsistent, not scalable' },
                  { tool: 'ChatGPT / Claude direct', price: 'Free', gap: 'No client management, history, or send flow' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-6 font-medium">{row.tool}</td>
                    <td className="py-3 pr-6 text-muted-foreground">{row.price}</td>
                    <td className="py-3 text-muted-foreground">{row.gap}</td>
                  </tr>
                ))}
                <tr className="bg-primary/5">
                  <td className="py-3 pr-6 font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Figuri
                  </td>
                  <td className="py-3 pr-6 font-semibold">from £19/mo</td>
                  <td className="py-3 text-primary font-medium">Purpose-built, sub-£20 entry, native multilingual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-4">Simple Pricing</Badge>
          <h2 className="text-3xl font-bold mb-4">One tool, two plans</h2>
          <p className="text-muted-foreground mb-8">
            Start with a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { name: 'Solo Practice', price: '£19/month', desc: 'Up to 30 clients' },
              { name: 'Growing Practice', price: '£39/month', desc: 'Unlimited clients · 3 seats' },
            ].map((plan, i) => (
              <Card key={i} className={`w-64 ${i === 1 ? 'border-primary/50 shadow-md' : ''}`}>
                <CardContent className="p-5 text-center">
                  {i === 1 && <Badge className="mb-2 bg-primary text-white text-xs">Most Popular</Badge>}
                  <p className="font-bold text-lg">{plan.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">See full pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient text-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            72% of clients want this. Only 28% get it.<br />Be in that 28%.
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start sending monthly narratives this week. Your first 5 are free.
          </p>
          <Button asChild size="xl" className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg">
            <Link href="/signup">Start free — no card required <ArrowRight className="h-5 w-5 ml-1" /></Link>
          </Button>
        </div>
      </section>
    </>
  )
}
