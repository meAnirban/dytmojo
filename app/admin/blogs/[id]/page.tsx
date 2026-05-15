export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin, createAdminClient } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import BlogEditor from '@/components/admin/BlogEditor'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditBlogPage({ params }: Props) {
  await requireAdmin()

  const { id } = await params

  const supabase = createAdminClient()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (!blog) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
      <BlogEditor initialData={blog} />
    </div>
  )
}