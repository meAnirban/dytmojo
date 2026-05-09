import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!blog) notFound()

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link href="/blog"
          className="text-sm text-green-600 hover:underline font-medium mb-8 block">
          ← Back to Blog
        </Link>

        {/* Cover */}
        {blog.cover_image_url && (
          <img src={blog.cover_image_url} alt={blog.title}
            className="w-full h-64 object-cover rounded-2xl mb-8" />
        )}

        {/* Header */}
        <p className="text-sm text-gray-400 mb-3">
          {format(new Date(blog.created_at), 'dd MMMM yyyy')}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag: string) => (
              <span key={tag}
                className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full
                  font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-100 mb-8" />

        {/* Content */}
        <div
          className="prose prose-gray max-w-none prose-headings:font-bold
            prose-a:text-green-600 prose-blockquote:border-green-400
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* CTA at bottom of every post */}
        <div className="mt-16 bg-green-50 rounded-2xl p-8 text-center">
          <h3 className="font-bold text-gray-900 text-xl mb-2">
            Want personalised nutrition advice?
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            Book a consultation and get a plan built just for you.
          </p>
          <Link href="/get-consultation"
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold
              hover:bg-green-700 transition">
            Get Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}