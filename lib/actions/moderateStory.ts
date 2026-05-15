'use server'
import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return [] }, setAll() {} } }
  )
}

export async function toggleStoryVisibility(id: string, currentVisibility: boolean) {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from('transformations')
    .update({ is_visible: !currentVisibility })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/transformations', 'layout')
  revalidatePath('/transformations', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteStory(id: string) {
  const supabase = getServiceClient()

  // Delete images from storage first if they exist
  const { data: story } = await supabase
    .from('transformations')
    .select('before_image_url, after_image_url')
    .eq('id', id)
    .single()

  if (story) {
    const urlsToDelete = [story.before_image_url, story.after_image_url]
      .filter(Boolean)
      .map((url: string) => {
        // Extract path from full URL
        const parts = url.split('/transformations/')
        return parts[1] ?? null
      })
      .filter(Boolean)

    if (urlsToDelete.length > 0) {
      await supabase.storage
        .from('transformations')
        .remove(urlsToDelete)
    }
  }

  const { error } = await supabase
    .from('transformations')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/transformations', 'layout')
  revalidatePath('/transformations', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}