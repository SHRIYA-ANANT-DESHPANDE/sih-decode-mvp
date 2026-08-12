import { useState, useCallback, useRef, useEffect } from 'react'
import type { Lang } from './lib/i18n'
import { t, LANGS } from './lib/i18n'
import type { Profile } from './lib/schemes'
import { extractProfile, rankSchemes, getMissingProfileFields, type SchemeMatch } from './lib/engine'
import { detectLanguage, classifyIntent, type Intent } from './lib/nlp'
import { supabase, type AuditRow } from './lib/supabase'
import { loadVault, saveVault, createLedgerEntry, saveLedger, loadLedger, type KycVault, type LedgerEntry } from './lib/vault'
import { Landing } from './components/Landing'
import { Chat } from './components/Chat'
import { SchemeCard } from './components/SchemeCard'
import { SchemeDetail } from './components/SchemeDetail'
import { ProfilePanel } from './components/ProfilePanel'
import { AuditView } from './components/AuditView'
import { Header } from './components/Header'
import { KycVaultView } from './components/KycVault'
import { DataLedger } from './components/DataLedger'
import { DemoMode } from './components/DemoMode'
import { Mic, BarChart3, Globe, Sparkles, ShieldCheck, Lock, ScrollText, FlaskConical } from 'lucide-react'

