import type { Lang } from './i18n'

export type Intent = 'discovery' | 'info'

const HI_CHARS = /[\u0900-\u097F]/
const MR_CHARS = /[\u0900-\u097F]/

const HI_WORDS = [
  'मैं', 'हूँ', 'हैं', 'किसान', 'योजना', 'सरकार', 'मदद', 'पेंशन', 'बीमा',
  'आवेदन', 'पात्र', 'विधवा', 'विकलांग', 'छात्र', 'बच्चा', 'महिला',
  'गरीब', 'भूमि', 'कृषि', 'स्वास्थ्य', 'शिक्षा', 'आय', 'उम्र', 'राज्य',
]

const MR_WORDS = [
  'मी', 'आहे', 'आहात', 'शेतकरी', 'योजना', 'सरकार', 'मदत', 'पेन्शन', 'विमा',
  'अर्ज', 'पात्र', 'विधवा', 'विकलांगता', 'विद्यार्थी', 'मूल', 'बालिका',
  'गरीब', 'जमीन', 'शेती', 'आरोग्य', 'शिक्षण', 'उत्पन्न', 'वय', 'राज्य',
  'करतो', 'करते', 'होतो', 'होते',
]

export function detectLanguage(text: string): Lang {
  if (HI_CHARS.test(text) || MR_CHARS.test(text)) {
    const lower = text.toLowerCase()
    let mrScore = 0
    let hiScore = 0
    for (const w of MR_WORDS) {
      if (lower.includes(w.toLowerCase())) mrScore++
    }
    for (const w of HI_WORDS) {
      if (lower.includes(w.toLowerCase())) hiScore++
    }
    if (mrScore >= hiScore) return 'mr'
    return 'hi'
  }
  return 'en'
}

export function classifyIntent(text: string): Intent {
  const lower = text.toLowerCase()
  const questionWords = [
    'what is', 'how to', 'how do', 'where', 'when', 'why', 'who can',
    'क्या है', 'कैसे', 'कहाँ', 'कब', 'क्यों', 'कौन',
    'काय', 'कसे', 'कुठे', 'कधी', 'का',
    'documents', 'कागज', 'कागदपत्र', 'amount', 'राशि', 'रक्कम',
    'eligib', 'पात्रता', 'link', 'website', 'साइट', 'ऑनलाइन',
  ]
  const situationWords = [
    'i am', "i'm", 'मैं', 'मी', 'my', 'मेरी', 'माझे',
    'farmer', 'किसान', 'शेतकरी', 'widow', 'विधवा',
    'student', 'छात्र', 'विद्यार्थी', 'disab', 'विकलांग',
    'old', 'वृद्ध', 'बूढ़', 'bpl', 'गरीब', 'गरिब',
    'crop', 'पिक', 'खेत', 'flood', 'बाढ़', 'पूर',
    'daughter', 'बेटी', 'मुलगी', 'son', 'बेटा', 'मुलगा',
    'no income', 'कोई आय', 'उत्पन्न नाही',
  ]
  let qScore = 0
  let sScore = 0
  for (const w of questionWords) {
    if (lower.includes(w)) qScore++
  }
  for (const w of situationWords) {
    if (lower.includes(w)) sScore++
  }
  return sScore >= qScore ? 'discovery' : 'info'
}

export function detectUrgency(text: string): 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase()
  if (/flood|बाढ़|पूर|crop damage|नुकसान|नुकसान|emergency|आपत्ती|दुर्घटना|accident|death|मृत्यु|बीमारी|sick|hospital|अस्पताल/.test(lower)) {
    return 'high'
  }
  if (/need|चाहिए|हवे|want|help|मदद|मदत|soon|जल्द/.test(lower)) {
    return 'medium'
  }
  return 'low'
}
