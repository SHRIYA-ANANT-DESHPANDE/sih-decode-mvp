import { useState, useRef, useEffect, useCallback } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import { detectLanguage, classifyIntent, type Intent } from '../lib/nlp'
import { Mic, Send, Square, Languages, Check, Pencil } from 'lucide-react'

type Props = {
  lang: Lang
  onQuery: (text: string) => void
  voiceSupported: boolean
  setVoiceSupported: (v: boolean) => void
  langLocked: boolean
  detectedLang: Lang | null
  onLangDetected: (lang: Lang) => void
  intent: Intent | null
  onIntentChange: (intent: Intent) => void
  missingQuestionKey: string | null
  onAnswerQuestion: (answer: string) => void
}

export function Chat({
  lang, onQuery, voiceSupported, setVoiceSupported,
  langLocked, detectedLang, onLangDetected,
  intent, onIntentChange, missingQuestionKey, onAnswerQuestion,
}: Props) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [editingTranscript, setEditingTranscript] = useState(false)
  const [editedText, setEditedText] = useState('')
  const recRef = useRef<unknown>(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setVoiceSupported(false)
      return
    }
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN'
    rec.onresult = (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => {
      const tr = e.results[0][0].transcript
      setTranscript(tr)
      setEditedText(tr)
      if (!langLocked) {
        const detected = detectLanguage(tr)
        onLangDetected(detected)
      }
      const ci = classifyIntent(tr)
      onIntentChange(ci)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => {
      try {
        rec.abort()
      } catch {
        // ignore
      }
    }
  }, [lang, onQuery, setVoiceSupported, langLocked, onLangDetected, onIntentChange])

  const toggleVoice = useCallback(() => {
    const rec = recRef.current as { start: () => void; stop: () => void; abort: () => void } | null
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
    } else {
      try {
        rec.start()
        setListening(true)
      } catch {
        setListening(false)
      }
    }
  }, [listening])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      processQuery(text.trim())
      setText('')
    }
  }

  const processQuery = (input: string) => {
    if (!langLocked) {
      const detected = detectLanguage(input)
      onLangDetected(detected)
    }
    const ci = classifyIntent(input)
    onIntentChange(ci)
    onQuery(input)
  }

  const confirmTranscript = () => {
    if (editedText.trim()) {
      processQuery(editedText.trim())
    }
    setTranscript(null)
    setEditingTranscript(false)
    setEditedText('')
  }

  const continueTranscript = () => {
    setTranscript(null)
    setEditingTranscript(false)
    setEditedText('')
  }

  const handleQuickAnswer = (answer: string) => {
    onAnswerQuestion(answer)
    setText('')
  }

  return (
    <div className="card p-4 sm:p-5 space-y-3">
      {/* Language badge */}
      {langLocked && detectedLang && (
        <div className="inline-flex items-center gap-1.5 chip bg-leaf-50 text-leaf-700 text-xs">
          <Languages className="w-3.5 h-3.5" />
          {t(lang, 'languageLocked')}: {detectedLang.toUpperCase()}
        </div>
      )}

      {/* Intent indicator */}
      {intent && (
        <div className="text-xs text-ink-500 animate-fade-up">
          {intent === 'discovery' ? t(lang, 'intentDiscovery') : t(lang, 'intentInfo')}
        </div>
      )}

      {/* Progressive question prompt */}
      {missingQuestionKey && (
        <div className="rounded-xl bg-saffron-50 border border-saffron-200 px-4 py-3 animate-fade-up">
          <p className="text-sm text-saffron-800 font-medium">{t(lang, missingQuestionKey as string) || t(lang, 'needMoreInfo')}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingQuestionKey === 'askAge' && ['25', '35', '45', '55', '65', '75'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a)} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askBpl' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askWidow' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askDisability' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askVeteran' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askStudent' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askLand' && ['Yes', 'No'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askGender' && ['Male', 'Female', 'Other'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a.toLowerCase())} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
            {missingQuestionKey === 'askCaste' && ['SC', 'ST', 'OBC', 'General'].map((a) => (
              <button key={a} onClick={() => handleQuickAnswer(a)} className="chip bg-white text-saffron-700 text-xs border border-saffron-200 hover:bg-saffron-100 transition-colors">
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcription review */}
      {transcript && (
        <div className="rounded-xl bg-leaf-50 border border-leaf-200 px-4 py-3 animate-fade-up space-y-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-leaf-600" />
            <span className="text-sm font-medium text-leaf-800">{t(lang, 'heardTitle')}</span>
          </div>
          {editingTranscript ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-leaf-200 px-3 py-2 text-sm text-ink-800 focus:border-leaf-400 focus:ring-2 focus:ring-leaf-200 outline-none"
            />
          ) : (
            <p className="text-sm text-ink-700 italic">"{transcript}"</p>
          )}
          <div className="flex gap-2">
            {editingTranscript ? (
              <button onClick={confirmTranscript} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-leaf-500 text-white text-sm font-medium hover:bg-leaf-600 transition-colors">
                <Check className="w-3.5 h-3.5" />
                {t(lang, 'continueTranscript')}
              </button>
            ) : (
              <>
                <button onClick={() => setEditingTranscript(true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-leaf-200 text-leaf-700 text-sm font-medium hover:bg-leaf-100 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                  {t(lang, 'editTranscript')}
                </button>
                <button onClick={continueTranscript} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-leaf-500 text-white text-sm font-medium hover:bg-leaf-600 transition-colors">
                  <Check className="w-3.5 h-3.5" />
                  {t(lang, 'continueTranscript')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(lang, 'chatPlaceholder')}
            rows={2}
            className="w-full resize-none rounded-xl border border-ink-200 px-4 py-3 pr-12 text-base text-ink-900 placeholder:text-ink-400 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
        </div>

        {voiceSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={listening ? t(lang, 'voiceOff') : t(lang, 'voiceOn')}
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              listening
                ? 'bg-red-500 text-white animate-pulse-soft'
                : 'bg-leaf-50 text-leaf-600 border border-leaf-200 hover:bg-leaf-100'
            }`}
          >
            {listening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        )}

        <button
          type="submit"
          disabled={!text.trim()}
          className="shrink-0 w-12 h-12 rounded-xl bg-saffron-500 text-white flex items-center justify-center hover:bg-saffron-600 disabled:bg-ink-200 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {listening && (
        <div className="flex items-center gap-2 text-sm text-leaf-700">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
          {t(lang, 'listening')}
        </div>
      )}

      {!voiceSupported && (
        <div className="text-sm text-ink-400">{t(lang, 'voiceUnsupported')}</div>
      )}
    </div>
  )
}
