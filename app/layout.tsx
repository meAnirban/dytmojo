import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import SessionRefresher from '@/components/SessionRefresher'

export const metadata: Metadata = {
  title: 'dytmojo — Ankita Banerjee, Dietitian',
  description: 'Personalised nutrition coaching for real, lasting transformation by Ankita Banerjee — certified dietitian.',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/icon.png', type: 'image/png' }],
    shortcut: '/icon.png',
  },
  openGraph: {
    title: 'dytmojo — Ankita Banerjee',
    description: 'Personalised nutrition coaching for real, lasting transformation.',
    url: 'https://dytmojo.com',
    siteName: 'dytmojo',
    images: [{ url: 'https://dytmojo.com/images/og-cover.jpg' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream text-ink font-body antialiased">
        <SessionRefresher />
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              background: '#2D4A3E',
              color: '#FAF7F2',
              borderRadius: '999px',
              padding: '12px 20px',
            },
          }}
        />
      </body>
    </html>
  )
}
