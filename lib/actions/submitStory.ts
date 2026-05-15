'use server'
import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

export async function submitStory({
  clientId, story, rating, beforeUrl, afterUrl, isAnonymous,
}: {
  clientId:    string
  story:       string
  rating:      number
  beforeUrl:   string | null
  afterUrl:    string | null
  isAnonymous: boolean          // ← new
}) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return [] }, setAll() {} } }
  )

  // Verify client exists
  const { data: client, error: clientError } = await supabase
    .from('clients').select('id').eq('id', clientId).single()
  if (clientError || !client) {
    return { success: false, error: 'Client not found or not approved' }
  }

  // Block duplicate stories
  const { data: existing } = await supabase
    .from('transformations').select('id').eq('client_id', clientId).limit(1).single()
  if (existing) {
    return { success: false, error: 'You have already submitted a story.' }
  }

  const { error } = await supabase
    .from('transformations')
    .insert({
      client_id:        clientId,
      story,
      rating,
      before_image_url: beforeUrl,
      after_image_url:  afterUrl,
      is_anonymous:     isAnonymous,   // ← new
      date:             new Date().toISOString().split('T')[0],
      is_visible:       true,
    })

  if (error) { console.error('Insert error:', error); return { success: false, error: error.message } }

  revalidatePath('/transformations')
  revalidatePath('/admin/transformations')
  revalidatePath('/')
  return { success: true }
}