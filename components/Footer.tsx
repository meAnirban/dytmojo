import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forest text-cream/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <img src="/images/logo.png" alt="dytmojo" className="h-10 w-auto
              object-contain brightness-200 opacity-90 self-start" />
            <p className="text-sm text-cream/60 leading-relaxed max-w-xs">
              Personalised nutrition coaching for real, lasting transformation
              by Ankita Banerjee.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-cream font-semibold text-sm uppercase tracking-wider mb-1">
              Navigate
            </p>
            {[
              { href: '/', label: 'About' },
              { href: '/transformations', label: 'Transformations' },
              { href: '/blogs', label: 'Blogs' },
              { href: '/dytbites', label: 'Dytbites' },
              { href: '/start-your-transformation', label: 'Start Your Transformation' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-sm text-cream/60 hover:text-cream transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-cream font-semibold text-sm uppercase tracking-wider mb-1">
              Connect
            </p>
            <p className="text-sm text-cream/60">
              Have questions? Reach out directly.
            </p>
            <Link href="/start-your-transformation"
              className="mt-2 inline-block bg-terra text-white text-sm font-semibold
                px-6 py-3 rounded-full hover:bg-terra-light transition-colors
                duration-200 self-start">
              Start Your Transformation
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col md:flex-row
          items-center justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} dytmojo. All rights reserved.</p>
          <p>Made with ❤️ for your health journey</p>
        </div>
      </div>
    </footer>
  )
}
