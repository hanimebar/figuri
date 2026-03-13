import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">Figuri</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Plain-English monthly financial narratives for small-practice accountants. In their client&apos;s language.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/example" className="hover:text-foreground transition-colors">See Example</Link></li>
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:reachout@actvli.com" className="hover:text-foreground transition-colors">reachout@actvli.com</a></li>
              <li><Link href="/dashboard/help" className="hover:text-foreground transition-colors">Help Centre</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Äctvli Responsible Consulting. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            An <a href="https://actvli.com" className="hover:text-foreground transition-colors underline underline-offset-2">Äctvli</a> product
          </p>
        </div>
      </div>
    </footer>
  )
}
