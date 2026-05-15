'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { approveClient, declineClient, restoreClient } from '@/lib/actions/clientActions'

type Request = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  created_at: string
}

type Grouped = {
  pending: Request[]
  approved: Request[]
  declined: Request[]
}

export default function ClientActions({ grouped }: { grouped: Grouped }) {
  const router = useRouter()

  const [data, setData] = useState(grouped)
  const [tab, setTab] = useState<'pending' | 'approved' | 'declined'>('pending')
  const [loading, setLoading] = useState<string | null>(null)

  async function approve(request: Request) {
    setLoading(request.id)
    const result = await approveClient(request.id, request.email, request.name, request.phone)

    if (!result.success) {
      toast.error('Failed to approve: ' + result.error)
      setLoading(null)
      return
    }

    toast.success(`${request.name} approved as client!`)
    setData(prev => ({
      pending:  prev.pending.filter(r => r.id !== request.id),
      approved: [{ ...request, status: 'approved' }, ...prev.approved],
      declined: prev.declined,
    }))

    router.refresh()
    setLoading(null)
  }

  async function decline(request: Request) {
    setLoading(request.id)
    const result = await declineClient(request.id)

    if (!result.success) {
      toast.error('Failed to decline: ' + result.error)
      setLoading(null)
      return
    }

    toast.success(`${request.name} declined.`)
    setData(prev => ({
      pending:  prev.pending.filter(r => r.id !== request.id),
      approved: prev.approved,
      declined: [{ ...request, status: 'declined' }, ...prev.declined],
    }))

    router.refresh()
    setLoading(null)
  }

  async function restore(request: Request) {
    setLoading(request.id)
    const result = await restoreClient(request.id)

    if (!result.success) {
      toast.error('Failed to restore: ' + result.error)
      setLoading(null)
      return
    }

    toast.success('Moved back to pending')
    setData(prev => ({
      pending:  [{ ...request, status: 'pending' }, ...prev.pending],
      approved: prev.approved.filter(r => r.id !== request.id),
      declined: prev.declined.filter(r => r.id !== request.id),
    }))
    router.refresh()
    setLoading(null)
  }

  const tabs = [
    { key: 'pending',  label: 'Pending',  count: data.pending.length  },
    { key: 'approved', label: 'Approved', count: data.approved.length },
    { key: 'declined', label: 'Declined', count: data.declined.length },
  ] as const

  const current = data[tab]

  return (
    <div>
      {/* Tab bar — keep your existing JSX exactly as is */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2
              ${tab === t.key
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
            {t.label}
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold
              ${tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Request cards — keep your existing JSX exactly as is */}
      {current.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">No {tab} requests</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {current.map(r => (
            <div key={r.id}
              className="bg-white rounded-2xl border border-gray-100 p-5
                flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.email}</p>
                <p className="text-sm text-gray-500">📞 {r.phone}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {format(new Date(r.created_at), 'dd MMM yyyy, h:mm a')}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {tab === 'pending' && (
                  <>
                    <button onClick={() => approve(r)} disabled={loading === r.id}
                      className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm
                        font-medium hover:bg-green-700 transition disabled:opacity-60">
                      {loading === r.id ? '...' : '✅ Approve'}
                    </button>
                    <button onClick={() => decline(r)} disabled={loading === r.id}
                      className="bg-red-50 text-red-600 border border-red-100 px-5 py-2
                        rounded-xl text-sm font-medium hover:bg-red-100 transition
                        disabled:opacity-60">
                      {loading === r.id ? '...' : '❌ Decline'}
                    </button>
                  </>
                )}
                {(tab === 'approved' || tab === 'declined') && (
                  <button onClick={() => restore(r)} disabled={loading === r.id}
                    className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl
                      text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60">
                    {loading === r.id ? '...' : '↩ Move to Pending'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}