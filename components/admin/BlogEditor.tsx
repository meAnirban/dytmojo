'use client'
import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

type BlogEditorProps = {
  initialData?: {
    id?: string
    title?: string
    slug?: string
    content?: string
    tags?: string[]
    published?: boolean
    cover_image_url?: string
  }
}

export default function BlogEditor({ initialData = {} }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData.title ?? '')
  const [tags, setTags] = useState(initialData.tags?.join(', ') ?? '')
  const [published, setPublished] = useState(initialData.published ?? false)
  const [coverUrl, setCoverUrl] = useState(initialData.cover_image_url ?? '')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData.content ?? '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[400px] focus:outline-none p-4',
      },
    },
  })

  async function save(publishOverride?: boolean) {
    if (!title.trim()) { toast.error('Title is required'); return }
    if (!editor) return
    setSaving(true)

    const slug = initialData.slug ?? slugify(title)
    const content = editor.getHTML()
    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean)
    const shouldPublish = publishOverride ?? published

    const payload = {
      title,
      slug,
      content,
      tags: tagsArr,
      published: shouldPublish,
      cover_image_url: coverUrl || null,
    }

    let error
    if (initialData.id) {
      ({ error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', initialData.id))
    } else {
      ({ error } = await supabase.from('blogs').insert(payload))
    }

    setSaving(false)
    if (error) {
      toast.error('Failed to save: ' + error.message)
      return
    }

    toast.success(shouldPublish ? 'Published!' : 'Saved as draft')
    router.push('/admin/blogs')
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      {/* Title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Blog post title..."
        className="w-full text-3xl font-bold text-gray-900 border-0 border-b border-gray-200
          pb-4 mb-6 focus:outline-none focus:border-green-400"
      />

      {/* Cover image URL */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Cover Image URL (optional)
        </label>
        <input
          value={coverUrl}
          onChange={e => setCoverUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Tags (comma separated)
        </label>
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="recipes, tips, weight-loss"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1.5 mb-2 p-3 bg-gray-50 rounded-t-xl
        border border-gray-200 border-b-0">
        {[
          { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
          { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
          { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
          { label: '• List', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
          { label: '1. List', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
          { label: '❝ Quote', action: () => editor?.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote') },
          { label: '— HR', action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
        ].map(btn => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
              ${btn.active
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editor area */}
      <div className="border border-gray-200 rounded-b-xl mb-8 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Save / Publish buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => save(false)}
          disabled={saving}
          className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl
            text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60">
          {saving ? 'Saving...' : '💾 Save Draft'}
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm
            font-semibold hover:bg-green-700 transition disabled:opacity-60">
          {saving ? 'Publishing...' : '🚀 Publish'}
        </button>
        <button
          onClick={() => router.push('/admin/blogs')}
          className="text-sm text-gray-400 hover:text-gray-600 px-4">
          Cancel
        </button>
      </div>
    </div>
  )
}