import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'dytmojo — Ankita Banerjee',
  description: 'Personalised nutrition and transformation coaching',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900`}>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}