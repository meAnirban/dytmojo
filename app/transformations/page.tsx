import { createClient } from '@/lib/supabase/server'
import TransformationCard from '@/components/TransformationCard'
import AddStoryButton from '@/components/AddStoryButton'

export default async function TransformationsPage() {
  const supabase = await createClient()

  // Fetch transformations
  const { data: transformations } = await supabase
    .from('transformations')
    .select('*, clients(name)')
    .eq('is_visible', true)
    .order('date', { ascending: false })
    .limit(50)

  // Check if logged-in user is an approved client
  const { data: { user } } = await supabase.auth.getUser()

  let isApprovedClient = false
  let clientId: string | null = null

  if (user?.email) {
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .single()

    if (client) {
      isApprovedClient = true
      clientId = client.id
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Transformation Stories
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real results from real people. Every story here is from a verified client.
          </p>
        </div>

        {/* Add Story button — only for approved clients */}
        {isApprovedClient && clientId && (
          <div className="flex justify-center mb-10">
            <AddStoryButton clientId={clientId} />
          </div>
        )}

        {/* Not a client message */}
        {!isApprovedClient && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center
            max-w-lg mx-auto mb-10">
            <p className="text-green-800 text-sm">
              Want to share your story?{' '}
              <a href="/get-consultation" className="font-semibold underline">
                Join as a client
              </a>{' '}
              — once approved by the dietitian, you can add your transformation.
            </p>
          </div>
        )}

        {/* Stories Grid */}
        {transformations && transformations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformations.map((t: any) => (
              <TransformationCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-20">
            Transformation stories coming soon!
          </p>
        )}
      </div>
    </div>
  )
}