type View = 'landing' | 'chat' | 'audit' | 'vault' | 'ledger' | 'demo'

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [view, setView] = useState<View>('landing')
  const [profile, setProfile] = useState<Profile>({})
  const [matches, setMatches] = useState<SchemeMatch[]>([])
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [followUps, setFollowUps] = useState<Array<{ q: string; a: string }>>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const auditTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [langLocked, setLangLocked] = useState(false)
  const [detectedLang, setDetectedLang] = useState<Lang | null>(null)
  const [intent, setIntent] = useState<Intent | null>(null)
  const [vault, setVault] = useState<KycVault>(() => loadVault() ?? { documents: [] })
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => loadLedger())
  const [missingQuestionKey, setMissingQuestionKey] = useState<string | null>(null)

  useEffect(() => {
    const v = loadVault()
    if (v) setVault(v)
  }, [])

  const addLedger = useCallback((entry: LedgerEntry) => {
    setLedgerEntries((prev) => {
      const next = [...prev, entry]
      saveLedger(next)
      return next
    })
    try {
      supabase.from('data_ledger').insert({
        session_id: sessionId,
        action: entry.action,
        details: entry.details,
        scheme_id: entry.schemeId ?? null,
      }).then(({ error }) => {
        if (error) console.error('Ledger insert failed:', error.message)
      })
    } catch {
      // ignore
    }
  }, [sessionId])

  const handleSetLang = useCallback((l: Lang) => {
    setLang(l)
    document.documentElement.lang = l
  }, [])

  const handleStart = useCallback(() => {
    setView('chat')
  }, [])

  const handleQuery = useCallback(
    (text: string) => {
      const newProfile = extractProfile(text, profile)
      setProfile(newProfile)
      const ranked = rankSchemes(newProfile)
      setMatches(ranked)

      addLedger(createLedgerEntry('profile_extracted', `Extracted from: "${text.substring(0, 80)}"`))

      const missing = getMissingProfileFields(newProfile)
      if (missing.length > 0 && ranked.some((m) => m.partial)) {
        setMissingQuestionKey(missing[0].questionKey)
      } else {
        setMissingQuestionKey(null)
      }

      const row: AuditRow = {
        session_id: sessionId,
        language: lang,
        user_query: text,
        extracted_profile: newProfile as Record<string, unknown>,
        recommended_scheme_ids: ranked.map((m) => m.scheme.id),
        follow_up_qa: followUps,
        feedback,
      }
      if (auditTimer.current) clearTimeout(auditTimer.current)
      auditTimer.current = setTimeout(() => {
        supabase.from('citizen_interaction_audit').insert(row).then(({ error }) => {
          if (error) console.error('Audit insert failed:', error.message)
        })
      }, 600)
    },
    [profile, lang, sessionId, followUps, feedback, addLedger],
  )

  const handleAnswerQuestion = useCallback((answer: string) => {
    setProfile((prev) => extractProfile(answer, prev))
    setMissingQuestionKey(null)
    setTimeout(() => {
      const updated = extractProfile(answer, profile)
      const ranked = rankSchemes(updated)
      setMatches(ranked)
      const missing = getMissingProfileFields(updated)
      if (missing.length > 0 && ranked.some((m) => m.partial)) {
        setMissingQuestionKey(missing[1]?.questionKey ?? null)
      } else {
        setMissingQuestionKey(null)
      }
    }, 100)
  }, [profile])

  const handleLangDetected = useCallback((detected: Lang) => {
    setDetectedLang(detected)
    setLang(detected)
    setLangLocked(true)
    document.documentElement.lang = detected
  }, [])

  const handleFollowUp = useCallback((q: string, a: string) => {
    setFollowUps((prev) => [...prev, { q, a }])
  }, [])

  const handleFeedback = useCallback((fb: string) => {
    setFeedback(fb)
    addLedger(createLedgerEntry('feedback_given', `Feedback: ${fb}`))
  }, [addLedger])

  const handleVaultChange = useCallback((v: KycVault) => {
    setVault(v)
    saveVault(v)
  }, [])

  const handleAutofill = useCallback((schemeId: string) => {
    addLedger(createLedgerEntry('autofill_run', `Autofill for scheme: ${schemeId}`, schemeId))
  }, [addLedger])

  const handleDemoRun = useCallback((input: string, demoLang: Lang) => {
    setLang(demoLang)
    document.documentElement.lang = demoLang
    setView('chat')
    const newProfile = extractProfile(input, {})
    setProfile(newProfile)
    const ranked = rankSchemes(newProfile)
    setMatches(ranked)
    addLedger(createLedgerEntry('profile_extracted', `Demo: "${input.substring(0, 80)}"`))
  }, [addLedger])

  const handleRestart = useCallback(() => {
    setProfile({})
    setMatches([])
    setSelectedSchemeId(null)
    setFollowUps([])
    setFeedback(null)
    setLangLocked(false)
    setDetectedLang(null)
    setIntent(null)
    setMissingQuestionKey(null)
    setView('landing')
  }, [])

  const selectedMatch = matches.find((m) => m.scheme.id === selectedSchemeId)

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        lang={lang}
        onLangChange={handleSetLang}
        onHome={handleRestart}
        onAudit={() => setView('audit')}
        onVault={() => setView('vault')}
        onLedger={() => setView('ledger')}
        onDemo={() => setView('demo')}
        showNav={view !== 'landing'}
      />

      {view === 'landing' && (
        <Landing
          lang={lang}
          onStart={handleStart}
          onAudit={() => setView('audit')}
          onVault={() => setView('vault')}
          onDemo={() => setView('demo')}
        />
      )}

      {view === 'chat' && (
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
          <ProfilePanel lang={lang} profile={profile} onEdit={() => {}} />

          <Chat
            lang={lang}
            onQuery={handleQuery}
            voiceSupported={voiceSupported}
            setVoiceSupported={setVoiceSupported}
            langLocked={langLocked}
            detectedLang={detectedLang}
            onLangDetected={handleLangDetected}
            intent={intent}
            onIntentChange={setIntent}
            missingQuestionKey={missingQuestionKey}
            onAnswerQuestion={handleAnswerQuestion}
          />

          {matches.length > 0 && (
            <div className="space-y-4 animate-fade-up">
              <h2 className="text-xl font-display font-bold text-ink-900 px-1">
                {t(lang, 'yourMatches')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {matches.map((m) => (
                  <SchemeCard
                    key={m.scheme.id}
                    match={m}
                    lang={lang}
                    onSelect={() => {
                      setSelectedSchemeId(m.scheme.id)
                      addLedger(createLedgerEntry('scheme_viewed', `Viewed: ${m.scheme.id}`, m.scheme.id))
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {matches.length === 0 && profile.age === undefined && (
            <div className="card p-6 text-center">
              <p className="text-ink-600">{t(lang, 'noSchemes')}</p>
            </div>
          )}
        </div>
      )}

      {view === 'audit' && <AuditView lang={lang} onBack={() => setView('chat')} />}

      {view === 'vault' && (
        <KycVaultView
          lang={lang}
          profile={profile}
          onVaultChange={handleVaultChange}
          onLedger={addLedger}
        />
      )}

      {view === 'ledger' && (
        <DataLedger
          lang={lang}
          onBack={() => setView('chat')}
          externalEntries={ledgerEntries}
        />
      )}

      {view === 'demo' && (
        <DemoMode
          lang={lang}
          onRun={handleDemoRun}
          onBack={() => setView('landing')}
        />
      )}

      {selectedMatch && (
        <SchemeDetail
          match={selectedMatch}
          lang={lang}
          followUps={followUps}
          onFollowUp={handleFollowUp}
          feedback={feedback}
          onFeedback={handleFeedback}
          onClose={() => setSelectedSchemeId(null)}
          vault={vault}
          onAutofill={handleAutofill}
        />
      )}

      <footer className="mt-auto border-t border-ink-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <ShieldCheck className="w-4 h-4 text-leaf-500" />
            <span>{t(lang, 'privacyNote')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-400">
            <Sparkles className="w-4 h-4 text-saffron-400" />
            <span>{t(lang, 'poweredBy')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
