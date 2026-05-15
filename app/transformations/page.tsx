import { createClient } from '@/lib/supabase/server'
import TransformationCard from '@/components/TransformationCard'
import AddStoryButton from '@/components/AddStoryButton'
import Link from 'next/link'

export default async function TransformationsPage() {
  const supabase = await createClient()

  const { data: transformations } = await supabase
    .from('transformations')
    .select('*, clients(name)')
    .eq('is_visible', true)
    .order('date', { ascending: false })
    .limit(50)

  const { data: { user } } = await supabase.auth.getUser()
  let isApprovedClient = false
  let clientId: string | null = null

  if (user?.email) {
    const { data: client } = await supabase
      .from('clients').select('id').eq('email', user.email).single()
    if (client) { isApprovedClient = true; clientId = client.id }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
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

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        {/* Client CTA / Add story */}
        {isApprovedClient && clientId ? (
          <div className="flex justify-center mb-12">
            <AddStoryButton clientId={clientId} />
          </div>
        ) : (
          <div className="bg-forest-pale border border-sage/30 rounded-3xl p-6
            flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <p className="font-semibold text-forest mb-1">
                Want to share your story?
              </p>
              <p className="text-ink-soft text-sm">
                Join as a client. Once approved, you can add your transformation.
              </p>
            </div>
            <Link href="/start-your-transformation"
              className="shrink-0 bg-forest text-cream font-semibold px-6 py-3
                rounded-full hover:bg-forest-light transition-all duration-200
                shadow-sm hover:shadow-md">
              Join Now →
            </Link>
          </div>
        )}

        {/* Grid */}
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
