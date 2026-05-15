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

type SaveBlogPayload = {
  id?: string
  title: string
  slug: string
  content: string
  tags: string[]
  published: boolean
  cover_image_url?: string | null
}

export async function saveBlog(payload: SaveBlogPayload) {

  const supabase = getServiceClient()

  if (payload.id) {
    const { error } = await supabase
      .from('blogs')
      .update({
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        tags: payload.tags,
        published: payload.published,
        cover_image_url: payload.cover_image_url,
      })
      .eq('id', payload.id)

    if (error) {
      throw new Error(error.message)
    }

    return
  }

  const { error } = await supabase
    .from('blogs')
    .insert({
      title: payload.title,
      slug: payload.slug,
      content: payload.content,
      tags: payload.tags,
      published: payload.published,
      cover_image_url: payload.cover_image_url,
    })

  if (error) {
    throw new Error(error.message)
  }
}

export async function approveClient(requestId: string, email: string, name: string, phone: string) {
  const supabase = getServiceClient()

  const { error: updateError } = await supabase
    .from('consultation_requests')
    .update({ status: 'approved' })
    .eq('id', requestId)

  if (updateError) return { success: false, error: updateError.message }

  const { error: clientError } = await supabase
    .from('clients')
    .insert({ consultation_id: requestId, email, name, phone })

  if (clientError && !clientError.message.includes('duplicate')) {
    return { success: false, error: clientError.message }
  }

  revalidatePath('/admin', 'layout')           // ← refreshes overview counts
  revalidatePath('/admin/clients', 'layout')   // ← refreshes client list
  return { success: true }
}

export async function declineClient(requestId: string) {
  const supabase = getServiceClient()

  const { error } = await supabase
    .from('consultation_requests')
    .update({ status: 'declined' })
    .eq('id', requestId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin', 'layout')
  revalidatePath('/admin/clients', 'layout')
  return { success: true }
}

export async function restoreClient(requestId: string) {
  const supabase = getServiceClient()

  const { error: deleteError } = await supabase
    .from('clients')
    .delete()
    .eq('consultation_id', requestId)

  if (deleteError) return { success: false, error: deleteError.message }

  const { error: updateError } = await supabase
    .from('consultation_requests')
    .update({ status: 'pending' })
    .eq('id', requestId)

  if (updateError) return { success: false, error: updateError.message }

  revalidatePath('/admin', 'layout')
  revalidatePath('/admin/clients', 'layout')
  return { success: true }
}

