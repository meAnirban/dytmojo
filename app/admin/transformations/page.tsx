import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import TransformationModeration from '@/components/admin/TransformationModeration'

export default async function AdminTransformationsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: stories } = await supabase
    .from('transformations')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Transformation Stories</h1>
      <TransformationModeration stories={stories ?? []} />
    </div>
  )
}