'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

// ── Validation schemas ──
const consultSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

type ConsultForm = z.infer<typeof consultSchema>
type OtpForm = z.infer<typeof otpSchema>

export default function GetConsultationPage() {
  const [step, setStep] = useState<'form' | 'otp' | 'done'>('form')
  const [userEmail, setUserEmail] = useState('')
  const supabase = createClient()

  // ── Step 1 form ──
  const {
    register: regConsult,
    handleSubmit: handleConsult,
    formState: { errors: errConsult, isSubmitting: submittingConsult },
  } = useForm<ConsultForm>({ resolver: zodResolver(consultSchema) })

  // ── Step 2 OTP form ──
  const {
    register: regOtp,
    handleSubmit: handleOtp,
    formState: { errors: errOtp, isSubmitting: submittingOtp },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema) })

  // ── Submit consultation form ──
  async function onSubmitForm(data: ConsultForm) {
    // 1. Check if already submitted
    const { data: existing } = await supabase
      .from('consultation_requests')
      .select('id, status')
      .eq('email', data.email)
      .single()

    if (existing) {
      if (existing.status === 'approved') {
        toast.success('You are already an approved client!')
        return
      }
      if (existing.status === 'pending') {
        toast('Your request is already submitted. We will contact you soon.', { icon: 'ℹ️' })
        return
      }
    }

    // 2. Save to consultation_requests
    const { error: dbError } = await supabase
      .from('consultation_requests')
      .insert({ name: data.name, phone: data.phone, email: data.email })

    if (dbError) {
      toast.error('Something went wrong. Please try again.')
      return
    }

    // 3. Send OTP via Supabase Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: { shouldCreateUser: true },
    })

    if (otpError) {
      toast.error('Failed to send OTP. Please try again.')
      return
    }

    setUserEmail(data.email)
    toast.success('OTP sent to your email!')
    setStep('otp')
  }

  // ── Verify OTP ──
  async function onSubmitOtp(data: OtpForm) {
    const { error } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: data.otp,
      type: 'email',
    })

    if (error) {
      toast.error('Invalid or expired OTP. Please try again.')
      return
    }

    // Mark as verified in otp_verifications table
    await supabase
      .from('otp_verifications')
      .insert({ email: userEmail, verified: true })

    toast.success('Email verified!')
    setStep('done')
  }

  // ── Resend OTP ──
  async function resendOtp() {
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: { shouldCreateUser: false },
    })
    if (error) toast.error('Failed to resend. Please wait a moment.')
    else toast.success('New OTP sent!')
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-md">

        {/* ── STEP 1: Consultation Form ── */}
        {step === 'form' && (
          <>
            <div className="mb-8 text-center">
              <span className="text-3xl">🥗</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Get Consultation</h1>
              <p className="text-gray-500 text-sm mt-1">
                Fill in your details. The dietitian will personally reach out to you.
              </p>
            </div>

            <form onSubmit={handleConsult(onSubmitForm)} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...regConsult('name')}
                  placeholder="Priya Sharma"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errConsult.name && (
                  <p className="text-red-500 text-xs mt-1">{errConsult.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  {...regConsult('phone')}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errConsult.phone && (
                  <p className="text-red-500 text-xs mt-1">{errConsult.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...regConsult('email')}
                  placeholder="priya@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errConsult.email && (
                  <p className="text-red-500 text-xs mt-1">{errConsult.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingConsult}
                className="bg-green-600 text-white py-3 rounded-xl font-semibold
                  hover:bg-green-700 transition disabled:opacity-60 mt-2">
                {submittingConsult ? 'Sending OTP...' : 'Send OTP & Submit'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === 'otp' && (
          <>
            <div className="mb-8 text-center">
              <span className="text-3xl">📬</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Verify Your Email</h1>
              <p className="text-gray-500 text-sm mt-1">
                We sent a 6-digit OTP to <span className="font-medium">{userEmail}</span>
              </p>
            </div>

            <form onSubmit={handleOtp(onSubmitOtp)} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  {...regOtp('otp')}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    text-center tracking-widest text-lg focus:outline-none
                    focus:ring-2 focus:ring-green-400"
                />
                {errOtp.otp && (
                  <p className="text-red-500 text-xs mt-1">{errOtp.otp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingOtp}
                className="bg-green-600 text-white py-3 rounded-xl font-semibold
                  hover:bg-green-700 transition disabled:opacity-60">
                {submittingOtp ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={resendOtp}
                className="text-green-600 text-sm font-medium hover:underline text-center">
                Resend OTP
              </button>
            </form>
          </>
        )}

        {/* ── STEP 3: Done ── */}
        {step === 'done' && (
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">You're all set!</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your consultation request has been submitted and your email is verified.
              The dietitian will personally reach out to you via phone or email within
              24–48 hours.
            </p>
            <div className="bg-green-50 rounded-2xl p-4 text-sm text-green-800 w-full mt-2">
              📞 If you don't hear back in 48 hours, WhatsApp at <strong>+91 XXXXXXXXXX</strong>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}