export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { formatPeriod } from '@/lib/utils'
import type { Narrative, MonthlyFigures, Client, Accountant } from '@/types'

function buildEmailHtml(params: {
  narrative: string
  clientName: string
  period: string
  accountantName: string
  logoUrl?: string | null
  bookingUrl?: string | null
  replyToEmail: string
}): string {
  const bookingSection = params.bookingUrl
    ? `<tr><td style="padding:24px 40px 32px;text-align:center;border-top:1px solid #e2e8f0;">
         <a href="${params.bookingUrl}" style="color:#059669;text-decoration:none;font-size:14px;">
           Have questions about these figures? <strong>Book a 20-minute review call →</strong>
         </a>
       </td></tr>`
    : ''

  const logo = params.logoUrl
    ? `<img src="${params.logoUrl}" alt="${params.accountantName}" style="height:40px;max-width:200px;object-fit:contain;" />`
    : `<span style="font-size:18px;font-weight:700;color:#059669;">${params.accountantName}</span>`

  const paragraphs = params.narrative
    .split('\n')
    .filter(p => p.trim())
    .map(p => `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#1e293b;">${p}</p>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${params.period} Financial Update</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="padding:28px 40px;background:linear-gradient(135deg,#064e3b 0%,#059669 100%);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:white;">${logo}</td>
              <td align="right" style="color:rgba(255,255,255,0.8);font-size:13px;">Financial Update</td>
            </tr>
          </table>
        </td></tr>
        <!-- Subject line -->
        <tr><td style="padding:28px 40px 0;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Monthly Report</p>
          <h1 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0f172a;">${params.period}</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Dear ${params.clientName},</p>
        </td></tr>
        <!-- Narrative body -->
        <tr><td style="padding:28px 40px;">${paragraphs}</td></tr>
        <!-- Signature -->
        <tr><td style="padding:0 40px 28px;border-top:1px solid #f1f5f9;">
          <p style="margin:16px 0 4px;font-size:14px;color:#64748b;">Kind regards,</p>
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${params.accountantName}</p>
        </td></tr>
        <!-- Booking link -->
        ${bookingSection}
        <!-- Footer -->
        <tr><td style="padding:20px 40px;background:#f8fafc;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">
            Sent via <a href="https://figuri.actvli.com" style="color:#059669;text-decoration:none;">Figuri</a> by ${params.accountantName} ·
            <a href="mailto:${params.replyToEmail}" style="color:#059669;text-decoration:none;">Reply to ${params.replyToEmail}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { narrative_id } = await request.json()
    if (!narrative_id) return NextResponse.json({ error: 'narrative_id required' }, { status: 400 })

    // Load all required data
    const [narrativeRes, accountantRes] = await Promise.all([
      supabase.from('narratives').select('*, clients(*), monthly_figures(*)').eq('id', narrative_id).eq('accountant_id', user.id).single(),
      supabase.from('accountants').select('*').eq('id', user.id).single(),
    ])

    if (!narrativeRes.data || !accountantRes.data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 })
    }

    const narrative = narrativeRes.data as Narrative & { clients: Client; monthly_figures: MonthlyFigures }
    const accountant = accountantRes.data as Accountant

    if (narrative.status === 'sent') {
      return NextResponse.json({ error: 'Narrative already sent' }, { status: 400 })
    }

    const client = narrative.clients
    const figures = narrative.monthly_figures

    // Determine booking URL
    const bookingUrl = client.booking_link_url || accountant.default_booking_link_url || null

    // Build and send email
    const resend = getResend()
    const period = formatPeriod(figures.period_month)
    const html = buildEmailHtml({
      narrative: narrative.body_text,
      clientName: client.name,
      period,
      accountantName: accountant.business_name || accountant.email,
      logoUrl: accountant.logo_url,
      bookingUrl,
      replyToEmail: accountant.reply_to_email || accountant.email,
    })

    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: client.email,
      replyTo: accountant.reply_to_email || accountant.email,
      subject: `${period} Financial Update — ${client.name}`,
      html,
    })

    if (sendError) throw sendError

    // Mark as sent
    const serviceClient = await createServiceClient()
    await serviceClient.from('narratives').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      booking_link_included: !!bookingUrl,
    }).eq('id', narrative_id)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('send-narrative error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Send failed' },
      { status: 500 }
    )
  }
}
