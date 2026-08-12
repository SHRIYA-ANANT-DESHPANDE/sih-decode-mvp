import { useState, useEffect } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { LedgerEntry } from '../lib/vault'
import { loadLedger } from '../lib/vault'
import { ScrollText, ArrowLeft } from 'lucide-react'

type Props = {
  lang: Lang
  onBack: () => void
  externalEntries: LedgerEntry[]
}

const ACTION_LABELS: Record<string, { en: string; hi: string; mr: string }> = {
  vault_created: { en: 'Vault created', hi: 'वॉल्ट बनाया', mr: 'वॉल्ट तयार केला' },
  vault_updated: { en: 'Vault updated', hi: 'वॉल्ट अपडेट', mr: 'वॉल्ट अपडेट' },
  autofill_run: { en: 'Autofill executed', hi: 'ऑटोफ़िल चलाया', mr: 'ऑटोफिल चालवले' },
  document_uploaded: { en: 'Document uploaded', hi: 'दस्तावेज़ अपलोड', mr: 'कागदपत्र अपलोड' },
  profile_extracted: { en: 'Profile extracted', hi: 'प्रोफ़ाइल निकाला', mr: 'प्रोफाइल काढले' },
  scheme_viewed: { en: 'Scheme viewed', hi: 'योजना देखी', mr: 'योजना पाहिली' },
  application_kit_generated: { en: 'Application kit generated', hi: 'आवेदन किट बनाई', mr: 'अर्ज किट तयार' },
  data_exported: { en: 'Data exported', hi: 'डेटा निर्यात', mr: 'डेटा निर्यात' },
  feedback_given: { en: 'Feedback given', hi: 'प्रतिक्रिया दी', mr: 'अभिप्राय दिला' },
}

export function DataLedger({ lang, onBack, externalEntries }: Props) {
  const [dbEntries, setDbEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const local = loadLedger()
    setDbEntries([...externalEntries, ...local].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ))
    setLoading(false)
  }, [externalEntries])

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-saffron-500" />
            {t(lang, 'ledgerTitle')}
          </h1>
          <p className="text-sm text-ink-500 mt-1">{t(lang, 'ledgerDesc')}</p>
        </div>
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'backHome')}
        </button>
      </div>

      {loading && (
        <div className="card p-8 text-center text-ink-400 animate-pulse-soft">{t(lang, 'thinking')}</div>
      )}

      {!loading && dbEntries.length === 0 && (
        <div className="card p-8 text-center text-ink-400">{t(lang, 'ledgerEmpty')}</div>
      )}

      <div className="space-y-2">
        {dbEntries.map((entry) => (
          <div key={entry.id} className="card p-3.5 flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-saffron-50 flex items-center justify-center mt-0.5">
              <ScrollText className="w-4 h-4 text-saffron-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink-800">
                {ACTION_LABELS[entry.action]?.[lang] ?? entry.action}
              </div>
              {entry.details && (
                <div className="text-xs text-ink-500 mt-0.5">{entry.details}</div>
              )}
              {entry.schemeId && (
                <div className="text-xs text-saffron-600 mt-0.5">Scheme: {entry.schemeId}</div>
              )}
            </div>
            <div className="shrink-0 text-xs text-ink-400">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
