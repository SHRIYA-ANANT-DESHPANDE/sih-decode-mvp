import { useState, useCallback } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { SchemeMatch } from '../lib/engine'
import { getRejectionReasons } from '../lib/engine'
import { computeAutofill, computeDocReadiness, type KycVault, type AutofillResult } from '../lib/vault'
import { AutofillView } from './AutofillView'
import { X, CheckCircle2, AlertCircle, FileText, ListChecks, Send, ThumbsUp, ThumbsDown, HelpCircle, ExternalLink, Calendar, Zap, Package, Phone } from 'lucide-react'

type Props = {
  match: SchemeMatch
  lang: Lang
  followUps: Array<{ q: string; a: string }>
  onFollowUp: (q: string, a: string) => void
  feedback: string | null
  onFeedback: (fb: string) => void
  onClose: () => void
  vault: KycVault
  onAutofill: (schemeId: string) => void
}

export function SchemeDetail({ match, lang, followUps, onFollowUp, feedback, onFeedback, onClose, vault, onAutofill }: Props) {
  const { scheme, matched, unmatched, missing, eligible, partial, confidence } = match
  const [question, setQuestion] = useState('')
  const [thinking, setThinking] = useState(false)
  const [showAutofill, setShowAutofill] = useState(false)
  const [autofillResult] = useState<AutofillResult>(() => computeAutofill(scheme, vault, match.scheme.criteria.length > 0 ? { age: 30 } as never : {} as never))
  const docReadiness = computeDocReadiness(scheme, vault)
  const rejectionReasons = getRejectionReasons(match, lang)

  const handleAsk = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setThinking(true)
    setTimeout(() => {
      const answer = generateAnswer(question, scheme, lang)
      onFollowUp(question.trim(), answer)
      setQuestion('')
      setThinking(false)
    }, 500)
  }, [question, scheme, lang, onFollowUp])

  const haveDocs = docReadiness.filter((d) => d.status === 'have')
  const missingDocs = docReadiness.filter((d) => d.status === 'missing')
  const expiredDocs = docReadiness.filter((d) => d.status === 'expired')
  const isReady = missingDocs.length === 0 && expiredDocs.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-900/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-lift max-h-[92vh] overflow-y-auto animate-fade-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ink-100 px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`inline-flex items-center gap-1.5 chip text-xs ${
                eligible ? 'bg-leaf-50 text-leaf-700' : partial ? 'bg-saffron-50 text-saffron-700' : 'bg-ink-50 text-ink-500'
              }`}>
                {eligible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {eligible ? t(lang, 'eligible') : t(lang, 'likelyEligible')}
              </div>
              <div className={`chip text-xs ${
                confidence === 'high' ? 'bg-leaf-50 text-leaf-600' :
                confidence === 'medium' ? 'bg-saffron-50 text-saffron-600' :
                'bg-red-50 text-red-500'
              }`}>
                {confidence === 'high' ? t(lang, 'confidenceHigh') : confidence === 'medium' ? t(lang, 'confidenceMedium') : t(lang, 'confidenceLow')}
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-ink-900">{scheme.name[lang]}</h2>
            <div className="text-sm text-ink-500 mt-0.5">{scheme.ministry[lang]}</div>
          </div>
          <button onClick={onClose} className="shrink-0 w-10 h-10 rounded-lg hover:bg-ink-50 flex items-center justify-center text-ink-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Summary */}
          <p className="text-ink-700 leading-relaxed">{scheme.summary[lang]}</p>

          {/* Key info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoChip label={t(lang, 'schemeAmount')} value={scheme.amount[lang]} />
            <InfoChip label={t(lang, 'schemeCategory')} value={scheme.category[lang]} />
          </div>

          {/* Why matched */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-leaf-500" />
              {t(lang, 'matchedCriteria')}
            </h3>
            {matched.length > 0 ? (
              <ul className="space-y-2">
                {matched.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <CheckCircle2 className="w-4 h-4 text-leaf-500 mt-0.5 shrink-0" />
                    <span>{m.criterion.label[lang]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-400">—</p>
            )}
          </div>

          {/* Why NOT matched (rejection reasons) */}
          {rejectionReasons.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <h3 className="font-display font-semibold text-red-800 mb-2 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                {t(lang, 'whyNotTitle')}
              </h3>
              <ul className="space-y-2">
                {rejectionReasons.map((r, i) => (
                  <li key={i} className="text-sm text-red-700">
                    <span className="font-medium">{r.criterion}</span>: {r.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unmatched (non-required) */}
          {unmatched.filter((m) => !m.required).length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-saffron-400" />
                {t(lang, 'unmatchedCriteria')}
              </h3>
              <ul className="space-y-2">
                {unmatched.filter((m) => !m.required).map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                    <X className="w-4 h-4 text-saffron-400 mt-0.5 shrink-0" />
                    <span>{m.criterion.label[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing info */}
          {missing.length > 0 && partial && (
            <div className="rounded-xl bg-saffron-50 border border-saffron-200 p-4">
              <p className="text-sm text-saffron-800 font-medium">{t(lang, 'partialNote')}</p>
              <ul className="mt-2 space-y-1">
                {missing.map((m, i) => (
                  <li key={i} className="text-sm text-saffron-700 flex items-start gap-1.5">
                    <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{m.criterion.label[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application readiness */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-saffron-500" />
              {t(lang, 'appReadiness')}
            </h3>
            <div className={`rounded-xl p-4 ${isReady ? 'bg-leaf-50 border border-leaf-200' : 'bg-saffron-50 border border-saffron-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                {isReady ? <CheckCircle2 className="w-5 h-5 text-leaf-600" /> : <AlertCircle className="w-5 h-5 text-saffron-600" />}
                <span className={`font-medium text-sm ${isReady ? 'text-leaf-800' : 'text-saffron-800'}`}>
                  {isReady ? t(lang, 'readyToApply') : t(lang, 'notReady')}
                </span>
              </div>
              <div className="space-y-1.5">
                {haveDocs.length > 0 && (
                  <div className="text-sm text-leaf-700">
                    <span className="font-medium">{t(lang, 'docsHave')}:</span> {haveDocs.map((d) => d.document).join(', ')}
                  </div>
                )}
                {missingDocs.length > 0 && (
                  <div className="text-sm text-red-600">
                    <span className="font-medium">{t(lang, 'docsMissing')}:</span> {missingDocs.map((d) => d.document).join(', ')}
                  </div>
                )}
                {expiredDocs.length > 0 && (
                  <div className="text-sm text-saffron-700">
                    <span className="font-medium">{t(lang, 'docsExpired')}:</span> {expiredDocs.map((d) => d.document).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Autofill */}
          {showAutofill ? (
            <div className="rounded-xl border border-saffron-200 p-4">
              <AutofillView
                result={autofillResult}
                lang={lang}
                onConfirm={() => onAutofill(scheme.id)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowAutofill(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-saffron-50 border border-saffron-200 text-saffron-700 hover:bg-saffron-100 transition-colors text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              {t(lang, 'autofillRun')}
            </button>
          )}

          {/* Documents */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-saffron-500" />
              {t(lang, 'documents')}
            </h3>
            <ul className="space-y-2">
              {scheme.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 mt-2 shrink-0" />
                  <span>{doc[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Apply steps */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-leaf-500" />
              {t(lang, 'applySteps')}
            </h3>
            <ol className="space-y-3">
              {scheme.applySteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-leaf-100 text-leaf-700 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink-700 pt-1">{step[lang]}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sources & verification */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-ink-500" />
              {t(lang, 'sourcesTitle')}
            </h3>
            <div className="space-y-2">
              {scheme.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-saffron-600 hover:text-saffron-700 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {src.label[lang]}
                </a>
              ))}
              <div className="flex items-center gap-2 text-xs text-ink-400 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                {t(lang, 'lastVerified')}: {scheme.lastVerified}
              </div>
            </div>
          </div>

          {/* Follow-up Q&A */}
          <div>
            <h3 className="font-display font-semibold text-ink-800 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-ink-500" />
              {t(lang, 'askFollowUp')}
            </h3>
            {followUps.length > 0 && (
              <div className="space-y-3 mb-3">
                {followUps.map((qa, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="text-sm font-medium text-ink-800 bg-ink-50 rounded-lg px-3 py-2">
                      {qa.q}
                    </div>
                    <div className="text-sm text-ink-600 bg-saffron-50 rounded-lg px-3 py-2 border border-saffron-100">
                      {qa.a}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAsk} className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t(lang, 'followUpPlaceholder')}
                className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none"
              />
              <button type="submit" disabled={!question.trim() || thinking} className="shrink-0 w-10 h-10 rounded-xl bg-saffron-500 text-white flex items-center justify-center disabled:bg-ink-200 transition-all active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </form>
            {thinking && (
              <div className="mt-2 text-sm text-ink-400 animate-pulse-soft">{t(lang, 'thinking')}</div>
            )}
          </div>

          {/* Escalation */}
          <div className="rounded-xl bg-ink-50 border border-ink-100 p-4">
            <h3 className="font-display font-semibold text-ink-800 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-ink-500" />
              {t(lang, 'escalationTitle')}
            </h3>
            <p className="text-sm text-ink-600 mb-3">{t(lang, 'escalationDesc')}</p>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${t(lang, 'escHelpline')}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-leaf-200 text-leaf-700 hover:bg-leaf-50 transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" />
                {t(lang, 'escHelplineLabel')}
              </a>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-ink-200 text-ink-600 text-sm font-medium">
                {t(lang, 'visitOffice')}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="border-t border-ink-100 pt-4">
            <p className="text-sm text-ink-600 mb-2">{t(lang, 'feedbackPrompt')}</p>
            {feedback ? (
              <div className="text-sm text-leaf-700 font-medium">{t(lang, 'thanks')}</div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => onFeedback('yes')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-leaf-200 text-leaf-700 hover:bg-leaf-50 transition-colors text-sm font-medium"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {t(lang, 'feedbackYes')}
                </button>
                <button
                  onClick={() => onFeedback('no')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 transition-colors text-sm font-medium"
                >
                  <ThumbsDown className="w-4 h-4" />
                  {t(lang, 'feedbackNo')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-400 font-semibold">{label}</div>
      <div className="text-sm font-semibold text-ink-800 mt-0.5">{value}</div>
    </div>
  )
}

function generateAnswer(q: string, scheme: SchemeMatch['scheme'], lang: Lang): string {
  const lower = q.toLowerCase()
  if (/document|कागज|कागदपत्र|दस्तावेज/.test(lower)) {
    return scheme.documents.map((d) => d[lang]).join(', ') + '.'
  }
  if (/amount|राशि|रक्कम|लाभ|benefit|money|कितना|किती/.test(lower)) {
    return scheme.amount[lang]
  }
  if (/apply|आवेदन|अर्ज|कैसे|कसा|how|कसे/.test(lower)) {
    return scheme.applySteps.map((s, i) => `${i + 1}. ${s[lang]}`).join(' ')
  }
  if (/eligible|पात्र|पात्रता|qualify|who/.test(lower)) {
    return scheme.criteria.map((c) => c.label[lang]).join(', ') + '.'
  }
  return scheme.summary[lang]
}
