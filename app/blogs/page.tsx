import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, tags, cover_image_url, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Blogs</h1>
          <p className="text-gray-500">
            Healthy tips, recipes, and nutrition science — by your dietitian.
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog: any) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                  hover:shadow-md transition group">
                {blog.cover_image_url && (
                  <img src={blog.cover_image_url} alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105
                      transition duration-300" />
                )}
                <div className="p-6">
                  <p className="text-xs text-gray-400 mb-2">
                    {format(new Date(blog.created_at), 'dd MMM yyyy')}
                  </p>
                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3
                    group-hover:text-green-700 transition">
                    {blog.title}
                  </h2>
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.map((tag: string) => (
                        <span key={tag}
                          className="text-xs bg-green-50 text-green-700 px-2.5 py-1
                            rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Blog posts coming soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}