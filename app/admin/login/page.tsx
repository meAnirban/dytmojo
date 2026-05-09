'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function sendOtp() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) { toast.error('Failed to send OTP'); return }
    toast.success('OTP sent to your email')
    setStep('otp')
  }

  async function verifyOtp() {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email, token: otp, type: 'email'
    })
    setLoading(false)
    if (error) { toast.error('Invalid OTP'); return }
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-3xl">🔐</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">dytmojo dietitian dashboard</p>
        </div>

        {step === 'email' && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold
                hover:bg-green-700 transition disabled:opacity-60">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500 text-center">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                text-center tracking-widest text-lg focus:outline-none
                focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
              className="bg-green-600 text-white py-3 rounded-xl font-semibold
                hover:bg-green-700 transition disabled:opacity-60">
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <button
              onClick={() => setStep('email')}
              className="text-sm text-gray-400 hover:text-gray-600 text-center">
              ← Use different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}