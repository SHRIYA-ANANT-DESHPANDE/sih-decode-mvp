import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { SchemeMatch } from '../lib/engine'
import { CheckCircle2, AlertCircle, ChevronRight, FileText } from 'lucide-react'

type Props = {
  match: SchemeMatch
  lang: Lang
  onSelect: () => void
}

export function SchemeCard({ match, lang, onSelect }: Props) {
  const { scheme, score, eligible, partial, matched, unmatched } = match

  const scoreColor = eligible
    ? 'text-leaf-600 bg-leaf-50 border-leaf-200'
    : partial
    ? 'text-saffron-600 bg-saffron-50 border-saffron-200'
    : 'text-ink-500 bg-ink-50 border-ink-200'

  const statusLabel = eligible
    ? t(lang, 'eligible')
    : partial
    ? t(lang, 'likelyEligible')
    : t(lang, 'matchScore')

  return (
    <div
      onClick={onSelect}
      className="card p-5 cursor-pointer hover:shadow-lift hover:border-saffron-200 transition-all group animate-fade-up"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center gap-1.5 chip ${scoreColor} mb-2 text-xs`}>
            {eligible ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {statusLabel}
          </div>
          <h3 className="font-display font-bold text-ink-900 leading-snug">
            {scheme.name[lang]}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold text-ink-800">{score}%</div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wide">{t(lang, 'matchScore')}</div>
        </div>
      </div>

      <p className="text-sm text-ink-600 leading-relaxed mb-3 line-clamp-2">
        {scheme.summary[lang]}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="chip bg-ink-50 text-ink-600 text-xs">{scheme.category[lang]}</span>
        <span className="chip bg-saffron-50 text-saffron-700 text-xs">{scheme.amount[lang]}</span>
      </div>

      {matched.length > 0 && (
        <div className="space-y-1 mb-3">
          {matched.slice(0, 2).map((m, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-leaf-700">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{m.criterion.label[lang]}</span>
            </div>
          ))}
          {unmatched.length > 0 && (
            <div className="flex items-start gap-1.5 text-xs text-ink-400">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                {unmatched.length} {t(lang, 'unmatchedCriteria').toLowerCase()}
              </span>
            </div>
          )}
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-1 text-sm font-semibold text-saffron-700 group-hover:text-saffron-800 pt-2 border-t border-ink-50">
        {t(lang, 'applyNow')}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
