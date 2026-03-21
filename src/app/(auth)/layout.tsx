import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-blue-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <Link href="/" className="text-2xl font-bold text-white">Figuri</Link>
      </div>
      {children}
      <p className="mt-6 text-xs text-slate-500">
        An <a href="https://actvli.com" className="text-slate-400 hover:text-white transition-colors">Äctvli</a> product · reachout@actvli.com
      </p>
    </div>
  )
}
