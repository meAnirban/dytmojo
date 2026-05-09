import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import TransformationCard from '@/components/TransformationCard'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: transformations } = await supabase
    .from('transformations')
    .select('*, clients(name)')
    .eq('is_visible', true)
    .order('date', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-green-50 py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Photo */}
          <div className="shrink-0">
            <img
              src="/images/dietitian.jpg"
              alt="Dietitian"
              className="w-56 h-56 rounded-full object-cover shadow-lg border-4 border-white"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="text-green-600 font-semibold text-sm tracking-widest uppercase">
              Your Nutrition Expert
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Hi, I'm Ankita Banerjee
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              I'm a certified dietitian with over 8 years of experience helping people
              transform their relationship with food. I believe in sustainable, joyful eating —
              not restrictive diets.
            </p>
            <div className="flex gap-3 justify-center md:justify-start mt-2">
              <Link href="/start-your-transformation"
                className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold
                  hover:bg-green-700 transition shadow-md">
                Join Now
              </Link>
              <Link href="/transformations"
                className="border border-green-600 text-green-700 px-8 py-3 rounded-full
                  font-semibold hover:bg-green-50 transition">
                Our Transformations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALISATIONS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            What I Specialise In
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Tailored nutrition science for real people with real lives.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialisations.map((s) => (
              <div key={s.title}
                className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-green-600 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          {[
            { num: '500+', label: 'Clients Transformed' },
            { num: '8 yrs', label: 'Experience' },
            { num: '4.9★', label: 'Average Rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.num}</p>
              <p className="text-green-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENT TRANSFORMATIONS ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Recent Transformations
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Real stories from real clients.
          </p>

          {transformations && transformations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t: any) => (
                <TransformationCard key={t.id} t={t} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              Transformation stories coming soon!
            </p>
          )}

          <div className="text-center mt-12">
            <Link href="/transformations"
              className="border border-green-600 text-green-700 px-8 py-3 rounded-full
                font-semibold hover:bg-green-50 transition">
              See All Transformations →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Book a personal consultation and let's build a plan that works for your life.
        </p>
        <Link href="/start-your-transformation"
          className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg
            hover:bg-green-700 transition shadow-lg">
          Start Your Transformation
        </Link>
      </section>

    </div>
  )
}

// ── STATIC DATA — edit this freely ──
const specialisations = [
  {
    icon: '⚖️',
    title: 'Weight Management',
    desc: 'Science-backed, sustainable strategies for healthy weight loss or gain without crash diets.',
  },
  {
    icon: '🩺',
    title: 'Medical Nutrition',
    desc: 'Therapeutic diets for diabetes, PCOS, thyroid, cholesterol, and gut health conditions.',
  },
  {
    icon: '🏃',
    title: 'Sports Nutrition',
    desc: 'Performance-optimised meal plans for athletes and fitness enthusiasts.',
  },
  {
    icon: '🤰',
    title: 'Prenatal & Postnatal',
    desc: 'Safe, nourishing nutrition plans tailored for pregnancy and postpartum recovery.',
  },
  {
    icon: '🧠',
    title: 'Gut & Hormonal Health',
    desc: 'Restore balance through food — addressing bloating, fatigue, mood, and more.',
  },
  {
    icon: '👶',
    title: 'Child & Teen Nutrition',
    desc: 'Building healthy habits from a young age with family-friendly, practical guidance.',
  },
]