import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/admin'           // ← add this
import TransformationCard from '@/components/TransformationCard'
import AddStoryButton from '@/components/AddStoryButton'
import ClientLoginButton from '@/components/ClientLoginButton'
import Link from 'next/link'

export default async function TransformationsPage() {
  const supabase      = await createClient()
  const adminSupabase = createAdminClient()

  const { data: transformations } = await adminSupabase
    .from('transformations')
    .select('*, clients(name)')
    .eq('is_visible', true)
    .order('date', { ascending: false })
    .limit(50)

  const { data: { user } } = await supabase.auth.getUser()

  let isApprovedClient  = false
  let clientId: string | null = null
  let hasExistingStory  = false           // ← add this

  // console.log('Current user name:', transformations)
  // console.log('Is approved client:', isApprovedClient)

  if (user?.email) {
    const { data: client } = await adminSupabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .single()

    if (client) {
      isApprovedClient = true
      clientId = client.id

      // ← Check if they already submitted a story
      const { data: existingStory } = await adminSupabase
        .from('transformations')
        .select('id')
        .eq('client_id', client.id)
        .limit(1)
        .single()

      if (existingStory) hasExistingStory = true
    }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero — stays exactly the same */}
      <section className="bg-forest pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #FAF7F2 1px, transparent 1px)',
                   backgroundSize: '24px 24px' }} />
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full
          bg-forest-light opacity-30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs text-sage font-bold tracking-widest uppercase
            border border-sage/30 rounded-full px-4 py-1.5 mb-6">
            Real Results
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-cream mb-5 leading-tight">
            Transformation
            <span className="italic text-gold"> Stories</span>
          </h1>
          <p className="text-cream/60 text-lg max-w-xl mx-auto leading-relaxed">
            Every story here is from a verified client who worked with Ankita.
            Real people, real results, real life.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        {/* ── CLIENT BANNER ── */}
        {isApprovedClient && clientId ? (
          hasExistingStory ? (
            // ← Already posted — show thank you message instead of button
            <div className="bg-forest-pale border border-sage/30 rounded-3xl p-6
              flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-forest flex items-center
                justify-center text-xl shrink-0">✅</div>
              <div>
                <p className="font-semibold text-forest mb-0.5">
                  Thank you for sharing your story!
                </p>
                <p className="text-ink-soft text-sm">
                  Your transformation story has been submitted. Each client can
                  share one story. We appreciate you inspiring others!
                </p>
              </div>
            </div>
          ) : (
            // ← Has not posted yet — show Add Story button
            <div className="flex justify-center mb-12">
              <AddStoryButton clientId={clientId} />
            </div>
          )
        ) : (
          // ← Not a client — show join / login options
          <div className="bg-forest-pale border border-sage/30 rounded-3xl p-6
            flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <p className="font-semibold text-forest mb-1">
                Want to share your story?
              </p>
              <p className="text-ink-soft text-sm">
                {user
                  ? 'Your account is pending dietitian approval. You will be notified soon.'
                  : 'Already a client? Log in to share your transformation story.'
                }
              </p>
            </div>
            {!user && (
              <div className="flex gap-3 shrink-0">
                <ClientLoginButton />
                <Link href="/get-consultation"
                  className="bg-forest text-cream font-semibold px-6 py-3
                    rounded-full hover:bg-forest-light transition-all duration-200
                    shadow-sm hover:shadow-md text-sm">
                  New? Join Now →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Grid — stays exactly the same */}
        {transformations && transformations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformations.map((t: any) => (
              <TransformationCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-3xl bg-white border-2 border-dashed
            border-cream-darker">
            <p className="text-5xl mb-4">🌱</p>
            <p className="font-display text-2xl text-forest mb-2">Stories coming soon</p>
            <p className="text-ink-muted text-sm">Be the first to share your journey.</p>
          </div>
        )}
      </section>
    </div>
  )
}