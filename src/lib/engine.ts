import type { Profile, Scheme, Criterion, Lang } from './schemes'
import { SCHEMES } from './schemes'

export type CriterionResult = {
  criterion: Criterion
  passed: boolean
  required: boolean
  applicable: boolean // whether the profile had enough info to evaluate
}

export type SchemeMatch = {
  scheme: Scheme
  score: number // 0-100
  matched: CriterionResult[]
  unmatched: CriterionResult[]
  missing: CriterionResult[]
  eligible: boolean
  partial: boolean
  confidence: 'high' | 'medium' | 'low'
}

const STATES = [
  'maharashtra', 'महाराष्ट्र', 'उत्तर प्रदेश', 'uttar pradesh', 'बिहार', 'bihar',
  'राजस्थान', 'rajasthan', 'मध्य प्रदेश', 'madhya pradesh', 'तमिलनाडु', 'tamil nadu',
  'कर्नाटक', 'karnataka', 'गुजरात', 'gujarat', 'पश्चिम बंगाल', 'west bengal',
  'केरल', 'kerala', 'आंध्र प्रदेश', 'andhra pradesh', 'तेलंगाना', 'telangana',
  'ओडिशा', 'odisha', 'पंजाब', 'punjab', 'हरियाणा', 'haryana', 'delhi', 'दिल्ली',
  'jharkhand', 'छत्तीसगढ़', 'chhattisgarh', 'assam', 'असम',
]

const OCCUPATIONS = [
  'farmer', 'किसान', 'शेतकरी', 'labour', 'मजदूर', 'मजूर', 'vendor', 'ठेला',
  'teacher', 'शिक्षक', 'student', 'छात्र', 'विद्यार्थी', 'housewife', 'गृहणी',
  'business', 'व्यवसाय', 'salaried', 'नौकरी', 'unemployed', 'बेरोजगार',
]

