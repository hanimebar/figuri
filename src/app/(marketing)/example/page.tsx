import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, Sparkles, Clock } from 'lucide-react'

export const metadata = {
  title: 'Example Narrative — See What Figuri Generates',
}

const FIGURES = {
  period: 'March 2026',
  client: "Rose's Florist",
  businessType: 'Retail florist',
  language: 'English',
  revenue: 14200,
  cogs: 4100,
  grossMarginPct: 71.1,
  operatingExpenses: 7300,
  netProfit: 2800,
  cashPosition: 9400,
  oneOffItems: '£800 one-off marketing spend',
  contextNote: 'Spring trading starting — March was the first month of peak season.',
}

const NARRATIVE_EN = `March was a strong month for Rose's Florist. Revenue came in at £14,200, which is £1,800 ahead of February and represents healthy growth heading into spring. After covering your £4,100 in cost of goods and £7,300 in operating expenses, the business delivered a net profit of £2,800 — a solid result for a busy retail month.

Your cash position at month end stands at £9,400, which gives you comfortable headroom for the next few weeks of trading. The £800 one-off marketing spend you made in late March should start showing in April's footfall numbers.

One thing worth keeping an eye on: operating expenses were slightly higher than the same period last year, largely driven by the increased rent following your lease renewal. This is a known cost, but it does mean your margin is tighter than it was twelve months ago.

Overall, the business is in a good position — profitable, cash-positive, and growing.

Here's my question for you: now that spring is here and footfall should increase, do you have plans to adjust your buying or staffing levels to make the most of it?`

const NARRATIVE_FI = `Maaliskuu oli vahva kuukausi Rose's Floristille. Liikevaihto oli 14 200 £, joka on 1 800 £ enemmän kuin helmikuussa ja edustaa tervettä kasvua kevättä kohti mentäessä. Myyntikustannusten (4 100 £) ja liikekulujen (7 300 £) jälkeen yritys teki 2 800 £ nettotuloksen — vahva tulos vilkkaalle kauppakuukaudelle.

Kassakanta kuukauden lopussa on 9 400 £, mikä antaa mukavan liikkumavaran seuraaviksi viikoksi. Maaliskuun lopussa tehty 800 £:n kertaluonteinen markkinointipanostus pitäisi näkyä huhtikuun kävijämäärissä.

Yksi asia kannattaa pitää silmällä: liikekulut olivat hieman korkeammat kuin samana ajanjaksona viime vuonna, pääasiassa vuokrankorotuksen vuoksi vuokrasopimuksen uusimisen jälkeen. Tämä on tiedossa oleva kustannus, mutta se tarkoittaa, että marginaali on kireämpi kuin kaksitoista kuukautta sitten.

Kaiken kaikkiaan yritys on hyvässä asemassa — kannattava, kassapositiivinen ja kasvava.

Tässä kysymykseni sinulle: nyt kun kevät on täällä ja kävijämäärien pitäisi kasvaa, onko sinulla suunnitelmia muuttaa hankintoja tai henkilöstömäärää hyödyntääksesi sen?`

export default function ExamplePage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> Live Example
          </Badge>
          <h1 className="text-4xl font-bold mb-4">See exactly what Figuri produces</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Below are the 8 figures entered for a retail florist client in March 2026, and the narratives
            Claude generated — in English and Finnish.
          </p>
        </div>

        {/* Input: the figures */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Step 1 — Figures entered (90 seconds)</CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~90 sec
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
              {[
                { label: 'Client', value: FIGURES.client },
                { label: 'Business type', value: FIGURES.businessType },
                { label: 'Period', value: FIGURES.period },
                { label: 'Language', value: FIGURES.language },
              ].map((f, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold">{f.value}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Revenue', value: `£${FIGURES.revenue.toLocaleString()}` },
                { label: 'Cost of Goods', value: `£${FIGURES.cogs.toLocaleString()}` },
                { label: 'Gross Margin', value: `${FIGURES.grossMarginPct}%` },
                { label: 'Operating Expenses', value: `£${FIGURES.operatingExpenses.toLocaleString()}` },
                { label: 'Net Profit', value: `£${FIGURES.netProfit.toLocaleString()}` },
                { label: 'Cash Position', value: `£${FIGURES.cashPosition.toLocaleString()}` },
              ].map((f, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
                  <p className="text-sm font-semibold">{f.value}</p>
                </div>
              ))}
            </div>
            {FIGURES.oneOffItems && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-0.5">One-off items</p>
                <p className="text-sm">{FIGURES.oneOffItems}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output: English */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                🇬🇧 Generated Narrative — English
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="success">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {NARRATIVE_EN.trim().split(/\s+/).length} words
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> ~15 sec
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Email mockup */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Smith & Associates</span>
                  <span className="text-emerald-200 text-sm">Financial Update</span>
                </div>
                <div className="mt-2">
                  <p className="text-emerald-200 text-xs uppercase tracking-wider">Monthly Report</p>
                  <h3 className="text-lg font-bold">March 2026</h3>
                  <p className="text-emerald-100 text-sm">Dear Rose,</p>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-card">
                <p className="text-sm leading-relaxed whitespace-pre-line">{NARRATIVE_EN}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Kind regards,</p>
                  <p className="font-semibold text-sm">James Smith, Smith & Associates</p>
                </div>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Have questions about these figures?{' '}
                    <span className="text-primary font-medium cursor-pointer">Book a 20-minute review call →</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output: Finnish */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🇫🇮 Same figures, generated in Finnish — natively
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-5">
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">{NARRATIVE_FI}</p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Notice the Finnish number formatting (e.g. 14 200 £) and vocabulary — this is natively generated in Finnish by Claude, not translated from English.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">14-day free trial · 5 narratives · No card required</p>
          <Button asChild size="lg">
            <Link href="/signup">Start free trial <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
