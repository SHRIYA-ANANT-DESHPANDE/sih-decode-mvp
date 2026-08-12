import type { Profile, Scheme, FormField, Lang } from './schemes'
import { SCHEMES } from './schemes'

export type KycVault = {
  fullName?: string
  aadhaar?: string
  mobile?: string
  bankAccount?: string
  ifsc?: string
  address?: string
  state?: string
  district?: string
  pincode?: string
  dob?: string
  age?: number
  gender?: string
  caste?: string
  income?: number
  bplNumber?: string
  rationCard?: string
  incomeCertNo?: string
  casteCertNo?: string
  disabilityCertNo?: string
  esmId?: string
  ppo?: string
  landDocNo?: string
  nominee?: string
  guardianName?: string
  childName?: string
  childDob?: string
  institutionName?: string
  vendingCertNo?: string
  documents: KycDocument[]
  updatedAt?: string
}

export type KycDocument = {
  id: string
  name: string
  type: 'aadhaar' | 'income' | 'caste' | 'bank' | 'land' | 'disability' | 'death' | 'vending' | 'esm' | 'birth' | 'photo' | 'other'
  status: 'have' | 'missing' | 'expired'
  fileData?: string
  fileName?: string
  uploadedAt?: string
}

export type FieldMapping = {
  field: FormField
  vaultKey: keyof KycVault | null
  value: string | undefined
  confidence: 'high' | 'medium' | 'low' | 'none'
  source: 'vault' | 'profile' | 'missing'
}

export type AutofillResult = {
  mappings: FieldMapping[]
  filledCount: number
  totalCount: number
  readyPercent: number
  missingFields: FormField[]
  lowConfidenceFields: FieldMapping[]
}

const VAULT_KEY_MAP: Record<string, keyof KycVault> = {
  name: 'fullName',
  guardian_name: 'guardianName',
  child_name: 'childName',
  aadhaar: 'aadhaar',
  bank_account: 'bankAccount',
  nominee: 'nominee',
  mobile: 'mobile',
  bpl_number: 'bplNumber',
  ration_card: 'rationCard',
  income_cert: 'incomeCertNo',
  caste_cert: 'casteCertNo',
  disability_cert: 'disabilityCertNo',
  esm_id: 'esmId',
  ppo: 'ppo',
  land_doc: 'landDocNo',
  vending_cert: 'vendingCertNo',
  child_dob: 'childDob',
  institution: 'institutionName',
  initial_deposit: undefined as unknown as keyof KycVault,
  land_area: undefined as unknown as keyof KycVault,
  age_proof: undefined as unknown as keyof KycVault,
  death_cert: undefined as unknown as keyof KycVault,
}

const PROFILE_KEY_MAP: Record<string, keyof Profile> = {
  age: 'age',
  gender: 'gender',
  state: 'state',
  income: 'income',
  caste: 'caste',
}

export function computeAutofill(
  scheme: Scheme,
  vault: KycVault,
  profile: Profile,
): AutofillResult {
  const mappings: FieldMapping[] = scheme.formFields.map((field) => {
    const vaultKey = VAULT_KEY_MAP[field.id] ?? null
    let value: string | undefined
    let confidence: FieldMapping['confidence'] = 'none'
    let source: FieldMapping['source'] = 'missing'

    if (vaultKey && vaultKey in vault) {
      const v = vault[vaultKey]
      if (v !== undefined && v !== null && v !== '') {
        value = String(v)
        confidence = 'high'
        source = 'vault'
      }
    }

    if (!value) {
      const profileKey = PROFILE_KEY_MAP[field.id]
      if (profileKey && profileKey in profile) {
        const v = profile[profileKey]
        if (v !== undefined && v !== null && v !== '') {
          value = String(v)
          confidence = 'medium'
          source = 'profile'
        }
      }
    }

    if (!value && field.id === 'name' && vault.fullName) {
      value = vault.fullName
      confidence = 'high'
      source = 'vault'
    }

    return { field, vaultKey, value, confidence, source }
  })

  const filledCount = mappings.filter((m) => m.value !== undefined).length
  const totalCount = scheme.formFields.length
  const missingFields = mappings.filter((m) => m.value === undefined && m.field.required).map((m) => m.field)
  const lowConfidenceFields = mappings.filter((m) => m.confidence === 'low' || (m.confidence === 'medium' && m.field.required))

  return {
    mappings,
    filledCount,
    totalCount,
    readyPercent: totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0,
    missingFields,
    lowConfidenceFields,
  }
}

export type DocReadinessItem = {
  document: string
  status: 'have' | 'missing' | 'expired'
  schemeId: string
}

