import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  UserPlus, FileText, Sparkles, Send, Settings,
  Mail, Globe, Scale, HelpCircle, BookOpen, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Help & Guide' }

const steps = [
  {
    icon: Settings,
    title: 'Step 1: Set up your practice',
    description: 'Go to Settings and enter your practice name, reply-to email, default booking link, and currency. Upload your logo for branded emails.',
    link: '/dashboard/settings',
    linkText: 'Go to Settings',
    time: '5 min',
  },
  {
    icon: UserPlus,
    title: 'Step 2: Add your first client',
    description: 'Add each client with their name, email, business type, and preferred language. Add standing context notes — these are used in every narrative for that client.',
    link: '/dashboard/clients/new',
    linkText: 'Add a client',
    time: '3 min per client',
  },
  {
    icon: FileText,
    title: 'Step 3: Enter monthly figures',
    description: 'For each client, enter the 8 key figures for the month. This takes about 90 seconds. Include an optional context note for anything unusual that month.',
    link: '/dashboard/clients',
    linkText: 'View clients',
    time: '90 sec per client',
  },
  {
    icon: Sparkles,
    title: 'Step 4: Generate the narrative',
    description: 'Click Generate. Claude Haiku writes a 200–260 word plain-English narrative in your client\'s language. Review it alongside the figures — edit anything that needs adjusting.',
    time: '10–30 sec',
  },
  {
    icon: Send,
    title: 'Step 5: Send to your client',
    description: 'Once you\'re happy, click Send. Figuri dispatches a branded HTML email to your client with your booking link in the footer. Done.',
    time: '30 sec',
  },
]

const faq = [
  {
    q: 'What languages are supported?',
    a: 'English, French, German, Finnish, and Spanish at launch. Dutch, Italian, Brazilian Portuguese, Swedish, and Norwegian are coming in the following weeks. Narratives are generated natively in the target language — not translated from English.',
  },
  {
    q: 'Can I edit the narrative before sending?',
    a: 'Yes. The narrative is fully editable before sending. Figuri shows you the entered figures alongside the text so you can check everything is accurate. You can also regenerate if you don\'t like the output.',
  },
  {
    q: 'What financial reporting standards does Figuri follow?',
    a: 'Figuri generates narratives based on the figures you enter. Claude is instructed to avoid jargon and not offer tax or legal advice. For UK clients, the figures align with UK GAAP / FRS 102 management accounts. For EU clients, they align with IFRS SME principles. The accountant remains responsible for accuracy.',
  },
  {
    q: 'How many narratives can I generate on the free trial?',
    a: '5 narratives total across your 14-day free trial. After that, you\'ll need to subscribe. Narrative generation is blocked (not account access) once the trial limit is reached.',
  },
  {
    q: 'Is client data stored securely?',
    a: 'Yes. All data is stored in Supabase with Row-Level Security — you can only access your own data. The Supabase project region is EU West. Financial figures and narrative text are encrypted at rest.',
  },
  {
    q: 'Can my client log in and see their narratives?',
    a: 'Not in the MVP. Figuri is an accountant-facing tool. Clients receive their narrative by email. A client portal is on the post-launch roadmap.',
  },
  {
    q: 'What if Claude gets the figures wrong in the narrative?',
    a: 'Figuri always shows the entered figures alongside the editable narrative. You must review before sending. Per the Terms of Service, the accountant is responsible for reviewing all generated content before sending.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Billing and open the Stripe Customer Portal. You can cancel, downgrade, or update payment there. Cancellation takes effect at the end of the current billing period.',
  },
]

const legalStandards = [
  { country: 'United Kingdom', standard: 'UK GAAP / FRS 102', currency: 'GBP (£)', notes: 'Aligned with HMRC management accounts format. Sole traders use simplified accounts.' },
  { country: 'European Union', standard: 'IFRS for SMEs / local GAAP', currency: 'EUR (€)', notes: 'Varies by country. Figuri uses general European SME terminology. Confirm local requirements with your professional body.' },
  { country: 'Finland', standard: 'Finnish Accounting Act (Kirjanpitolaki)', currency: 'EUR (€)', notes: 'Finnish narratives use Finnish number formatting (comma decimal) and Finnish accounting vocabulary.' },
  { country: 'Germany', standard: 'HGB (Handelsgesetzbuch)', currency: 'EUR (€)', notes: 'German narratives use German number formatting and HGB-aligned terminology where relevant.' },
  { country: 'France', standard: 'Plan Comptable Général (PCG)', currency: 'EUR (€)', notes: 'French narratives use French financial vocabulary.' },
  { country: 'United States', standard: 'US GAAP / AICPA SME', currency: 'USD ($)', notes: 'English narratives. USD coming in Growing plan.' },
  { country: 'Latin America', standard: 'IFRS / local GAAP varies', currency: 'USD / local', notes: 'Spanish (LATAM) variant uses Latin American financial vocabulary.' },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Header title="Help & Guide" description="How to use Figuri" />
      <div className="p-6 max-w-3xl space-y-8">

        {/* Quick start */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Quick Start Guide
          </h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm">{step.title}</p>
                        <Badge variant="secondary" className="text-xs">{step.time}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.link && (
                        <Link href={step.link} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          {step.linkText} <ChevronRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal / country standards */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Financial Reporting Standards by Country
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {legalStandards.map((s, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{s.country}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">{s.standard}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0 text-xs">{s.currency}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-muted/40 rounded-b-xl">
                <p className="text-xs text-muted-foreground">
                  <strong>Important:</strong> Figuri generates narrative text as a writing aid. The accountant is responsible for reviewing all generated content before sending and for the accuracy of all figures entered. Figuri does not provide accounting, tax, or financial advice. Always comply with the reporting standards of the jurisdiction you are working in.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <p className="font-medium text-sm mb-1.5">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className="bg-accent/30 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-1">Need more help?</p>
                  <p className="text-sm text-muted-foreground">
                    Email us at{' '}
                    <a href="mailto:reachout@actvli.com" className="text-primary hover:underline font-medium">
                      reachout@actvli.com
                    </a>
                    {' '}— we typically respond within 24 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
