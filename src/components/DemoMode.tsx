import { useState } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import { DEMO_SCENARIOS } from '../lib/vault'
import { Play, FlaskConical, ArrowLeft, CheckCircle2 } from 'lucide-react'

type Props = {
  lang: Lang
  onRun: (input: string, lang: Lang) => void
  onBack: () => void
}

export function DemoMode({ lang, onRun, onBack }: Props) {
  const [runId, setRunId] = useState<string | null>(null)

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink-900 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-saffron-500" />
            {t(lang, 'demoMode')}
          </h1>
          <p className="text-sm text-ink-500 mt-1">{t(lang, 'demoDesc')}</p>
        </div>
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'backHome')}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_SCENARIOS.map((scenario) => (
          <div
            key={scenario.id}
            className={`card p-5 transition-all ${runId === scenario.id ? 'border-saffron-300 shadow-lift' : 'hover:border-saffron-200 hover:shadow-soft'}`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-display font-bold text-ink-900">{scenario.name}</h3>
                <p className="text-xs text-ink-500 mt-0.5">{scenario.description}</p>
              </div>
              {runId === scenario.id && (
                <CheckCircle2 className="w-5 h-5 text-leaf-500 shrink-0" />
              )}
            </div>

            <div className="rounded-lg bg-ink-50 px-3 py-2.5 mb-3">
              <p className="text-sm text-ink-700 italic">"{scenario.input}"</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {scenario.expectedSchemes.map((sid) => (
                <span key={sid} className="chip bg-leaf-50 text-leaf-700 text-xs">
                  {sid}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setRunId(scenario.id)
                onRun(scenario.input, scenario.lang)
              }}
              className="btn-primary w-full text-sm"
            >
              <Play className="w-4 h-4" />
              {t(lang, 'demoRun')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