export function computeDocReadiness(scheme: Scheme, vault: KycVault): DocReadinessItem[] {
  const docTypeMap: Record<string, KycDocument['type']> = {
    aadhaar: 'aadhaar',
    income: 'income',
    caste: 'caste',
    bank: 'bank',
    land: 'land',
    disability: 'disability',
    death: 'death',
    vending: 'vending',
    esm: 'esm',
    birth: 'birth',
  }

  return scheme.documents.map((doc, i) => {
    const docLower = doc.en.toLowerCase()
    let type: KycDocument['type'] = 'other'
    for (const [key, val] of Object.entries(docTypeMap)) {
      if (docLower.includes(key) || (key === 'aadhaar' && docLower.includes('aadhaar'))) {
        type = val
        break
      }
    }
    const vaultDoc = vault.documents.find((d) => d.type === type)
    const status: DocReadinessItem['status'] = vaultDoc ? vaultDoc.status : 'missing'
    return { document: doc.en, status, schemeId: scheme.id }
  })
}

export type LedgerEntry = {
  id: string
  timestamp: string
  action: 'vault_created' | 'vault_updated' | 'autofill_run' | 'document_uploaded' | 'profile_extracted' | 'scheme_viewed' | 'application_kit_generated' | 'data_exported' | 'feedback_given'
  details: string
  schemeId?: string
}

export function createLedgerEntry(
  action: LedgerEntry['action'],
  details: string,
  schemeId?: string,
): LedgerEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    schemeId,
  }
}

export function exportVault(vault: KycVault, profile: Profile): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    note: 'SahaAI KYC Profile Vault Export — this data belongs to you.',
    vault,
    profile,
  }
  return JSON.stringify(exportData, null, 2)
}

export type DemoScenario = {
  id: string
  name: string
  description: string
  lang: Lang
  input: string
  expectedSchemes: string[]
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'farmer-mh',
    name: 'Farmer from Maharashtra',
    description: '45-year-old farmer with land, low income',
    lang: 'en',
    input: 'I am a 45 year old farmer from Maharashtra. I own 2 acres of land and my annual income is about 80000 rupees.',
    expectedSchemes: ['pm-kisan', 'pmjay', 'pmjjby', 'pmsby'],
  },
  {
    id: 'widow-bpl',
    name: 'Widow with children (BPL)',
    description: '55-year-old widow, no income, below poverty line',
    lang: 'en',
    input: 'I am a 55 year old widow with two children. I have no income and I am below poverty line.',
    expectedSchemes: ['widow-pension', 'pmjay', 'icds', 'pmay'],
  },
  {
    id: 'senior-bpl',
    name: 'Senior citizen (BPL)',
    description: '70-year-old, no pension, below poverty line',
    lang: 'en',
    input: 'I am 70 years old and have no pension. I am below poverty line.',
    expectedSchemes: ['old-pension', 'pmjay', 'pmsby'],
  },
  {
    id: 'student-sc',
    name: 'SC student',
    description: '20-year-old SC student wanting to study',
    lang: 'en',
    input: 'I am a 20 year old student. I belong to SC category. I want to study further.',
    expectedSchemes: ['nsm', 'pmjjby', 'pmsby'],
  },
  {
    id: 'veteran',
    name: 'Ex-serviceman',
    description: '55-year-old ex-serviceman needing health support',
    lang: 'en',
    input: 'I am a 55 year old ex serviceman. I need health support for my family.',
    expectedSchemes: ['ex-servicemen', 'pmjjby', 'pmsby'],
  },
  {
    id: 'vendor',
    name: 'Street vendor',
    description: 'Street vendor needing working capital',
    lang: 'en',
    input: 'I am a street vendor. I need a loan to expand my business.',
    expectedSchemes: ['pm-svanidhi', 'pmjjby', 'pmsby'],
  },
]

const VAULT_KEY = 'sahaai_kyc_vault'
const LEDGER_KEY = 'sahaai_data_ledger'

export function loadVault(): KycVault | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as KycVault
  } catch {
    return null
  }
}

export function saveVault(vault: KycVault): void {
  try {
    vault.updatedAt = new Date().toISOString()
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault))
  } catch {
    // ignore
  }
}

export function clearVault(): void {
  try {
    localStorage.removeItem(VAULT_KEY)
  } catch {
    // ignore
  }
}

export function loadLedger(): LedgerEntry[] {
  try {
    const raw = localStorage.getItem(LEDGER_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LedgerEntry[]
  } catch {
    return []
  }
}

export function saveLedger(entries: LedgerEntry[]): void {
  try {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(entries.slice(-200)))
  } catch {
    // ignore
  }
}

export function getSchemeById(id: string): Scheme | undefined {
  return SCHEMES.find((s) => s.id === id)
}
