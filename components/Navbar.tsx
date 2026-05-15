'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const links = [
  { href: '/',               label: 'About' },
  { href: '/dytbites',       label: 'Dytbites' },
  { href: '/transformations',label: 'Transformations' },
  { href: '/blogs',           label: 'Blogs' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname              = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-cream-darker'
            : 'bg-transparent'
        }`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/images/logo.png"
              alt="dytmojo"
              className="h-10 w-auto object-contain transition-opacity
                group-hover:opacity-80 duration-200"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors duration-200
                  relative after:absolute after:bottom-[-4px] after:left-0
                  after:h-[2px] after:bg-terra after:transition-all after:duration-200
                  ${pathname === l.href
                    ? 'text-forest after:w-full'
                    : 'text-ink-soft hover:text-forest after:w-0 hover:after:w-full'
                  }`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/start-your-transformation"
              className="bg-forest text-cream text-sm font-semibold px-5 py-2.5
                rounded-full hover:bg-forest-light transition-all duration-200
                shadow-sm hover:shadow-md hover:-translate-y-0.5
                active:translate-y-0">
              Start Your Transformation
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center
              gap-1.5 rounded-xl hover:bg-cream-dark transition-colors duration-200"
            aria-label="Toggle menu">
            <span className={`w-5 h-0.5 bg-forest transition-all duration-300 ${
              open ? 'rotate-45 translate-y-2' : ''
            }`} />
            <span className={`w-5 h-0.5 bg-forest transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`} />
            <span className={`w-5 h-0.5 bg-forest transition-all duration-300 ${
              open ? '-rotate-45 -translate-y-2' : ''
            }`} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity
            duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-cream shadow-2xl
          transition-transform duration-300 flex flex-col pt-24 px-6 pb-8
          ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <nav className="flex flex-col gap-2">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium py-3 px-4 rounded-xl transition-colors
                  duration-200 ${
                    pathname === l.href
                      ? 'bg-forest text-cream'
                      : 'text-ink-soft hover:bg-cream-dark hover:text-forest'
                  }`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link
              href="/start-your-transformation"
              onClick={() => setOpen(false)}
              className="block w-full bg-forest text-cream text-center font-semibold
                py-3.5 rounded-full hover:bg-forest-light transition-colors duration-200">
              Start Your Transformation
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
