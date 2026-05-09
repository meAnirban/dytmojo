'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AddStoryButton({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)
  const [story, setStory] = useState('')
  const [rating, setRating] = useState(5)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  async function uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('transformations')
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data: urlData } = supabase.storage
      .from('transformations')
      .getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function handleSubmit() {
    if (!story.trim()) { toast.error('Please write your story'); return }
    setSubmitting(true)

    let beforeUrl = null
    let afterUrl = null
    const timestamp = Date.now()

    if (beforeFile) {
      beforeUrl = await uploadImage(beforeFile, `${clientId}/before_${timestamp}`)
    }
    if (afterFile) {
      afterUrl = await uploadImage(afterFile, `${clientId}/after_${timestamp}`)
    }

    const { error } = await supabase.from('transformations').insert({
      client_id: clientId,
      story,
      rating,
      before_image_url: beforeUrl,
      after_image_url: afterUrl,
      date: new Date().toISOString().split('T')[0],
    })

    setSubmitting(false)
    if (error) { toast.error('Failed to submit. Try again.'); return }

    toast.success('Story submitted! It will appear once reviewed.')
    setOpen(false)
    setStory('')
    setRating(5)
    setBeforeFile(null)
    setAfterFile(null)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold
          hover:bg-green-700 transition shadow-md">
        + Add My Transformation Story
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Share Your Transformation</h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Your Story
                </label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="How has working with the dietitian changed your life?"
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)}
                      className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Before Photo (optional)
                  </label>
                  <input type="file" accept="image/*"
                    onChange={e => setBeforeFile(e.target.files?.[0] ?? null)}
                    className="text-sm text-gray-500 w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    After Photo (optional)
                  </label>
                  <input type="file" accept="image/*"
                    onChange={e => setAfterFile(e.target.files?.[0] ?? null)}
                    className="text-sm text-gray-500 w-full" />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-sm
                    font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm
                    font-semibold hover:bg-green-700 transition disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Story'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}