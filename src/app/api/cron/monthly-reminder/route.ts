export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { currentPeriod } from '@/lib/utils'
import type { Accountant } from '@/types'

// Vercel cron: runs 8am UTC on the 5th of each month
// vercel.json: {"path": "/api/cron/monthly-reminder", "schedule": "0 8 5 * *"}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const period = currentPeriod()
  const resend = getResend()

  // Get all active accountants
  const { data: accountants } = await supabase
    .from('accountants')
    .select('*, clients(id)')
    .in('stripe_subscription_status', ['active', 'trialing'])

  if (!accountants) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const accountant of accountants) {
    const acc = accountant as Accountant & { clients: { id: string }[] }
    if (!acc.clients?.length) continue

    // Check which clients don't have a narrative for this period
    const { data: narrativeClients } = await supabase
      .from('narratives')
      .select('client_id')
      .eq('accountant_id', acc.id)
      .gte('generated_at', `${period}-01`)

    const narrativeClientIds = new Set((narrativeClients ?? []).map((n: { client_id: string }) => n.client_id))
    const missingCount = acc.clients.filter(c => !narrativeClientIds.has(c.id)).length

    if (missingCount > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: acc.email,
        subject: `📊 ${missingCount} client${missingCount !== 1 ? 's' : ''} still need${missingCount === 1 ? 's' : ''} a Figuri update`,
        html: `
          <p>Hi,</p>
          <p>It's the 5th of the month — time to send your monthly financial narratives.</p>
          <p><strong>${missingCount} client${missingCount !== 1 ? 's' : ''}</strong> haven't received a Figuri update yet this month.</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Go to Dashboard →</a></p>
          <p style="color:#64748b;font-size:12px;">You received this because you have active clients in Figuri. <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Manage notifications</a></p>
        `,
      })
      sent++
    }
  }

  return NextResponse.json({ sent, period })
}