function detectAge(text: string): number | undefined {
  const en = text.match(/\b(\d{1,3})\s*(?:years?|yrs?|year old|yr old)\b/i)
  if (en) {
    const n = parseInt(en[1], 10)
    if (n > 0 && n < 120) return n
  }
  const hi = text.match(/(\d{1,3})\s*(?:साल|वर्ष|वर्षांचा|वर्षांची|वर्ष का|साल का|साल की)\b/)
  if (hi) {
    const n = parseInt(hi[1], 10)
    if (n > 0 && n < 120) return n
  }
  const bare = text.match(/\b(?:i am|i'm|मैं|मी)\s+(\d{1,3})\b/i)
  if (bare) {
    const n = parseInt(bare[1], 10)
    if (n > 0 && n < 120) return n
  }
  return undefined
}

function detectGender(text: string): Profile['gender'] | undefined {
  const t = text.toLowerCase()
  if (/(woman|female|महिला|बेटी|लड़की|मुलगी|विधवा|widow|गृहणी|housewife|mother|माँ|माता|पत्नी|wife|पत्नी|माय)/i.test(t)) return 'female'
  if (/(man|male|पुरुष|बेटा|लड़का|मुलगा|पति|husband|father|पिता|दादा)/i.test(t)) return 'male'
  return undefined
}

function detectState(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const s of STATES) {
    if (lower.includes(s.toLowerCase())) return s
  }
  return undefined
}

function detectOccupation(text: string): string | undefined {
  const lower = text.toLowerCase()
  for (const o of OCCUPATIONS) {
    if (lower.includes(o.toLowerCase())) return o
  }
  return undefined
}

function detectIncome(text: string): number | undefined {
  const m = text.match(/(?:₹|rs\.?|rupees?|रुपये|रुपया)\s*([0-9,]+(?:\s*(?:lakh|लाख|हज़ार|thousand))?)|([0-9,]+)\s*(?:lakh|लाख|thousand|हज़ार)/i)
  if (m) {
    const raw = (m[1] || m[2]).replace(/,/g, '')
    const n = parseInt(raw, 10)
    if (n > 0) {
      if (/lakh|लाख/i.test(m[0])) return n * 100000
      if (/thousand|हज़ार/i.test(m[0])) return n * 1000
      return n
    }
  }
  return undefined
}

function detectCaste(text: string): Profile['caste'] | undefined {
  const t = text.toLowerCase()
  if (/\bsc\b|अनुसूचित जाति|दलित|dalit/i.test(t)) return 'sc'
  if (/\bst\b|अनुसूचित जनजाति|आदिवासी|tribal|adivasi/i.test(t)) return 'st'
  if (/\bobc\b|अन्य पिछड़ा|पिछड़ा|backward/i.test(t)) return 'obc'
  if (/\bgeneral\b|सामान्य/i.test(t)) return 'general'
  return undefined
}

function detectBooleans(text: string): Partial<Profile> {
  const t = text.toLowerCase()
  const out: Partial<Profile> = {}
  if (/widow|विधवा|विधवा|widowed|patni ki maut|पत्नी की मृत्यु|पतीचा मृत्यू/.test(t)) out.widow = true
  if (/disab|विकलांग|दिव्यांग|विकलांगता|handicap|अपंग/.test(t)) out.disability = true
  if (/ex-?servic|भूतपूर्व सैनिक|माजी सैनिक|veteran|army|सेना|सैन्य/.test(t)) out.veteran = true
  if (/student|छात्र|विद्यार्थी|शिक्षार्थी|पढ़|study|school|college|कॉलेज|स्कूल/.test(t)) out.student = true
  if (/bpl|गरीबी रेखा|दारिद्र्यरेखा|below poverty|गरीब|गरिबी|दारिद्र्य/.test(t)) out.bpl = true
  if (/land|जमीन|भूमि|खेत|शेत|acre|एकड़|एकर/.test(t)) out.landowner = true
  if (/farmer|किसान|शेतकरी|खेती|शेती|कृषि|agricultur/.test(t)) out.farmer = true
  if (/senior|वृद्ध|बूढ़|old age|वृद्धावस्था|60|65|70|75|80|90/.test(t)) {
    // only mark senior if age-related context
    if (/वृद्ध|बूढ़|senior|old age|वृद्धावस्था/.test(t)) out.senior = true
  }
  return out
}

export function extractProfile(text: string, existing?: Profile): Profile {
  const base: Profile = { ...(existing ?? {}) }
  const age = detectAge(text)
  if (age !== undefined) base.age = age
  const gender = detectGender(text)
  if (gender !== undefined) base.gender = gender
  const state = detectState(text)
  if (state !== undefined) base.state = state
  const occupation = detectOccupation(text)
  if (occupation !== undefined) base.occupation = occupation
  const income = detectIncome(text)
  if (income !== undefined) base.income = income
  const caste = detectCaste(text)
  if (caste !== undefined) base.caste = caste
  const bools = detectBooleans(text)
  return { ...base, ...bools }
}

function evalCriterion(c: Criterion, p: Profile): CriterionResult {
  const hasInfo = p[c.field] !== undefined && p[c.field] !== null
  const passed = c.test(p)
  return {
    criterion: c,
    passed,
    required: c.required,
    applicable: hasInfo || passed,
  }
}

export function rankSchemes(profile: Profile): SchemeMatch[] {
  const matches: SchemeMatch[] = SCHEMES.map((scheme) => {
    const results = scheme.criteria.map((c) => evalCriterion(c, profile))
    const matched = results.filter((r) => r.passed)
    const unmatched = results.filter((r) => !r.passed && r.applicable)
    const missing = results.filter((r) => !r.passed && !r.applicable)

    const requiredFailed = unmatched.some((r) => r.required)
    const requiredMissing = missing.some((r) => r.required)
    const totalRequired = results.filter((r) => r.required).length
    const passedRequired = results.filter((r) => r.required && r.passed).length

    let score: number
    let eligible: boolean
    let partial: boolean

    if (requiredFailed) {
      score = Math.round((passedRequired / Math.max(totalRequired, 1)) * 100 * 0.5)
      eligible = false
      partial = false
    } else if (requiredMissing) {
      score = Math.round((passedRequired / Math.max(totalRequired, 1)) * 100 * 0.75)
      eligible = false
      partial = true
    } else {
      score = 100
      eligible = true
      partial = false
    }

    const confidence: SchemeMatch['confidence'] =
      requiredMissing ? 'low' : score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'

    return {
      scheme,
      score: Math.max(score, 0),
      matched,
      unmatched,
      missing,
      eligible,
      partial,
      confidence,
    }
  })

  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function profileSummary(p: Profile, lang: Lang): string[] {
  const parts: string[] = []
  if (p.age) parts.push(`${p.age}`)
  if (p.gender) parts.push(p.gender)
  if (p.state) parts.push(p.state)
  if (p.occupation) parts.push(p.occupation)
  if (p.income !== undefined) parts.push(`₹${p.income}`)
  if (p.caste) parts.push(p.caste)
  if (p.widow) parts.push('widow')
  if (p.disability) parts.push('disability')
  if (p.veteran) parts.push('veteran')
  if (p.student) parts.push('student')
  if (p.bpl) parts.push('BPL')
  if (p.farmer) parts.push('farmer')
  if (p.landowner) parts.push('landowner')
  return parts
}

export type MissingField = {
  field: keyof Profile
  questionKey: string
}

export function getMissingProfileFields(profile: Profile): MissingField[] {
  const missing: MissingField[] = []
  if (profile.age === undefined) missing.push({ field: 'age', questionKey: 'askAge' })
  if (!profile.state) missing.push({ field: 'state', questionKey: 'askState' })
  if (profile.income === undefined) missing.push({ field: 'income', questionKey: 'askIncome' })
  if (!profile.occupation) missing.push({ field: 'occupation', questionKey: 'askOccupation' })
  if (!profile.gender) missing.push({ field: 'gender', questionKey: 'askGender' })
  if (!profile.caste) missing.push({ field: 'caste', questionKey: 'askCaste' })
  if (profile.maritalStatus === undefined) missing.push({ field: 'maritalStatus', questionKey: 'askMaritalStatus' })
  if (profile.children === undefined) missing.push({ field: 'children', questionKey: 'askChildren' })
  if (profile.disability === undefined) missing.push({ field: 'disability', questionKey: 'askDisability' })
  if (profile.widow === undefined) missing.push({ field: 'widow', questionKey: 'askWidow' })
  if (profile.bpl === undefined) missing.push({ field: 'bpl', questionKey: 'askBpl' })
  if (profile.landowner === undefined) missing.push({ field: 'landowner', questionKey: 'askLand' })
  if (profile.veteran === undefined) missing.push({ field: 'veteran', questionKey: 'askVeteran' })
  if (profile.student === undefined) missing.push({ field: 'student', questionKey: 'askStudent' })
  return missing
}

export function getRejectionReasons(
  match: SchemeMatch,
  lang: Lang,
): { criterion: string; reason: string }[] {
  const reasons: { criterion: string; reason: string }[] = []
  for (const u of match.unmatched) {
    if (u.required) {
      const label = u.criterion.label[lang] || u.criterion.label.en
      reasons.push({
        criterion: label,
        reason: lang === 'hi'
          ? `आप इस मानदंड को पूर नहीं करते: ${label}`
          : lang === 'mr'
            ? `तुम्ही हे निकष पूर्ण करत नाही: ${label}`
            : `You do not meet this criterion: ${label}`,
      })
    }
  }
  return reasons
}
