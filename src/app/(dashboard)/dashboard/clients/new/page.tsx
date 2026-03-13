'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { LANGUAGES } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required'),
  business_type: z.string().min(1, 'Business type is required'),
  context_notes: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  booking_link_url: z.string().url().optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function NewClientPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: 'en' },
  })

  const language = watch('language')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase.from('clients').insert({
        accountant_id: user.id,
        name: data.name,
        email: data.email,
        business_type: data.business_type,
        context_notes: data.context_notes || null,
        language: data.language,
        booking_link_url: data.booking_link_url || null,
      })

      if (insertError) throw insertError
      router.push('/dashboard/clients')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Add Client" />
      <div className="p-6 max-w-2xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-1">
          <Link href="/dashboard/clients"><ArrowLeft className="h-4 w-4 mr-1" /> Back to clients</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>New Client</CardTitle>
            <CardDescription>
              Add a client to your roster. Their language setting determines the language of generated narratives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Client / Business Name *</Label>
                  <Input id="name" placeholder="e.g. Rose&apos;s Florist" {...register('name')} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Client Email *</Label>
                  <Input id="email" type="email" placeholder="owner@example.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type *</Label>
                <Input id="business_type" placeholder="e.g. retail florist, sole trader plumber, café" {...register('business_type')} />
                <p className="text-xs text-muted-foreground">This helps Claude write more relevant narratives.</p>
                {errors.business_type && <p className="text-xs text-destructive">{errors.business_type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Report Language *</Label>
                <Select value={language} onValueChange={v => setValue('language', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.flag} {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Narratives are generated natively in this language — not translated.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context_notes">Standing Context Notes</Label>
                <Textarea
                  id="context_notes"
                  placeholder="e.g. Seasonal business — summer is peak. Owner planning to hire in Q3. Watch cash position closely."
                  rows={3}
                  {...register('context_notes')}
                />
                <p className="text-xs text-muted-foreground">This context is included with every narrative for this client. Keep it current.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking_link_url">Booking Link (optional)</Label>
                <Input
                  id="booking_link_url"
                  type="url"
                  placeholder="https://calendly.com/yourname/review"
                  {...register('booking_link_url')}
                />
                <p className="text-xs text-muted-foreground">Overrides your practice default. Appears in the email footer.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Client'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/clients">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
