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
  const initials = (t.clients?.name ?? 'A')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white rounded-3xl border border-cream-darker p-6
      flex flex-col gap-4 hover-lift group">

      {/* Before / After images */}
      {(t.before_image_url || t.after_image_url) && (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
          {t.before_image_url && (
            <div className="relative">
              <img src={t.before_image_url} alt="Before"
                className="w-full h-32 object-cover" />
              <span className="absolute bottom-1.5 left-1.5 bg-ink/60 text-white
                text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                Before
              </span>
            </div>
          )}
          {t.after_image_url && (
            <div className="relative">
              <img src={t.after_image_url} alt="After"
                className="w-full h-32 object-cover" />
              <span className="absolute bottom-1.5 left-1.5 bg-forest/80 text-cream
                text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                After
              </span>
            </div>
          )}
        </div>
      )}

      {/* Story */}
      <p className="text-ink-soft text-sm leading-relaxed line-clamp-4 flex-1">
        "{t.story}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-forest-pale flex items-center
            justify-center text-forest text-xs font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              {t.clients?.name ?? 'Anonymous'}
            </p>
            <p className="text-xs text-ink-muted">
              {format(new Date(t.date), 'dd MMM yyyy')}
            </p>
          </div>
        </div>
        <StarRating rating={t.rating} />
      </div>
    </div>
  )
}
