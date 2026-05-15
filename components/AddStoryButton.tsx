'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { submitStory } from '@/lib/actions/submitStory'

export default function AddStoryButton({ clientId }: { clientId: string }) {
  const [open, setOpen]             = useState(false)
  const [story, setStory]           = useState('')
  const [rating, setRating]         = useState(5)
  const [isAnonymous, setIsAnonymous] = useState(false)  // ← new
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile]   = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const supabase                    = createClient()

  async function uploadImage(file: File, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('transformations')
      .upload(path, file, { upsert: true })
    if (error) { console.error('Upload error:', error); return null }
    const { data: urlData } = supabase.storage
      .from('transformations').getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function handleSubmit() {
    if (!story.trim()) { toast.error('Please write your story'); return }
    setSubmitting(true)

    try {
      const timestamp = Date.now()
      let beforeUrl: string | null = null
      let afterUrl:  string | null = null

      if (beforeFile) {
        beforeUrl = await uploadImage(beforeFile, `${clientId}/before_${timestamp}`)
        if (!beforeUrl) { toast.error('Failed to upload before photo'); setSubmitting(false); return }
      }
      if (afterFile) {
        afterUrl = await uploadImage(afterFile, `${clientId}/after_${timestamp}`)
        if (!afterUrl) { toast.error('Failed to upload after photo'); setSubmitting(false); return }
      }

      const result = await submitStory({
        clientId, story, rating, beforeUrl, afterUrl,
        isAnonymous,   // ← pass to server action
      })

      if (!result.success) {
        toast.error('Failed to submit: ' + result.error)
        setSubmitting(false)
        return
      }

      toast.success('Story submitted successfully!')
      setOpen(false)
      setStory('')
      setRating(5)
      setIsAnonymous(false)
      setBeforeFile(null)
      setAfterFile(null)

    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-forest text-cream px-8 py-3 rounded-full font-semibold
          hover:bg-forest-light transition-all duration-200 shadow-md hover:shadow-lg">
        + Add My Transformation Story
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[90vh]
            overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

            <h2 className="font-display text-2xl text-forest mb-6">
              Share Your Transformation
            </h2>

            <div className="flex flex-col gap-5">

              {/* Story */}
              <div>
                <label className="text-sm font-semibold text-forest mb-1.5 block">
                  Your Story *
                </label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="How has working with Ankita changed your life?"
                  rows={5}
                  className="w-full border border-cream-darker rounded-2xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-forest/30
                    resize-none text-ink"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-semibold text-forest mb-2 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)}
                      className={`text-3xl transition-transform hover:scale-110
                        ${s <= rating ? 'text-gold' : 'text-cream-darker'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between bg-cream rounded-2xl
                border border-cream-darker px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-forest">
                    Post anonymously
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Your name will show as "Anonymous" to the public
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative w-12 h-6 rounded-full transition-colors
                    duration-200 shrink-0 ${
                      isAnonymous ? 'bg-forest' : 'bg-cream-darker'
                    }`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full
                    shadow transition-transform duration-200 ${
                      isAnonymous ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                </button>
              </div>

              {/* Preview of name */}
              <p className="text-xs text-ink-muted -mt-2 px-1">
                Your story will appear as:{' '}
                <strong className="text-forest">
                  {isAnonymous ? 'Anonymous' : 'Your Name'}
                </strong>
              </p>

              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-forest mb-1.5 block">
                    Before Photo
                  </label>
                  <input type="file" accept="image/*"
                    onChange={e => setBeforeFile(e.target.files?.[0] ?? null)}
                    className="text-xs text-ink-muted w-full file:mr-3 file:py-1.5
                      file:px-3 file:rounded-full file:border-0 file:text-xs
                      file:font-semibold file:bg-forest-pale file:text-forest
                      hover:file:bg-sage-pale cursor-pointer" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-forest mb-1.5 block">
                    After Photo
                  </label>
                  <input type="file" accept="image/*"
                    onChange={e => setAfterFile(e.target.files?.[0] ?? null)}
                    className="text-xs text-ink-muted w-full file:mr-3 file:py-1.5
                      file:px-3 file:rounded-full file:border-0 file:text-xs
                      file:font-semibold file:bg-forest-pale file:text-forest
                      hover:file:bg-sage-pale cursor-pointer" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setOpen(false)}
                  className="flex-1 border border-cream-darker text-ink-soft py-3
                    rounded-full text-sm font-medium hover:bg-cream transition">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  disabled={submitting || !story.trim()}
                  className="flex-1 bg-forest text-cream py-3 rounded-full text-sm
                    font-semibold hover:bg-forest-light transition disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Story →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}