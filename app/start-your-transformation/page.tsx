'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const consultSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
})
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})
type ConsultForm = z.infer<typeof consultSchema>
type OtpForm    = z.infer<typeof otpSchema>

const features = [
  { icon: '🎯', text: 'Personalised nutrition plan' },
  { icon: '📞', text: 'Direct consultation with Ankita' },
  { icon: '📊', text: 'Progress tracking & check-ins' },
  { icon: '🌱', text: 'Sustainable, realistic approach' },
]

export default function GetConsultationPage() {
  const [step, setStep]           = useState<'form' | 'otp' | 'done'>('form')
  const [userEmail, setUserEmail] = useState('')
  const supabase                  = createClient()

  const { register: regC, handleSubmit: handleC,
    formState: { errors: errC, isSubmitting: subC } } =
    useForm<ConsultForm>({ resolver: zodResolver(consultSchema) })

  const { register: regO, handleSubmit: handleO,
    formState: { errors: errO, isSubmitting: subO } } =
    useForm<OtpForm>({ resolver: zodResolver(otpSchema) })

  async function onSubmitForm(data: ConsultForm) {
    const { data: existing } = await supabase
      .from('consultation_requests').select('id,status')
      .eq('email', data.email).single()

    if (existing?.status === 'approved') {
      toast.success('You are already an approved client!')
      return
    }
    if (existing?.status === 'pending') {
      toast('Request already submitted. We will contact you soon.', { icon: 'ℹ️' })
      return
    }

    const { error: dbErr } = await supabase
      .from('consultation_requests')
      .insert({ name: data.name, phone: data.phone, email: data.email })
    if (dbErr) { toast.error('Something went wrong. Please try again.'); return }

    const { error: otpErr } = await supabase.auth.signInWithOtp({
      email: data.email, options: { shouldCreateUser: true },
    })
    if (otpErr) { toast.error('Failed to send OTP. Please try again.'); return }

    setUserEmail(data.email)
    toast.success('OTP sent to your email!')
    setStep('otp')
  }

  async function onSubmitOtp(data: OtpForm) {
    const { error } = await supabase.auth.verifyOtp({
      email: userEmail, token: data.otp, type: 'email',
    })
    if (error) { toast.error('Invalid or expired OTP.'); return }
    await supabase.from('otp_verifications').insert({ email: userEmail, verified: true })
    toast.success('Email verified!')
    setStep('done')
  }

  async function resendOtp() {
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail, options: { shouldCreateUser: false },
    })
    if (error) toast.error('Failed to resend. Please wait a moment.')
    else toast.success('New OTP sent!')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">

      {/* ── MOBILE TRUST BAR — visible only on mobile/tablet ── */}
      <div className="lg:hidden bg-forest px-6 py-8">
        {/* Logo */}
        {/* <img src="/images/logo.png" alt="dytmojo"
          className="h-8 w-auto object-contain brightness-200 opacity-90 mb-6" /> */}

        {/* Headline */}
        <h2 className="font-display text-2xl text-cream leading-tight mb-2">
          Start your{' '}
          <span className="italic text-gold">transformation</span>
        </h2>
        <p className="text-cream/60 text-sm leading-relaxed mb-6">
          Fill out the form and Ankita will personally reach out within 24 hours.
        </p>

        {/* Feature pills — horizontal scroll on very small screens */}
        <div className="flex flex-wrap gap-2 mb-6">
          {features.map(f => (
            <div key={f.text}
              className="flex items-center gap-1.5 bg-forest-light border border-cream/10
                rounded-full px-3 py-1.5">
              <span className="text-sm">{f.icon}</span>
              <span className="text-cream/80 text-xs font-medium whitespace-nowrap">
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* Compact testimonial */}
        <div className="bg-forest-light rounded-2xl p-4 border border-cream/10
          flex gap-3 items-start">
          <div className="shrink-0 w-9 h-9 rounded-full bg-sage/30 flex items-center
            justify-center text-sm font-bold text-cream">P</div>
          <div>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="text-gold text-xs">★</span>
              ))}
            </div>
            <p className="text-cream/75 text-xs leading-relaxed italic">
              "Lost 12 kg in 4 months and never felt hungry once!"
            </p>
            <p className="text-cream/40 text-xs mt-1 font-semibold">
              — Priya S., Bengaluru
            </p>
          </div>
        </div>
      </div>

      {/* ── LEFT PANEL — full version, desktop only ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-forest flex-col justify-between
        p-14 relative overflow-hidden">
        {/* Dot texture */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAF7F2 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full
          bg-forest-light opacity-40 pointer-events-none" />

        <div className="relative">
          {/* <img src="/images/logo.png" alt="dytmojo"
            className="h-10 w-auto object-contain brightness-200 opacity-90 mb-16" /> */}

          <h2 className="font-display text-4xl text-cream leading-tight mb-4">
            Start your
            <br />
            <span className="italic text-gold">transformation</span>
            <br />
            today
          </h2>
          <p className="text-cream/60 text-base leading-relaxed mb-12">
            Fill out the form and Ankita will personally reach out within 24 hours
            to understand your goals.
          </p>

          <div className="flex flex-col gap-4">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest-light flex items-center
                  justify-center text-base shrink-0">
                  {f.icon}
                </div>
                <p className="text-cream/80 text-sm font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-forest-light rounded-2xl p-5 border border-cream/10">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <span key={s} className="text-gold text-sm">★</span>
              ))}
            </div>
            <p className="text-cream/80 text-sm leading-relaxed italic mb-3">
              "Ankita changed my entire relationship with food. Lost 12 kg in 4 months
              and never felt hungry once!"
            </p>
            <p className="text-cream/50 text-xs font-semibold">— Priya S., Bengaluru</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form (full width on mobile, 55% on desktop) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-16">
        <div className="w-full max-w-md">

          {/* STEP 1 — Form */}
          {step === 'form' && (
            <div className="animate-fade-up">
              <div className="mb-8">
                <span className="text-xs text-terra font-bold tracking-widest uppercase
                  border-b-2 border-terra pb-1 inline-block mb-4">
                  Get Started
                </span>
                <h1 className="font-display text-3xl md:text-4xl text-forest mb-2">
                  Book a consultation
                </h1>
                <p className="text-ink-muted text-sm">
                  Free first consultation · No commitment
                </p>
              </div>

              <form onSubmit={handleC(onSubmitForm)} className="flex flex-col gap-5">
                {[
                  { name: 'name'  as const, label: 'Full Name',     placeholder: 'Priya Sharma',   type: 'text'  },
                  { name: 'phone' as const, label: 'Phone Number',  placeholder: '9876543210',      type: 'tel'   },
                  { name: 'email' as const, label: 'Email Address', placeholder: 'priya@email.com', type: 'email' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-forest mb-1.5">
                      {field.label}
                    </label>
                    <input
                      {...regC(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      maxLength={field.name === 'phone' ? 10 : undefined}
                      className="w-full bg-white border border-cream-darker rounded-2xl
                        px-5 py-3.5 text-sm text-ink placeholder-ink-muted
                        focus:outline-none focus:ring-2 focus:ring-forest/30
                        focus:border-forest transition-all duration-200"
                    />
                    {errC[field.name] && (
                      <p className="text-terra text-xs mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errC[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}

                <button type="submit" disabled={subC}
                  className="bg-forest text-cream font-semibold py-4 rounded-full
                    hover:bg-forest-light transition-all duration-200 mt-2
                    disabled:opacity-60 shadow-lg hover:shadow-xl
                    hover:-translate-y-0.5 active:translate-y-0">
                  {subC ? 'Sending OTP...' : 'Send OTP & Submit →'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2 — OTP */}
          {step === 'otp' && (
            <div className="animate-fade-up">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-forest-pale flex items-center
                  justify-center text-3xl mb-5">📬</div>
                <h1 className="font-display text-3xl text-forest mb-2">
                  Check your email
                </h1>
                <p className="text-ink-muted text-sm leading-relaxed">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-ink">{userEmail}</span>
                </p>
              </div>

              <form onSubmit={handleO(onSubmitOtp)} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-forest mb-1.5">
                    Enter OTP
                  </label>
                  <input
                    {...regO('otp')}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full bg-white border border-cream-darker rounded-2xl
                      px-5 py-4 text-2xl text-center tracking-[0.5em] text-forest font-bold
                      focus:outline-none focus:ring-2 focus:ring-forest/30
                      focus:border-forest transition-all duration-200"
                  />
                  {errO.otp && (
                    <p className="text-terra text-xs mt-1.5">⚠ {errO.otp.message}</p>
                  )}
                </div>

                <button type="submit" disabled={subO}
                  className="bg-forest text-cream font-semibold py-4 rounded-full
                    hover:bg-forest-light transition-all duration-200
                    disabled:opacity-60 shadow-lg">
                  {subO ? 'Verifying...' : 'Verify & Continue →'}
                </button>

                <button type="button" onClick={resendOtp}
                  className="text-terra text-sm font-semibold hover:underline text-center">
                  Didn't receive it? Resend OTP
                </button>
              </form>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 'done' && (
            <div className="animate-scale-in text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-forest-pale flex items-center
                justify-center text-4xl mb-2">✅</div>
              <h1 className="font-display text-3xl text-forest">You're all set!</h1>
              <p className="text-ink-soft text-sm leading-relaxed max-w-xs">
                Your request is submitted and email is verified. Ankita will personally
                contact you via phone or email within 24–48 hours.
              </p>
              <div className="bg-forest rounded-2xl p-5 text-left w-full
                border border-forest-light mt-2">
                <p className="text-cream/70 text-sm">
                  📞 Haven't heard back in 48 hours? Email at{' '}
                  <strong className="text-cream">dtankitabanerjee@gmail.com</strong>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
