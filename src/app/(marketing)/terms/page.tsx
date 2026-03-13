export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: March 2026 · Äctvli Responsible Consulting</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Acceptance</h2>
            <p className="text-muted-foreground">
              By creating an account or using Figuri, you agree to these Terms. If you do not agree, do not use the service.
              These Terms are governed by English law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. The Service</h2>
            <p className="text-muted-foreground">
              Figuri is a software tool that generates plain-English narrative summaries of financial figures provided by the accountant user.
              The service is intended for licensed accounting professionals who understand the figures they input and who review all output before sending it to clients.
            </p>
          </section>

          <section className="border-l-4 border-primary/50 pl-4">
            <h2 className="text-lg font-semibold mb-3">3. Accountant responsibility (critical clause)</h2>
            <p className="text-muted-foreground font-medium">
              <strong className="text-foreground">Figuri generates narrative text as a writing aid only.</strong> The accountant is responsible for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 text-muted-foreground">
              <li>Reviewing all generated content before sending it to clients.</li>
              <li>The accuracy of all figures entered into the system.</li>
              <li>Ensuring the narrative is appropriate for the client&apos;s circumstances.</li>
              <li>Compliance with professional standards and regulations applicable to their practice (ICAEW, ACCA, AAT, CIMA, or equivalent).</li>
            </ul>
            <p className="mt-3 text-muted-foreground">
              <strong className="text-foreground">Figuri does not provide accounting, tax, legal, or financial advice.</strong>
              The generated narrative is not a substitute for professional judgement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Subscription and billing</h2>
            <p className="text-muted-foreground">
              Subscriptions are billed monthly or annually via Stripe. The 14-day free trial includes 5 narratives.
              Narrative generation is blocked (not account access) once the trial limit is reached.
              Cancellation takes effect at the end of the current billing period. No refunds for partial periods.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Acceptable use</h2>
            <p className="text-muted-foreground">You may not use Figuri to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Generate narratives for clients of whom you are not the accountant of record.</li>
              <li>Send misleading or fraudulent financial communications.</li>
              <li>Circumvent the trial narrative limit by creating multiple accounts.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the AI generation endpoint.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Data and confidentiality</h2>
            <p className="text-muted-foreground">
              You retain ownership of all data you input into Figuri (client data, financial figures).
              We process this data to provide the service as described in our Privacy Policy.
              You are responsible for obtaining any necessary consent from your clients to process their data in Figuri.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Limitation of liability</h2>
            <p className="text-muted-foreground">
              Figuri is provided &ldquo;as is&rdquo;. Äctvli Responsible Consulting is not liable for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Any errors in generated narratives that are relied upon without review.</li>
              <li>Any loss of data, revenue, or reputation arising from use of the service.</li>
              <li>Service interruptions due to maintenance, third-party outages (Supabase, Vercel, Resend, Anthropic), or circumstances beyond our control.</li>
            </ul>
            <p className="mt-2 text-muted-foreground">Our maximum liability is limited to the subscription fees paid in the 3 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Changes to the service</h2>
            <p className="text-muted-foreground">
              We may modify or discontinue features with 30 days&apos; notice. Material changes to pricing will be communicated 30 days in advance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Termination</h2>
            <p className="text-muted-foreground">
              You may delete your account at any time from the Account page. We may suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms: <a href="mailto:reachout@actvli.com" className="text-primary hover:underline">reachout@actvli.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
