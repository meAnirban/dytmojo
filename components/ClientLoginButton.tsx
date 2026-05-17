'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ClientLoginButton() {
  const [open, setOpen]       = useState(false)
  const [step, setStep]       = useState<'email' | 'otp'>('email')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const supabase              = createClient()
  const router                = useRouter()

  async function sendOtp() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { shouldCreateUser: false },  // only existing users
    })
    setLoading(false)
    if (error) { toast.error('Email not found. Are you a registered client?'); return }
    toast.success('OTP sent!')
    setStep('otp')
  }

  async function verifyOtp() {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email, token: otp, type: 'email',
    })
    setLoading(false)
    if (error) { toast.error('Invalid OTP. Try again.'); return }
    toast.success('Logged in!')
    setOpen(false)
    router.refresh()  // re-render page to show AddStoryButton
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-2 border-forest text-forest font-semibold px-6 py-3
          rounded-full hover:bg-forest-pale transition-all duration-200 text-sm">
        Client Login
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}>

            <h2 className="font-display text-2xl text-forest mb-2">
              Client Login
            </h2>
            <p className="text-ink-muted text-sm mb-6">
              Enter your registered email to log in.
            </p>

            {step === 'email' && (
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-cream-darker rounded-2xl px-4 py-3
                    text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <button
                  onClick={sendOtp}
                  disabled={loading || !email}
                  className="bg-forest text-cream font-semibold py-3 rounded-full
                    hover:bg-forest-light transition disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send OTP →'}
                </button>
              </div>
            )}

            {step === 'otp' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-muted">
                  OTP sent to <strong className="text-ink">{email}</strong>
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="• • • • • •"
                  maxLength={6}
                  className="w-full border border-cream-darker rounded-2xl px-4 py-4
                    text-2xl text-center tracking-[0.5em] font-bold text-forest
                    focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="bg-forest text-cream font-semibold py-3 rounded-full
                    hover:bg-forest-light transition disabled:opacity-60">
                  {loading ? 'Verifying...' : 'Verify & Login →'}
                </button>
                <button onClick={() => setStep('email')}
                  className="text-sm text-ink-muted hover:text-ink text-center">
                  ← Use different email
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}