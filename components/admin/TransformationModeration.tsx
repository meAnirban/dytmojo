'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import StarRating from '@/components/StarRating'
import { format } from 'date-fns'
import { toggleStoryVisibility, deleteStory } from '@/lib/actions/moderateStory'

export default function TransformationModeration({ stories: initial }: { stories: any[] }) {
  const [stories, setStories] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const router                = useRouter()

  async function toggleVisibility(id: string, current: boolean) {
    setLoading(id)
    const result = await toggleStoryVisibility(id, current)

    if (!result.success) {
      toast.error('Failed to update: ' + result.error)
      setLoading(null)
      return
    }

    setStories(prev =>
      prev.map(s => s.id === id ? { ...s, is_visible: !current } : s)
    )
    toast.success(current ? 'Story hidden from public' : 'Story now visible')
    router.refresh()
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this story permanently? This cannot be undone.')) return
    setLoading(id)
    const result = await deleteStory(id)

    if (!result.success) {
      toast.error('Failed to delete: ' + result.error)
      setLoading(null)
      return
    }

    setStories(prev => prev.filter(s => s.id !== id))
    toast.success('Story deleted')
    router.refresh()
    setLoading(null)
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <p className="text-gray-400 text-sm">No transformation stories yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {stories.map(s => (
        <div key={s.id}
          className={`bg-white rounded-2xl border p-5 transition-all
            ${s.is_visible ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
          <div className="flex flex-col md:flex-row md:items-start
            justify-between gap-4">

            <div className="flex-1">
              {/* Header row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-gray-900">
                  {
                    s.clients?.name ?? 'Unknown Client'
                  }
                </p>
                {s.is_anonymous && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5
                    rounded-full font-medium">
                    Anonymous
                  </span>
                )}
                <StarRating rating={s.rating} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${s.is_visible
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'}`}>
                  {s.is_visible ? 'Visible' : 'Hidden'}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 mb-2">{s.story}</p>
              <p className="text-xs text-gray-400">
                {format(new Date(s.date), 'dd MMM yyyy')}
              </p>

              {/* Images */}
              {(s.before_image_url || s.after_image_url) && (
                <div className="flex gap-2 mt-3">
                  {s.before_image_url && (
                    <img src={s.before_image_url} alt="Before"
                      className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  {s.after_image_url && (
                    <img src={s.after_image_url} alt="After"
                      className="w-20 h-20 object-cover rounded-lg" />
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggleVisibility(s.id, s.is_visible)}
                disabled={loading === s.id}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl
                  text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60">
                {loading === s.id ? '...' : s.is_visible ? '🙈 Hide' : '👁 Show'}
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={loading === s.id}
                className="bg-red-50 text-red-600 border border-red-100 px-4 py-2
                  rounded-xl text-sm font-medium hover:bg-red-100 transition
                  disabled:opacity-60">
                {loading === s.id ? '...' : '🗑 Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}