'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SessionRefresher() {
  const supabase = createClient()

  useEffect(() => {
    // Refresh session on mount
    supabase.auth.getSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Session refreshed')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return null
}