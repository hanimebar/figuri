'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'

const schema = z.object({
  business_name: z.string().min(1, 'Required'),
  reply_to_email: z.string().email('Valid email required'),
})
type FormData = z.infer<typeof schema>

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 14)

      const { error: err } = await supabase.from('accountants').upsert({
        id: user.id,
        email: user.email,
        business_name: data.business_name,
        reply_to_email: data.reply_to_email,
        stripe_subscription_status: 'trialing',
        trial_ends_at: trialEnd.toISOString(),
        currency: 'GBP',
      })

      if (err) throw err
      router.push('/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">Figuri</span>
      </div>

      <Card className="w-full max-w-md shadow-2xl shadow-black/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Figuri 👋</CardTitle>
          <CardDescription>Set up your practice in 30 seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="space-y-2">
              <Label htmlFor="business_name">Practice Name *</Label>
              <Input id="business_name" placeholder="e.g. Smith & Associates" {...register('business_name')} />
              {errors.business_name && <p className="text-xs text-destructive">{errors.business_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply_to_email">Your Email Address *</Label>
              <Input id="reply_to_email" type="email" placeholder="you@yourpractice.com" {...register('reply_to_email')} />
              <p className="text-xs text-muted-foreground">Clients can reply to this address from their narrative email.</p>
              {errors.reply_to_email && <p className="text-xs text-destructive">{errors.reply_to_email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting up...' : 'Get started →'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
