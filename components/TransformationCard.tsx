import StarRating from './StarRating'
import { format } from 'date-fns'

type Transformation = {
  id: string
  story: string
  rating: number
  date: string
  before_image_url?: string
  after_image_url?: string
  clients?: { name: string }
}

export default function TransformationCard({ t }: { t: Transformation }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      {/* Before / After images */}
      {(t.before_image_url || t.after_image_url) && (
        <div className="grid grid-cols-2 gap-2">
          {t.before_image_url && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Before</p>
              <img src={t.before_image_url} alt="Before"
                className="w-full h-36 object-cover rounded-xl" />
            </div>
          )}
          {t.after_image_url && (
            <div>
              <p className="text-xs text-gray-400 mb-1">After</p>
              <img src={t.after_image_url} alt="After"
                className="w-full h-36 object-cover rounded-xl" />
            </div>
          )}
        </div>
      )}

      {/* Story */}
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{t.story}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {t.clients?.name ?? 'Anonymous'}
          </p>
          <p className="text-xs text-gray-400">
            {format(new Date(t.date), 'dd MMM yyyy')}
          </p>
        </div>
        <StarRating rating={t.rating} />
      </div>
    </div>
  )
}