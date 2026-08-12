import { useState, useEffect, useCallback } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import { supabase, type AuditRow } from '../lib/supabase'
import { ArrowLeft, Search, Clock, Globe, MessageSquare, ChevronDown } from 'lucide-react'

type Props = {
  lang: Lang
  onBack: () => void
}

export function AuditView({ lang, onBack }: Props) {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('citizen_interaction_audit')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) {
      setError(error.message)
    } else {
      setRows((data as AuditRow[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = rows.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (r.user_query ?? '').toLowerCase().includes(q) ||
      r.session_id.toLowerCase().includes(q) ||
      r.language.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink-900">{t(lang, 'auditTitle')}</h1>
          <p className="text-sm text-ink-500 mt-1">{t(lang, 'auditSubtitle')}</p>
        </div>
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'backHome')}
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by query, session, language…"
          className="w-full rounded-xl border border-ink-200 pl-10 pr-4 py-2.5 text-sm focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none"
        />
      </div>

      {loading && (
        <div className="card p-8 text-center text-ink-400 animate-pulse-soft">{t(lang, 'thinking')}</div>
      )}

      {error && (
        <div className="card p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-8 text-center text-ink-400">No interactions logged yet.</div>
      )}

      <div className="space-y-2">
        {filtered.map((row) => (
          <div key={row.id} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === row.id ? null : row.id ?? null)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-ink-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-saffron-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-800 truncate">
                    {row.user_query || '(no text)'}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {row.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {row.created_at ? new Date(row.created_at).toLocaleString() : ''}
                    </span>
                    {row.recommended_scheme_ids?.length ? (
                      <span className="chip bg-leaf-50 text-leaf-700 text-[10px]">
                        {row.recommended_scheme_ids.length} schemes
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-ink-400 shrink-0 transition-transform ${expanded === row.id ? 'rotate-180' : ''}`} />
            </button>

            {expanded === row.id && (
              <div className="border-t border-ink-100 p-4 space-y-3 bg-ink-50/50">
                <Detail label="Session ID" value={row.session_id} mono />
                <Detail label="Query" value={row.user_query ?? '—'} />
                <Detail label="Language" value={row.language} />
                <div>
                  <div className="text-xs font-semibold text-ink-400 uppercase mb-1">Extracted Profile</div>
                  <pre className="text-xs text-ink-700 bg-white rounded-lg p-3 overflow-x-auto border border-ink-100">
                    {JSON.stringify(row.extracted_profile ?? {}, null, 2)}
                  </pre>
                </div>
                {row.recommended_scheme_ids?.length ? (
                  <div>
                    <div className="text-xs font-semibold text-ink-400 uppercase mb-1">Recommended Schemes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {row.recommended_scheme_ids.map((id) => (
                        <span key={id} className="chip bg-leaf-50 text-leaf-700 text-xs">{id}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {row.follow_up_qa?.length ? (
                  <div>
                    <div className="text-xs font-semibold text-ink-400 uppercase mb-1">Follow-up Q&A</div>
                    <pre className="text-xs text-ink-700 bg-white rounded-lg p-3 overflow-x-auto border border-ink-100">
                      {JSON.stringify(row.follow_up_qa, null, 2)}
                    </pre>
                  </div>
                ) : null}
                {row.feedback && (
                  <Detail label="Feedback" value={row.feedback} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold text-ink-400 uppercase mb-0.5">{label}</div>
      <div className={`text-sm text-ink-700 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}
