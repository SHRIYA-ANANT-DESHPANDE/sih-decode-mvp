import { useState, useEffect } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import type { KycVault, KycDocument } from '../lib/vault'
import { loadVault, saveVault, clearVault, exportVault, createLedgerEntry } from '../lib/vault'
import type { Profile } from '../lib/schemes'
import { ShieldCheck, Save, Trash2, Download, FileCheck, FileX, FileClock, Plus } from 'lucide-react'

type Props = {
  lang: Lang
  profile: Profile
  onVaultChange: (vault: KycVault) => void
  onLedger: (entry: ReturnType<typeof createLedgerEntry>) => void
}

const DOC_TYPES: Array<{ value: KycDocument['type']; label: { en: string; hi: string; mr: string } }> = [
  { value: 'aadhaar', label: { en: 'Aadhaar', hi: 'आधार', mr: 'आधार' } },
  { value: 'income', label: { en: 'Income certificate', hi: 'आय प्रमाणपत्र', mr: 'उत्पन्न प्रमाणपत्र' } },
  { value: 'caste', label: { en: 'Caste certificate', hi: 'जाति प्रमाणपत्र', mr: 'जात प्रमाणपत्र' } },
  { value: 'bank', label: { en: 'Bank passbook', hi: 'बैंक पासबुक', mr: 'बँक पासबुक' } },
  { value: 'land', label: { en: 'Land document', hi: 'भूमि दस्तावेज़', mr: 'जमीन कागदपत्र' } },
  { value: 'disability', label: { en: 'Disability certificate', hi: 'विकलांगता प्रमाणपत्र', mr: 'विकलांगता प्रमाणपत्र' } },
  { value: 'death', label: { en: 'Death certificate', hi: 'मृत्यु प्रमाणपत्र', mr: 'मृत्यू प्रमाणपत्र' } },
  { value: 'vending', label: { en: 'Vending certificate', hi: 'वेंडिंग प्रमाणपत्र', mr: 'वेंडिंग प्रमाणपत्र' } },
  { value: 'esm', label: { en: 'ESM I-Card', hi: 'ESM I-Card', mr: 'ESM I-Card' } },
  { value: 'birth', label: { en: 'Birth certificate', hi: 'जन्म प्रमाणपत्र', mr: 'जन्म प्रमाणपत्र' } },
  { value: 'other', label: { en: 'Other', hi: 'अन्य', mr: 'इतर' } },
]

