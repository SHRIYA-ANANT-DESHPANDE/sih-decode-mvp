import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { AutofillResult } from '../lib/vault'
import { CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react'

type Props = {
  result: AutofillResult
  lang: Lang
  onConfirm: () => void
}

export function AutofillView({ result, lang, onConfirm }: Props) {
  const { mappings, filledCount, totalCount, readyPercent, missingFields } = result

  const confidenceColor = (c: string) => {
    if (c === 'high') return 'bg-leaf-50 text-leaf-700 border-leaf-200'
    if (c === 'medium') return 'bg-saffron-50 text-saffron-700 border-saffron-200'
    if (c === 'low') return 'bg-red-50 text-red-600 border-red-200'
    return 'bg-ink-50 text-ink-400 border-ink-200'
  }

  const confidenceLabel = (c: string) => {
    if (c === 'high') return t(lang, 'confidenceHigh')
    if (c === 'medium') return t(lang, 'confidenceMedium')
    if (c === 'low') return t(lang, 'confidenceLow')
    return t(lang, 'autofillMissing')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-saffron-500" />
        <h3 className="font-display font-semibold text-ink-800">{t(lang, 'autofillTitle')}</h3>
      </div>
      <p className="text-sm text-ink-500">{t(lang, 'autofillDesc')}</p>

      <div className="rounded-xl bg-ink-50 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-700">
          {filledCount} / {totalCount} {t(lang, 'autofillReady')}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-ink-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${readyPercent >= 80 ? 'bg-leaf-500' : readyPercent >= 50 ? 'bg-saffron-500' : 'bg-red-400'}`}
              style={{ width: `${readyPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-ink-800">{readyPercent}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {mappings.map((m, i) => (
          <div key={i} className="rounded-lg border border-ink-100 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {m.value ? (
                  <CheckCircle2 className="w-4 h-4 text-leaf-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-ink-300 shrink-0" />
                )}
                <span className="text-sm font-medium text-ink-800 truncate">{m.field.label[lang]}</span>
                {m.field.required && <span className="text-red-400 text-xs">*</span>}
              </div>
              <span className={`chip text-xs ${confidenceColor(m.confidence)} border`}>
                {confidenceLabel(m.confidence)}
              </span>
            </div>
            {m.value && (
              <div className="mt-1.5 flex items-center gap-2 pl-6">
                <span className="text-sm text-ink-600">{m.value}</span>
                <span className="text-xs text-ink-400">
                  · {m.source === 'vault' ? t(lang, 'autofillSourceVault') : t(lang, 'autofillSourceProfile')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {missingFields.length > 0 && (
        <div className="rounded-xl bg-saffron-50 border border-saffron-200 px-4 py-3">
          <p className="text-sm text-saffron-800 font-medium">
            {missingFields.length} {t(lang, 'autofillMissing')}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {missingFields.map((f, i) => (
              <span key={i} className="chip bg-white text-saffron-700 text-xs border border-saffron-200">
                {f.label[lang]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-ink-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{t(lang, 'privacyNote')}</span>
      </div>

      <button
        onClick={onConfirm}
        disabled={missingFields.length > 0}
        className="btn-primary w-full disabled:bg-ink-200 disabled:cursor-not-allowed"
      >
        <Zap className="w-4 h-4" />
        {t(lang, 'autofillRun')}
      </button>
    </div>
  )
}
