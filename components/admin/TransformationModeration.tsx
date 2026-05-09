'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import StarRating from '@/components/StarRating'
import { format } from 'date-fns'

export default function TransformationModeration({ stories: initial }: { stories: any[] }) {
  const [stories, setStories] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function toggleVisibility(id: string, current: boolean) {
    setLoading(id)
    const { error } = await supabase
      .from('transformations')
      .update({ is_visible: !current })
      .eq('id', id)

    if (error) { toast.error('Failed to update'); setLoading(null); return }

    setStories(prev =>
      prev.map(s => s.id === id ? { ...s, is_visible: !current } : s)
    )
    toast.success(current ? 'Story hidden' : 'Story visible')
    setLoading(null)
  }

  async function deleteStory(id: string) {
    if (!confirm('Delete this story permanently?')) return
    setLoading(id)
    await supabase.from('transformations').delete().eq('id', id)
    setStories(prev => prev.filter(s => s.id !== id))
    toast.success('Story deleted')
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {stories.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No transformation stories yet</p>
        </div>
      )}
      {stories.map(s => (
        <div key={s.id}
          className={`bg-white rounded-2xl border p-5 transition
            ${s.is_visible ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-gray-900">
                  {s.clients?.name ?? 'Unknown Client'}
                </p>
                <StarRating rating={s.rating} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${s.is_visible
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'}`}>
                  {s.is_visible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{s.story}</p>
              <p className="text-xs text-gray-400 mt-2">
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

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggleVisibility(s.id, s.is_visible)}
                disabled={loading === s.id}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl
                  text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60">
                {loading === s.id ? '...' : s.is_visible ? '🙈 Hide' : '👁 Show'}
              </button>
              <button
                onClick={() => deleteStory(s.id)}
                disabled={loading === s.id}
                className="bg-red-50 text-red-600 border border-red-100 px-4 py-2
                  rounded-xl text-sm font-medium hover:bg-red-100 transition
                  disabled:opacity-60">
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}