const FIELDS: Array<{ key: keyof KycVault; label: { en: string; hi: string; mr: string }; type: 'text' | 'number' | 'date' }> = [
  { key: 'fullName', label: { en: 'Full name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' }, type: 'text' },
  { key: 'aadhaar', label: { en: 'Aadhaar number', hi: 'आधार नंबर', mr: 'आधार नंबर' }, type: 'text' },
  { key: 'mobile', label: { en: 'Mobile number', hi: 'मोबाइल नंबर', mr: 'मोबाईल नंबर' }, type: 'text' },
  { key: 'dob', label: { en: 'Date of birth', hi: 'जन्म तिथि', mr: 'जन्म दिनांक' }, type: 'date' },
  { key: 'gender', label: { en: 'Gender', hi: 'लिंग', mr: 'लिंग' }, type: 'text' },
  { key: 'address', label: { en: 'Address', hi: 'पता', mr: 'पत्ता' }, type: 'text' },
  { key: 'state', label: { en: 'State', hi: 'राज्य', mr: 'राज्य' }, type: 'text' },
  { key: 'district', label: { en: 'District', hi: 'ज़िला', mr: 'जिल्हा' }, type: 'text' },
  { key: 'pincode', label: { en: 'Pincode', hi: 'पिनकोड', mr: 'पिनकोड' }, type: 'text' },
  { key: 'bankAccount', label: { en: 'Bank account number', hi: 'बैंक खाता नंबर', mr: 'बँक खाते नंबर' }, type: 'text' },
  { key: 'ifsc', label: { en: 'IFSC code', hi: 'IFSC कोड', mr: 'IFSC कोड' }, type: 'text' },
  { key: 'caste', label: { en: 'Caste category', hi: 'जाति श्रेणी', mr: 'जात श्रेणी' }, type: 'text' },
  { key: 'income', label: { en: 'Annual income (₹)', hi: 'वार्षिक आय (₹)', mr: 'वार्षिक उत्पन्न (₹)' }, type: 'number' },
  { key: 'bplNumber', label: { en: 'BPL card number', hi: 'BPL कार्ड नंबर', mr: 'BPL कार्ड नंबर' }, type: 'text' },
  { key: 'rationCard', label: { en: 'Ration card number', hi: 'राशन कार्ड नंबर', mr: 'रेशन कार्ड नंबर' }, type: 'text' },
  { key: 'incomeCertNo', label: { en: 'Income certificate no.', hi: 'आय प्रमाणपत्र नंबर', mr: 'उत्पन्न प्रमाणपत्र नंबर' }, type: 'text' },
  { key: 'casteCertNo', label: { en: 'Caste certificate no.', hi: 'जाति प्रमाणपत्र नंबर', mr: 'जात प्रमाणपत्र नंबर' }, type: 'text' },
  { key: 'disabilityCertNo', label: { en: 'Disability certificate no.', hi: 'विकलांगता प्रमाणपत्र नंबर', mr: 'विकलांगता प्रमाणपत्र नंबर' }, type: 'text' },
  { key: 'esmId', label: { en: 'ESM I-Card number', hi: 'ESM I-Card नंबर', mr: 'ESM I-Card नंबर' }, type: 'text' },
  { key: 'ppo', label: { en: 'PPO number', hi: 'PPO नंबर', mr: 'PPO नंबर' }, type: 'text' },
  { key: 'landDocNo', label: { en: 'Land document no.', hi: 'भूमि दस्तावेज़ नंबर', mr: 'जमीन कागदपत्र नंबर' }, type: 'text' },
  { key: 'nominee', label: { en: 'Nominee name', hi: 'नॉमिनी नाम', mr: 'नॉमिनी नाव' }, type: 'text' },
  { key: 'guardianName', label: { en: 'Guardian name', hi: 'अभिभावक नाम', mr: 'पालक नाव' }, type: 'text' },
  { key: 'childName', label: { en: 'Child name', hi: 'बच्चे का नाम', mr: 'मुलाचे नाव' }, type: 'text' },
  { key: 'childDob', label: { en: 'Child date of birth', hi: 'बच्चे की जन्म तिथि', mr: 'मुलाचा जन्म दिनांक' }, type: 'date' },
  { key: 'institutionName', label: { en: 'Institution name', hi: 'संस्थान नाम', mr: 'संस्था नाव' }, type: 'text' },
  { key: 'vendingCertNo', label: { en: 'Vending certificate no.', hi: 'वेंडिंग प्रमाणपत्र नंबर', mr: 'वेंडिंग प्रमाणपत्र नंबर' }, type: 'text' },
]

