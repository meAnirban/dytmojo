'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { deleteBlog } from '@/lib/actions/deleteAdminBlog'

export default function DeleteBlogButton({
  id,
}: {
  id: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    const confirmed = confirm(
      'Delete this blog post permanently?'
    )

    if (!confirmed) return

    startTransition(async () => {
      const result = await deleteBlog(id)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Blog deleted')

      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="bg-red-50 text-red-600 border border-red-100
        px-4 py-2 rounded-xl text-sm font-medium
        hover:bg-red-100 transition disabled:opacity-60"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}