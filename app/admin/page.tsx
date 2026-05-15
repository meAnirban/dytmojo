export const dynamic = 'force-dynamic'  // ← add this line at the top
export const revalidate = 0

import { requireAdmin, createAdminClient } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  // Fetch counts in parallel
  const [
    { count: pendingCount },
    { count: clientCount },
    { count: storyCount },
    { count: blogCount },
  ] = await Promise.all([
    supabase.from('consultation_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('transformations').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('published', true),
  ])

  // Recent pending requests
  const { data: recentRequests } = await supabase
    .from('consultation_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Pending Requests', value: pendingCount ?? 0, icon: '⏳', href: '/admin/clients', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Approved Clients', value: clientCount ?? 0, icon: '✅', href: '/admin/clients', color: 'bg-green-50 text-green-700' },
    { label: 'Transformation Stories', value: storyCount ?? 0, icon: '✨', href: '/admin/transformations', color: 'bg-blue-50 text-blue-700' },
    { label: 'Published Blogs', value: blogCount ?? 0, icon: '📝', href: '/admin/blogs', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Good morning! 👋</h1>
      <p className="text-gray-500 mb-8">Here's what's happening on dytmojo today.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md
              transition flex flex-col gap-2">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent pending requests */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Recent Pending Requests</h2>
          <Link href="/admin/clients"
            className="text-sm text-green-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {recentRequests && recentRequests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentRequests.map((r: any) => (
              <div key={r.id}
                className="flex items-center justify-between p-4 bg-gray-50
                  rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-gray-800">{r.name}</p>
                  <p className="text-gray-400">{r.email} · {r.phone}</p>
                </div>
                <Link href="/admin/clients"
                  className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs
                    font-medium hover:bg-green-700 transition">
                  Review
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-6">
            No pending requests 🎉
          </p>
        )}
      </div>
    </div>
  )
}