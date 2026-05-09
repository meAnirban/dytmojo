'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="dytmojo"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-green-700">About</Link>
          <Link href="/dytbites" className="hover:text-green-700">Dytbites</Link>
          <Link href="/transformations" className="hover:text-green-700">Transformations</Link>
          <Link href="/blogs" className="hover:text-green-700">Blogs</Link>
          <Link href="/start-your-transformation"
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
            Start Your Transformation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-3 text-sm font-medium text-gray-600 bg-white border-t">
          <Link href="/" onClick={() => setOpen(false)}>About</Link>
          <Link href="/dytbites" onClick={() => setOpen(false)}>Dytbites</Link>
          <Link href="/transformations" onClick={() => setOpen(false)}>Transformations</Link>
          <Link href="/blogs" onClick={() => setOpen(false)}>Blogs</Link>
          <Link href="/start-your-transformation" onClick={() => setOpen(false)}
            className="bg-green-600 text-white px-4 py-2 rounded-full text-center">
            Start Your Transformation
          </Link>
        </div>
      )}
    </nav>
  )
}