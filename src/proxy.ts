import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

function buildNoncedCSP(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://api.resend.com",
    "frame-ancestors 'none'",
  ].join('; ')
}

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildNoncedCSP(nonce)

  // Forward nonce to the layout via request header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  let response: NextResponse

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    response = NextResponse.next({ request: { headers: requestHeaders } })
  } else {
    try {
      const modifiedRequest = new NextRequest(request.url, { headers: requestHeaders, method: request.method })
      response = await updateSession(modifiedRequest)
    } catch {
      response = NextResponse.next({ request: { headers: requestHeaders } })
    }
  }

  response.headers.set('Content-Security-Policy', csp)
  return response
}

// Only run on routes that need auth or nonce-based CSP.
// Public marketing pages (/, /pricing, /example, /privacy, /terms)
// are excluded — they load static assets and need no auth check.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding',
    '/auth/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/api/:path*',
  ],
}
