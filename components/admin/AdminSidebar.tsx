'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/clients', label: 'Client Requests', icon: '👥' },
  { href: '/admin/transformations', label: 'Transformations', icon: '✨' },
  { href: '/admin/blogs', label: 'Blog Posts', icon: '✍️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin-login')   // ← changed from /admin/login
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-100 min-h-screen flex flex-col
      sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <p className="font-bold text-gray-900 text-lg">DytMojo</p>
        <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition ${
                pathname === link.href
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm
            font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}