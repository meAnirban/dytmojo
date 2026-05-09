export default function DytbitesPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">🍪</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Dytbites</h1>
        <p className="text-xl text-amber-700 font-semibold mb-4">Coming Soon</p>
        <p className="text-gray-500 leading-relaxed mb-8">
          Dietitian-approved snacks that are actually good for you.
          We're curating a range of healthy, tasty snacks under the Dytbites brand.
          Stay tuned!
        </p>
        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Get notified when we launch
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm
              font-semibold hover:bg-amber-600 transition">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}