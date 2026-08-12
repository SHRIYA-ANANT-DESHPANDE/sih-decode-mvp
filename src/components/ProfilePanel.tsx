import { useState } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { Profile } from '../lib/schemes'
import { User, Pencil, Check, X } from 'lucide-react'

type Props = {
  lang: Lang
  profile: Profile
  onEdit: () => void
}

export function ProfilePanel({ lang, profile }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Profile>(profile)

  const hasAny = Object.values(profile).some((v) => v !== undefined && v !== null && v !== false)

  if (!hasAny && !editing) return null

  const fields: Array<{ key: keyof Profile; label: string; type: 'text' | 'number' | 'bool' }> = [
    { key: 'age', label: t(lang, 'age'), type: 'number' },
    { key: 'gender', label: t(lang, 'gender'), type: 'text' },
    { key: 'state', label: t(lang, 'state'), type: 'text' },
    { key: 'occupation', label: t(lang, 'occupation'), type: 'text' },
    { key: 'income', label: t(lang, 'income'), type: 'number' },
    { key: 'caste', label: t(lang, 'caste'), type: 'text' },
    { key: 'widow', label: t(lang, 'widow'), type: 'bool' },
    { key: 'disability', label: t(lang, 'disability'), type: 'bool' },
    { key: 'veteran', label: t(lang, 'veteran'), type: 'bool' },
    { key: 'student', label: t(lang, 'student'), type: 'bool' },
    { key: 'bpl', label: t(lang, 'bpl'), type: 'bool' },
    { key: 'farmer', label: 'Farmer', type: 'bool' },
    { key: 'landowner', label: t(lang, 'landowner'), type: 'bool' },
  ]

  return (
    <div className="card p-4 animate-fade-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center">
            <User className="w-4 h-4 text-saffron-600" />
          </div>
          <h3 className="font-display font-semibold text-ink-800 text-sm">{t(lang, 'profileDetected')}</h3>
        </div>
        {!editing ? (
          <button
            onClick={() => { setDraft(profile); setEditing(true) }}
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-saffron-600 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t(lang, 'editProfile')}
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 text-sm text-leaf-600 hover:text-leaf-700"
            >
              <Check className="w-4 h-4" />
              {t(lang, 'save')}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-600"
            >
              <X className="w-4 h-4" />
              {t(lang, 'cancel')}
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="flex flex-wrap gap-1.5">
          {fields.map((f) => {
            const val = profile[f.key]
            if (val === undefined || val === null || val === false) return null
            return (
              <span key={f.key} className="chip bg-ink-50 text-ink-700 text-xs">
                {f.label}: <span className="font-semibold ml-1">{String(val)}</span>
              </span>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fields.map((f) => {
            if (f.type === 'bool') {
              return (
                <label key={f.key} className="flex items-center gap-2 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    checked={!!(draft[f.key] as boolean)}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.checked })}
                    className="w-4 h-4 rounded accent-saffron-500"
                  />
                  {f.label}
                </label>
              )
            }
            return (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="text-xs text-ink-500">{f.label}</span>
                <input
                  type={f.type}
                  value={(draft[f.key] as string | number | undefined) ?? ''}
                  onChange={(e) => setDraft({
                    ...draft,
                    [f.key]: f.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value || undefined,
                  })}
                  className="rounded-lg border border-ink-200 px-2 py-1.5 text-sm focus:border-saffron-400 outline-none"
                />
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
