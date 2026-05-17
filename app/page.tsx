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

  const { data: ratings } = await supabase
    .from('transformations')
    .select('rating')
    .eq('is_visible', true)

  const averageRating =
    ratings && ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
          ratings.length
        ).toFixed(1)
      : '5.0'

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-cream overflow-hidden">

        {/* Organic background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[55%] h-[70%]
            rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-forest-pale opacity-60" />
          <div className="absolute bottom-[-5%] left-[-8%] w-[35%] h-[45%]
            rounded-[50%_60%_40%_50%/60%_40%_50%_50%] bg-terra-pale opacity-70" />
          <div className="absolute top-[20%] left-[10%] w-16 h-16
            rounded-full bg-gold/20" />
          <div className="absolute bottom-[20%] right-[12%] w-8 h-8
            rounded-full bg-sage/40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 w-full
          grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20">

          {/* Left — Text */}
          <div className="flex flex-col gap-7 order-2 md:order-1">

            {/* Eyebrow */}
            <div className="animate-fade-up flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-terra-pale border border-terra/20
                rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-terra animate-pulse" />
                <span className="text-terra text-xs font-semibold tracking-widest uppercase">
                  Clinical Dietitian
                </span>
              </div>
              <div className="flex -space-x-1">
                {['🌿','🥗','✨'].map((e,i) => (
                  <span key={i} className="text-base">{e}</span>
                ))}
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up delay-100">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl
                text-forest leading-[1.08] tracking-tight">
                Eat well,
                <br />
                <span className="italic text-terra">feel whole,</span>
                <br />
                live fully.
              </h1>
            </div>

            {/* Subtext */}
            <p className="animate-fade-up delay-200 text-ink-soft text-lg leading-relaxed
              max-w-lg font-light">
              True wellness is about more than just weight loss. It’s about feeling
              confident, energised, and balanced in your everyday life.
              <br /><br />
              Hi, I’m <strong className="font-semibold text-forest">Ankita Banerjee</strong>,
              helping people build healthier lifestyles through
              personalised nutrition, sustainable habits, and realistic guidance that fits
              naturally into real life.
              <br /><br />
              My approach combines nutrition science with compassionate support to help you
              achieve lasting results, without restrictive dieting or extremes.
            </p>

            {/* Social proof row */}
            <div className="animate-fade-up delay-300 flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-3xl text-forest">1200+</p>
                <p className="text-xs text-ink-muted mt-0.5">Clients</p>
              </div>
              <div className="w-px h-10 bg-cream-darker" />
              <div className="text-center">
                <p className="font-display text-3xl text-forest">7 yrs</p>
                <p className="text-xs text-ink-muted mt-0.5">Experience</p>
              </div>
              <div className="w-px h-10 bg-cream-darker" />
              <div className="text-center">
                <p className="font-display text-3xl text-forest">{averageRating}★</p>
                <p className="text-xs text-ink-muted mt-0.5">Rating</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="animate-fade-up delay-400 flex flex-wrap gap-3">
              <Link href="/start-your-transformation"
                className="bg-forest text-cream font-semibold px-8 py-4 rounded-full
                  hover:bg-forest-light transition-all duration-200 shadow-lg
                  hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Start Your Journey →
              </Link>
              <Link href="/transformations"
                className="bg-white border border-cream-darker text-ink-soft font-semibold
                  px-8 py-4 rounded-full hover:bg-cream-dark hover:text-forest
                  transition-all duration-200">
                See Transformations
              </Link>
            </div>
          </div>

          {/* Right — Photo */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="animate-scale-in delay-200 relative">
              {/* Main photo frame */}
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Decorative ring */}
                <div className="absolute inset-[-12px] rounded-[60%_40%_55%_45%/50%_55%_45%_50%]
                  border-2 border-sage/40" />
                <div className="absolute inset-[-24px] rounded-[55%_45%_50%_50%/45%_50%_55%_50%]
                  border border-terra/20" />

                {/* Photo */}
                <img
                  src="/images/dietitian.png"
                  alt="Ankita Banerjee, Dietitian"
                  className="w-full h-full object-cover shadow-2xl border-4 border-white"
                  style={{
                    borderRadius: '60% 40% 55% 45% / 50% 55% 45% 50%',
                  }}
                />
              </div>

              {/* Floating cards */}
              <div className="animate-float absolute top-4 left-[-24px] md:left-[-40px]
                bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5
                border border-cream-darker">
                <div className="w-9 h-9 rounded-xl bg-gold-pale flex items-center
                  justify-center text-lg shrink-0">🏅</div>
                <div>
                  <p className="text-[11px] font-bold text-forest leading-none">Clinical</p>
                  <p className="text-[10px] text-ink-muted leading-none mt-0.5">Dietitian</p>
                </div>
              </div>

              <div className="animate-float absolute bottom-8 right-[-20px] md:right-[-36px]
                bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5
                border border-cream-darker"
                style={{ animationDelay: '2s' }}>
                <div className="w-9 h-9 rounded-xl bg-forest-pale flex items-center
                  justify-center text-lg shrink-0">🌱</div>
                <div>
                  <p className="text-[11px] font-bold text-forest leading-none">Sustainable</p>
                  <p className="text-[10px] text-ink-muted leading-none mt-0.5">Nutrition Plans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col
          items-center gap-2 animate-fade-in delay-600">
          <p className="text-xs text-ink-muted font-medium tracking-widest uppercase">
            Scroll
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-ink-muted to-transparent" />
        </div>
      </section>

      {/* ── SPECIALISATIONS ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Label + heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between
            gap-6 mb-16">
            <div>
              <span className="inline-block text-xs text-terra font-bold
                tracking-widest uppercase mb-4 border-b-2 border-terra pb-1">
                Expertise
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-forest leading-tight">
                What I help
                <br />
                <span className="italic">you with</span>
              </h2>
            </div>
            <p className="text-ink-soft max-w-xs leading-relaxed text-sm md:text-base
              md:text-right">
              Tailored nutrition science for real people with real lives — no
              one-size-fits-all plans.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialisations.map((s, i) => (
              <div
                key={s.title}
                className={`group rounded-3xl p-7 border transition-all duration-300
                  hover-lift cursor-default
                  ${i === 0 ? 'bg-forest text-cream border-forest col-span-1 sm:col-span-2 lg:col-span-1' :
                    i % 3 === 1 ? 'bg-terra-pale border-terra/20 hover:border-terra/40' :
                    i % 3 === 2 ? 'bg-forest-pale border-sage/30 hover:border-sage' :
                    'bg-gold-pale border-gold/20 hover:border-gold/50'
                  }`}>
                <div className={`text-4xl mb-5 transition-transform duration-300
                  group-hover:scale-110`}>{s.icon}</div>
                <h3 className={`font-display text-xl mb-2 leading-tight
                  ${i === 0 ? 'text-cream' : 'text-forest'}`}>
                  {s.title}
                </h3>
                <p className={`text-sm leading-relaxed
                  ${i === 0 ? 'text-cream/70' : 'text-ink-soft'}`}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ANKITA ── */}
      <section className="py-28 px-6 bg-cream-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-forest-pale
          opacity-30 skew-x-[-6deg] translate-x-12 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs text-terra font-bold
              tracking-widest uppercase mb-4 border-b-2 border-terra pb-1">
              Why Choose Me
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-forest mt-2">
              A different kind of
              <span className="italic"> dietitian</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {whyChoose.map((w, i) => (
              <div key={w.title}
                className="bg-white rounded-3xl p-7 border border-cream-darker
                  flex gap-5 hover-lift group">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center
                  justify-center text-2xl border transition-all duration-200
                  group-hover:scale-110
                  ${i % 2 === 0
                    ? 'bg-forest-pale border-sage/30'
                    : 'bg-terra-pale border-terra/20'
                  }`}>
                  {w.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold text-forest text-base">{w.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATIONS ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between
            gap-6 mb-16">
            <div>
              <span className="inline-block text-xs text-terra font-bold
                tracking-widest uppercase mb-4 border-b-2 border-terra pb-1">
                Real Results
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-forest leading-tight">
                Their stories,
                <br />
                <span className="italic">their proof</span>
              </h2>
            </div>
            <Link href="/transformations"
              className="shrink-0 self-start md:self-auto bg-cream-dark text-forest
                font-semibold px-6 py-3 rounded-full border border-cream-darker
                hover:bg-cream-darker hover:border-forest/20
                transition-all duration-200">
              All Stories →
            </Link>
          </div>

          {transformations && transformations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformations.map((t: any) => (
                <TransformationCard key={t.id} t={t} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-forest-pale border-2 border-dashed
              border-sage/50 py-24 text-center">
              <p className="text-5xl mb-4">🌱</p>
              <p className="font-display text-2xl text-forest mb-2">
                Stories coming soon
              </p>
              <p className="text-ink-muted text-sm">
                Be the first to share your transformation.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 bg-forest relative overflow-hidden">
        {/* Texture dots */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAF7F2 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full
          bg-forest-light opacity-40 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs text-sage font-bold tracking-widest
            uppercase mb-6 border border-sage/30 rounded-full px-4 py-1.5">
            Take the First Step
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream
            leading-tight mb-6">
            Your transformation
            <br />
            <span className="italic text-gold">starts today</span>
          </h2>
          <p className="text-cream/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Book a personal consultation. I'll personally reach out to understand
            your goals and build a plan just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/start-your-transformation"
              className="bg-terra text-white font-bold px-10 py-4 rounded-full
                hover:bg-terra-light transition-all duration-200 shadow-lg
                hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-base">
              Start Your Transformation →
            </Link>
            <Link href="/transformations"
              className="border border-cream/20 text-cream font-semibold px-10 py-4
                rounded-full hover:bg-cream/10 transition-all duration-200 text-base">
              Read Success Stories
            </Link>
          </div>

          {/* Reassurance */}
          <p className="mt-8 text-cream/40 text-sm">
            Free first consultation · No commitment required
          </p>
        </div>
      </section>

    </div>
  )
}

const specialisations = [
  { icon: '⚖️', title: 'Weight Management', desc: 'Sustainable weight loss or gain without crash diets or starvation — science-backed and built around your lifestyle.' },
  { icon: '🩺', title: 'Medical Nutrition', desc: 'Therapeutic plans for diabetes, PCOS / PMOS, thyroid, cholesterol, hypertension, and arthritis conditions.' },
  { icon: '🏃', title: 'Sports Nutrition', desc: 'Performance-optimised meal plans for athletes and fitness enthusiasts.' },
  { icon: '🤰', title: 'Prenatal & Postnatal', desc: 'Safe, nourishing nutrition plans for pregnancy and postpartum recovery.' },
  { icon: '🧠', title: 'Gut & Hormonal Health', desc: 'Restore balance through food — addressing bloating, fatigue, mood swings and more.' },
  { icon: '👶', title: 'Child & Teen Nutrition', desc: 'Building healthy habits from a young age with family-friendly, practical guidance.' },
]

const whyChoose = [
  { icon: '🎯', title: 'Personalised — Not Generic', desc: 'Every plan is built around your lifestyle, food preferences, and health goals. No two plans are alike.' },
  { icon: '📞', title: 'Direct Access to Me', desc: 'You work with me personally — not an assistant. Real guidance from a real expert.' },
  { icon: '📈', title: 'Proven Track Record', desc: 'Over 1200 clients have transformed their health with measurable, lasting results.' },
  { icon: '💬', title: 'Ongoing Support', desc: 'Regular check-ins and plan adjustments as your life and goals evolve.' },
]
