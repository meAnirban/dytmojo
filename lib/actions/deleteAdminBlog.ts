'use server'

import { createAdminClient, requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

export async function deleteBlog(id: string) {
  await requireAdmin()

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/admin/blogs')
  revalidatePath('/blogs')

  return {
    success: true,
  }
}