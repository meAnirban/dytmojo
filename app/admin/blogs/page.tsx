export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin, createAdminClient } from '@/lib/admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteBlogButton from '@/components/admin/DeleteBlogButton'

export default async function AdminBlogsPage() {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, published, created_at, tags')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blogs/new"
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm
            font-semibold hover:bg-green-700 transition">
          + New Post
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {blogs && blogs.length > 0 ? blogs.map((b: any) => (
          <div key={b.id}
            className="bg-white rounded-2xl border border-gray-100 p-5
              flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900">{b.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${b.published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'}`}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {format(new Date(b.created_at), 'dd MMM yyyy')}
                {b.tags?.length > 0 && (
                  <span className="ml-2">
                    {b.tags.map((t: string) => `#${t}`).join(' ')}
                  </span>
                )}
              </p>
            </div>
            <Link href={`/admin/blogs/${b.id}`}
              className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl
                text-sm font-medium hover:bg-gray-50 transition">
              Edit
            </Link>
            <DeleteBlogButton id={b.id} />
          </div>
        )) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No blog posts yet</p>
            <Link href="/admin/blogs/new"
              className="text-green-600 text-sm font-medium hover:underline">
              Write your first post →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}