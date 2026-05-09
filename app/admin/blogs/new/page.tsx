import { requireAdmin } from '@/lib/admin'
import BlogEditor from '@/components/admin/BlogEditor'

export default async function NewBlogPage() {
  await requireAdmin()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Blog Post</h1>
      <BlogEditor />
    </div>
  )
}