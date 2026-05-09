import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import BlogEditor from '@/components/admin/BlogEditor'
import { notFound } from 'next/navigation'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const supabase = await createClient()
  const { id } = await params

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