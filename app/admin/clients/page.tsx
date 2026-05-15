export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin, createAdminClient } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import ClientActions from '@/components/admin/ClientActions'
import { format } from 'date-fns'

export default async function AdminClientsPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: requests } = await supabase
    .from('consultation_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const grouped = {
    pending: requests?.filter(r => r.status === 'pending') ?? [],
    approved: requests?.filter(r => r.status === 'approved') ?? [],
    declined: requests?.filter(r => r.status === 'declined') ?? [],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Client Requests</h1>

      {/* Tabs rendered client-side via ClientActions */}
      <ClientActions grouped={grouped} />
    </div>
  )
}