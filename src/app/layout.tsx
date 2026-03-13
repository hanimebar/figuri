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
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://figuri.actvli.com',
    title: 'Figuri — Monthly Financial Narratives for Accountants',
    description: 'Plain-English monthly financial narratives for small-practice accountants. In their client\'s language.',
    siteName: 'Figuri',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Figuri — Monthly Financial Narratives for Accountants',
    description: 'Plain-English monthly financial narratives. Multilingual. Dispatched in one click.',
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
