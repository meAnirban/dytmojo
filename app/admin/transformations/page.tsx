export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin, createAdminClient } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import TransformationModeration from '@/components/admin/TransformationModeration'

export default async function AdminTransformationsPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: stories } = await supabase
    .from('transformations')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  // console.log('stories', stories)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Transformation Stories</h1>
      <TransformationModeration stories={stories ?? []} />
    </div>
  )
}