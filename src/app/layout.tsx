import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Figuri — Monthly Financial Narratives for Accountants',
    template: '%s | Figuri',
  },
  description:
    'Turn your client\'s monthly figures into a clear, friendly financial narrative in seconds. Multilingual, branded, and dispatched in one click.',
  keywords: ['accountant software', 'financial narrative', 'client communication', 'accountancy', 'management accounts'],
  authors: [{ name: 'Äctvli Responsible Consulting' }],
  creator: 'Äctvli Responsible Consulting',
  metadataBase: new URL('https://figuri.actvli.com'),
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://figuri.actvli.com',
    title: 'Figuri — Monthly Financial Narratives for Accountants',
    description: 'Plain-English monthly financial narratives for small-practice accountants. In their client\'s language.',
    siteName: 'Figuri',
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630, alt: 'Figuri — Monthly Financial Narratives for Accountants' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Figuri — Monthly Financial Narratives for Accountants',
    description: 'Plain-English monthly financial narratives. Multilingual. Dispatched in one click.',
    images: ['/brand/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
