'use client'

import { RATING_CONFIG } from '@/types/evaluations'
import type { EvaluationRating } from '@/types/evaluations'

interface RatingSelectorProps {
  value: EvaluationRating | null
  onChange: (rating: EvaluationRating) => void
}

export function RatingSelector({ value, onChange }: RatingSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(Object.entries(RATING_CONFIG) as [EvaluationRating, typeof RATING_CONFIG[EvaluationRating]][]).map(([rating, config]) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
            value === rating
              ? 'border-current shadow-md scale-105'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
          }`}
          style={value === rating ? { backgroundColor: config.bg, color: config.color, borderColor: config.color } : {}}
        >
          {config.emoji} {config.fr}
        </button>
      ))}
    </div>
  )
}
