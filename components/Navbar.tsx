'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/',                label: 'About'           },
  { href: '/dytbites',        label: 'Dytbites'        },
  { href: '/transformations', label: 'Transformations' },
  { href: '/blogs',           label: 'Blogs'           },
]

export default function Navbar() {
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname                  = usePathname()
  const supabase                  = createClient()

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Session tracking
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
    })

    // Listen for login / logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUserEmail(session?.user?.email ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUserEmail(null)
    window.location.reload()
  }

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

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">

            {/* Logged-in client pill */}
            {userEmail && (
              <div className="flex items-center gap-2 bg-forest-pale border
                border-sage/30 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-sage shrink-0" />
                <span className="text-xs text-forest font-medium truncate max-w-[140px]">
                  {userEmail}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="text-xs text-ink-muted hover:text-terra
                    transition-colors duration-200 ml-1 shrink-0">
                  ✕
                </button>
              </div>
            )}

            <Link
              href="/start-your-transformation"
              className="bg-forest text-cream text-sm font-semibold px-5 py-2.5
                rounded-full hover:bg-forest-light transition-all duration-200
                shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
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

          <div className="mt-auto flex flex-col gap-3">
            {/* Mobile session indicator */}
            {userEmail && (
              <div className="flex items-center justify-between bg-forest-pale
                border border-sage/30 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-sage shrink-0" />
                  <span className="text-xs text-forest font-medium truncate">
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-terra font-semibold ml-2 shrink-0
                    hover:underline">
                  Sign out
                </button>
              </div>
            )}

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
