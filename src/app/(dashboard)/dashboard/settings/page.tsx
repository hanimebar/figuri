'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Upload } from 'lucide-react'
import type { Accountant } from '@/types'

const schema = z.object({
  business_name: z.string().min(1, 'Required'),
  reply_to_email: z.string().email('Valid email required'),
  default_booking_link_url: z.string().url().optional().or(z.literal('')),
  currency: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function SettingsPage() {
  const [accountant, setAccountant] = useState<Accountant | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('accountants').select('*').eq('id', user.id).single()
      if (data) {
        setAccountant(data as Accountant)
        reset({
          business_name: data.business_name || '',
          reply_to_email: data.reply_to_email || data.email || '',
          default_booking_link_url: data.default_booking_link_url || '',
          currency: data.currency || 'GBP',
        })
      }
    }
    load()
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error: err } = await supabase.from('accountants').update({
        business_name: data.business_name,
        reply_to_email: data.reply_to_email,
        default_booking_link_url: data.default_booking_link_url || null,
        currency: data.currency,
      }).eq('id', user.id)
      if (err) throw err
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Settings" description="Manage your practice settings" />
      <div className="p-6 max-w-2xl space-y-6">
        {/* Practice details */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Details</CardTitle>
            <CardDescription>This information appears in client emails.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {success && (
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Settings saved successfully.</AlertDescription>
                </Alert>
              )}
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="space-y-2">
                <Label htmlFor="business_name">Practice Name *</Label>
                <Input id="business_name" placeholder="e.g. Smith & Associates Accountants" {...register('business_name')} />
                {errors.business_name && <p className="text-xs text-destructive">{errors.business_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply_to_email">Reply-To Email *</Label>
                <Input id="reply_to_email" type="email" placeholder="yourname@yourpractice.com" {...register('reply_to_email')} />
                <p className="text-xs text-muted-foreground">
                  This email must be verified with Resend. Clients reply to this address.
                </p>
                {errors.reply_to_email && <p className="text-xs text-destructive">{errors.reply_to_email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <select
                  id="currency"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('currency')}
                >
                  <option value="GBP">GBP (£) — British Pounds</option>
                  <option value="EUR">EUR (€) — Euros</option>
                  <option value="USD">USD ($) — US Dollars</option>
                  <option value="SEK">SEK — Swedish Krona</option>
                  <option value="NOK">NOK — Norwegian Krone</option>
                  <option value="DKK">DKK — Danish Krone</option>
                  <option value="CHF">CHF — Swiss Franc</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_booking_link_url">Default Booking Link</Label>
                <Input
                  id="default_booking_link_url"
                  type="url"
                  placeholder="https://calendly.com/yourname/review"
                  {...register('default_booking_link_url')}
                />
                <p className="text-xs text-muted-foreground">
                  Used in all email footers unless overridden per client. Leave blank to omit the booking link.
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logo upload */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Logo</CardTitle>
            <CardDescription>Your logo appears at the top of client emails. Recommended: 400×100px PNG.</CardDescription>
          </CardHeader>
          <CardContent>
            {accountant?.logo_url && (
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={accountant.logo_url} alt="Logo" className="h-12 object-contain" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <span className="text-xs text-muted-foreground">PNG or SVG, max 500KB</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Logo upload requires Supabase Storage to be configured.
            </p>
          </CardContent>
        </Card>

        {/* Email domain verification instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Email Deliverability</CardTitle>
            <CardDescription>Ensure your client emails land in the inbox, not spam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">To improve deliverability, verify your sending domain with Resend:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
              <li>Go to <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">resend.com/domains</a></li>
              <li>Add your domain (e.g. yourpractice.com)</li>
              <li>Add the DNS records shown (DKIM, SPF, DMARC)</li>
              <li>Set your reply-to email above to use that domain</li>
            </ol>
            <Alert>
              <AlertDescription>
                Without domain verification, emails send from reachout@actvli.com. This works but reduces deliverability.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