export function KycVaultView({ lang, profile, onVaultChange, onLedger }: Props) {
  const [vault, setVault] = useState<KycVault | null>(null)
  const [saved, setSaved] = useState(false)
  const [showDocForm, setShowDocForm] = useState(false)
  const [newDoc, setNewDoc] = useState<{ name: string; type: KycDocument['type']; status: KycDocument['status'] }>({
    name: '', type: 'aadhaar', status: 'have',
  })

  useEffect(() => {
    const v = loadVault()
    if (v) {
      setVault(v)
    } else {
      const fresh: KycVault = { documents: [] }
      if (profile.age !== undefined) fresh.age = profile.age
      if (profile.gender) fresh.gender = profile.gender
      if (profile.state) fresh.state = profile.state
      if (profile.income !== undefined) fresh.income = profile.income
      if (profile.caste) fresh.caste = profile.caste
      setVault(fresh)
    }
  }, [profile])

  const update = (key: keyof KycVault, value: string | number | undefined) => {
    setVault((prev) => {
      if (!prev) return prev
      const next = { ...prev, [key]: value || undefined }
      return next
    })
    setSaved(false)
  }

  const handleSave = () => {
    if (!vault) return
    saveVault(vault)
    onVaultChange(vault)
    onLedger(createLedgerEntry('vault_updated', 'Vault saved by user'))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = () => {
    clearVault()
    setVault({ documents: [] })
    onVaultChange({ documents: [] })
    onLedger(createLedgerEntry('vault_updated', 'Vault cleared by user'))
  }

  const handleExport = () => {
    if (!vault) return
    const data = exportVault(vault, profile)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sahaai-kyc-export.json'
    a.click()
    URL.revokeObjectURL(url)
    onLedger(createLedgerEntry('data_exported', 'User exported vault data'))
  }

  const addDocument = () => {
    if (!vault || !newDoc.name.trim()) return
    const doc: KycDocument = {
      id: crypto.randomUUID(),
      name: newDoc.name,
      type: newDoc.type,
      status: newDoc.status,
      uploadedAt: new Date().toISOString(),
    }
    const next = { ...vault, documents: [...vault.documents, doc] }
    setVault(next)
    onLedger(createLedgerEntry('document_uploaded', `Uploaded: ${newDoc.name} (${newDoc.status})`))
    setNewDoc({ name: '', type: 'aadhaar', status: 'have' })
    setShowDocForm(false)
  }

  const removeDocument = (id: string) => {
    if (!vault) return
    setVault({ ...vault, documents: vault.documents.filter((d) => d.id !== id) })
  }

  const docStatusIcon = (status: KycDocument['status']) => {
    if (status === 'have') return <FileCheck className="w-4 h-4 text-leaf-500" />
    if (status === 'missing') return <FileX className="w-4 h-4 text-red-400" />
    return <FileClock className="w-4 h-4 text-saffron-500" />
  }

  if (!vault) return null

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-leaf-500" />
          {t(lang, 'vaultTitle')}
        </h1>
        <p className="text-sm text-ink-500 mt-1">{t(lang, 'vaultDesc')}</p>
      </div>

      {saved && (
        <div className="rounded-xl bg-leaf-50 border border-leaf-200 px-4 py-3 text-sm text-leaf-700 font-medium animate-fade-up">
          {t(lang, 'vaultSaved')}
        </div>
      )}

      <div className="card p-5 space-y-4">
        <h3 className="font-display font-semibold text-ink-800">{t(lang, 'vaultFill')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1">
              <span className="text-xs text-ink-500 font-medium">{f.label[lang]}</span>
              <input
                type={f.type}
                value={String(vault[f.key] ?? '')}
                onChange={(e) => update(f.key, f.type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value || undefined)}
                className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-ink-800">{t(lang, 'docsHave')}</h3>
          <button
            onClick={() => setShowDocForm(!showDocForm)}
            className="inline-flex items-center gap-1 text-sm text-saffron-600 hover:text-saffron-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            {t(lang, 'docsHave')}
          </button>
        </div>

        {showDocForm && (
          <div className="rounded-xl bg-ink-50 p-4 space-y-3 animate-fade-up">
            <input
              type="text"
              value={newDoc.name}
              onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
              placeholder="Document name"
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-saffron-400 outline-none"
            />
            <div className="flex gap-2">
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as KycDocument['type'] })}
                className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-saffron-400 outline-none flex-1"
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label[lang]}</option>
                ))}
              </select>
              <select
                value={newDoc.status}
                onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value as KycDocument['status'] })}
                className="rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-saffron-400 outline-none flex-1"
              >
                <option value="have">{t(lang, 'docsHave')}</option>
                <option value="missing">{t(lang, 'docsMissing')}</option>
                <option value="expired">{t(lang, 'docsExpired')}</option>
              </select>
              <button onClick={addDocument} className="btn-primary text-sm px-4 py-2">
                {t(lang, 'save')}
              </button>
            </div>
          </div>
        )}

        {vault.documents.length > 0 ? (
          <div className="space-y-2">
            {vault.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  {docStatusIcon(doc.status)}
                  <div>
                    <div className="text-sm font-medium text-ink-800">{doc.name}</div>
                    <div className="text-xs text-ink-400">
                      {DOC_TYPES.find((d) => d.value === doc.type)?.label[lang]} · {doc.status}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-ink-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-400">{t(lang, 'vaultEmpty')}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4" />
          {t(lang, 'save')}
        </button>
        <button onClick={handleExport} className="btn-ghost">
          <Download className="w-4 h-4" />
          {t(lang, 'vaultExport')}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
          <Trash2 className="w-4 h-4" />
          {t(lang, 'vaultClear')}
        </button>
      </div>
    </div>
  )
}
