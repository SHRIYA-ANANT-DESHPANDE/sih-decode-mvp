import type { Lang } from '../lib/i18n'
import { t, LANGS } from '../lib/i18n'
import { BarChart3, Globe, ShieldCheck, ScrollText, FlaskConical } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type Props = {
  lang: Lang
  onLangChange: (l: Lang) => void
  onHome: () => void
  onAudit: () => void
  onVault: () => void
  onLedger: () => void
  onDemo: () => void
  showNav: boolean
}

export function Header({ lang, onLangChange, onHome, onAudit, onVault, onLedger, onDemo, showNav }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-saffron-500 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" />
            </svg>
          </div>
          <div className="text-left leading-tight">
            <div className="font-display font-bold text-lg text-ink-900">SahaAI</div>
            <div className="text-[10px] text-ink-400 -mt-0.5 hidden sm:block">{t(lang, 'tagline')}</div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {showNav && (
            <>
              <button
                onClick={onDemo}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-saffron-700 hover:bg-saffron-50 rounded-lg transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                {t(lang, 'viewDemo')}
              </button>
              <button
                onClick={onVault}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-saffron-700 hover:bg-saffron-50 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                {t(lang, 'viewVault')}
              </button>
              <button
                onClick={onLedger}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-saffron-700 hover:bg-saffron-50 rounded-lg transition-colors"
              >
                <ScrollText className="w-4 h-4" />
                {t(lang, 'viewLedger')}
              </button>
              <button
                onClick={onAudit}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 hover:text-saffron-700 hover:bg-saffron-50 rounded-lg transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                {t(lang, 'viewAudit')}
              </button>
            </>
          )}

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 hover:border-saffron-300 transition-colors text-sm font-medium text-ink-700"
            >
              <Globe className="w-4 h-4 text-saffron-500" />
              <span className="hidden sm:inline">{LANGS.find((l) => l.code === lang)?.native}</span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 card shadow-lift p-1.5 z-50">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLangChange(l.code)
                      setOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      lang === l.code
                        ? 'bg-saffron-50 text-saffron-700'
                        : 'text-ink-700 hover:bg-ink-50'
                    }`}
                  >
                    {l.native}
                    <span className="text-ink-400 text-xs ml-2">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
