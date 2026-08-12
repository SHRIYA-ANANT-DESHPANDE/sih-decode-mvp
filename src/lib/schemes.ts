export type Lang = 'en' | 'hi' | 'mr'

export type LocalizedText = Record<Lang, string>

export type Profile = {
  age?: number
  gender?: 'male' | 'female' | 'other'
  state?: string
  occupation?: string
  income?: number // annual household ₹
  caste?: 'general' | 'obc' | 'sc' | 'st'
  maritalStatus?: 'single' | 'married' | 'widowed' | 'divorced'
  children?: number
  disability?: boolean
  widow?: boolean
  veteran?: boolean
  student?: boolean
  bpl?: boolean
  landowner?: boolean
  farmer?: boolean
  woman?: boolean
  senior?: boolean
}

export type Criterion = {
  field: keyof Profile
  label: LocalizedText
  test: (p: Profile) => boolean
  required: boolean // if true, failing this disqualifies; if false, it's a soft match
}

export type FormField = {
  id: string
  label: LocalizedText
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file'
  required: boolean
  options?: LocalizedText[]
  placeholder?: LocalizedText
  mapsTo?: keyof Profile
}

export type SourceRef = {
  label: LocalizedText
  url: string
}

export type Scheme = {
  id: string
  name: LocalizedText
  ministry: LocalizedText
  category: LocalizedText
  amount: LocalizedText
  summary: LocalizedText
  documents: LocalizedText[]
  applySteps: LocalizedText[]
  criteria: Criterion[]
  sources: SourceRef[]
  lastVerified: string
  formFields: FormField[]
  rejectionReasons?: LocalizedText[]
}

const anyState = (s: string, ...names: string[]) =>
  names.some((n) => s.toLowerCase().includes(n))

export const SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: {
      en: 'PM-KISAN Samman Nidhi',
      hi: 'पीएम-किसान सम्मान निधि',
      mr: 'पीएम-किसान सम्मान निधी',
    },
    ministry: {
      en: 'Ministry of Agriculture',
      hi: 'कृषि मंत्रालय',
      mr: 'कृषी मंत्रालय',
    },
    category: {
      en: 'Agriculture',
      hi: 'कृषि',
      mr: 'शेतकी',
    },
    amount: {
      en: '₹6,000 per year',
      hi: 'सालाना ₹6,000',
      mr: 'वार्षिक ₹6,000',
    },
    summary: {
      en: 'Direct income support of ₹6,000 per year to all landholding farmer families in three instalments.',
      hi: 'भूमि धारक किसान परिवारों को सालाना ₹6,000 तीन किस्तों में सीधे खाते में।',
      mr: 'जमीन धारक शेतकरी कुटुंबांना वार्षिक ₹6,000 तीन हप्त्यांमध्ये थेट खात्यात.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Land ownership proof (7/12 extract)', hi: 'भूमि स्वामित्व प्रमाण (7/12 उतारा)', mr: 'जमीन मालकी पुरावा (7/12 उतारा)' },
      { en: 'Bank account details', hi: 'बैंक खाता विवरण', mr: 'बँक खाते तपशील' },
    ],
    applySteps: [
      { en: 'Visit the nearest Common Service Centre (CSC) or apply online at pmkisan.gov.in', hi: 'नजदीकी CSC पर जाएँ या pmkisan.gov.in पर ऑनलाइन आवेदन करें', mr: 'जवळच्या CSC वर जा किंवा pmkisan.gov.in वर ऑनलाइन अर्ज करा' },
      { en: 'Submit land records and Aadhaar', hi: 'भूमि रिकॉर्ड और आधार जमा करें', mr: 'जमीन रेकॉर्ड आणि आधार जमा करा' },
      { en: 'Benefit is credited directly to your bank account', hi: 'लाभ सीधे आपके बैंक खाते में आता है', mr: 'लाभ थेट तुमच्या बँक खात्यात येतो' },
    ],
    criteria: [
      { field: 'farmer', label: { en: 'You are a farmer', hi: 'आप किसान हैं', mr: 'तुम्ही शेतकरी आहात' }, test: (p) => !!p.farmer, required: true },
      { field: 'landowner', label: { en: 'You own cultivable land', hi: 'आपके पास खेती योग्य भूमि है', mr: 'तुमच्याकडे शेतीयोग्य जमीन आहे' }, test: (p) => !!p.landowner, required: true },
      { field: 'income', label: { en: 'Not an income-tax payer', hi: 'आयकर दाता नहीं', mr: 'आयकर भरणारे नाही', }, test: (p) => (p.income ?? 0) < 100000, required: true },
    ],
    sources: [{label:{en:'pmkisan.gov.in',hi:'pmkisan.gov.in',mr:'pmkisan.gov.in'},url:'https://pmkisan.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'land_area',label:{en:'Land area (acres)',hi:'भूमि क्षेत्र (एकड़)',mr:'जमीन क्षेत्र (एकर)'},type:'number',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'pmjay',
    name: {
      en: 'Ayushman Bharat (PM-JAY)',
      hi: 'आयुष्मान भारत (पीएम-जय)',
      mr: 'आयुष्मान भारत (पीएम-जय)',
    },
    ministry: {
      en: 'Ministry of Health & Family Welfare',
      hi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय',
      mr: 'आरोग्य आणि कुटुंब कल्याण मंत्रालय',
    },
    category: {
      en: 'Health Insurance',
      hi: 'स्वास्थ्य बीमा',
      mr: 'आरोग्य विमा',
    },
    amount: {
      en: 'Up to ₹5 lakh per family per year',
      hi: 'प्रति परिवार सालाना ₹5 लाख तक',
      mr: 'प्रति कुटुंब वार्षिक ₹5 लाख पर्यंत',
    },
    summary: {
      en: 'Free health insurance cover up to ₹5 lakh per family per year for poor and vulnerable families, cashless at empanelled hospitals.',
      hi: 'गरीब और सुरक्षित परिवारों को सालाना ₹5 लाख तक मुफ्त स्वास्थ्य बीमा, सूचीबद्ध अस्पतालों में कैशलेस।',
      mr: 'गरीब आणि संवेदनशील कुटुंबांना वार्षिक ₹5 लाख पर्यंत मोफत आरोग्य विमा, नोंदणीकृत रुग्णालयांमध्ये कॅशलेस.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Ration card', hi: 'राशन कार्ड', mr: 'रेशन कार्ड' },
      { en: 'Mobile number', hi: 'मोबाइल नंबर', mr: 'मोबाईल नंबर' },
    ],
    applySteps: [
      { en: 'Check if your family is in the SECC-2011 list at a CSC or empanelled hospital', hi: 'CSC या सूचीबद्ध अस्पताल में जाँचें कि आपका परिवार SECC-2011 सूची में है', mr: 'CSC किंवा नोंदणीकृत रुग्णालयात तपासा की तुमचे कुटुंब SECC-2011 यादीत आहे' },
      { en: 'Get your Ayushman card made free of cost', hi: 'निःशुल्क आयुष्मान कार्ड बनवाएँ', mr: 'विनाशुल्क आयुष्मान कार्ड बनवा' },
      { en: 'Show the card at any empanelled hospital for cashless treatment', hi: 'कैशलेस इलाज के लिए किसी भी सूचीबद्ध अस्पताल में कार्ड दिखाएँ', mr: 'कॅशलेस उपचारासाठी कोणत्याही नोंदणीकृत रुग्णालयात कार्ड दाखवा' },
    ],
    criteria: [
      { field: 'bpl', label: { en: 'You belong to a poor/vulnerable family (BPL)', hi: 'आप गरीब/सुरक्षित परिवार (BPL) से हैं', mr: 'तुम्ही गरीब/संवेदनशील कुटुंब (BPL) आहात' }, test: (p) => !!p.bpl, required: false },
      { field: 'occupation', label: { en: 'Informal/unorganised sector worker', hi: 'असंगठित क्षेत्रकर्मी', mr: 'असंघटित क्षेत्र कामगार' }, test: (p) => !p.income || (p.income ?? 0) < 300000, required: false },
    ],
    sources: [{label:{en:'pmjay.gov.in',hi:'pmjay.gov.in',mr:'pmjay.gov.in'},url:'https://pmjay.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'ration_card',label:{en:'Ration card number',hi:'राशन कार्ड नंबर',mr:'रेशन कार्ड नंबर'},type:'text',required:true},{id:'mobile',label:{en:'Mobile number',hi:'मोबाइल नंबर',mr:'मोबाईल नंबर'},type:'text',required:true}],
  },
  {
    id: 'old-pension',
    name: {
      en: 'Indira Gandhi Old Age Pension (IGNOAPS)',
      hi: 'इंदिरा गांधी वृद्धावस्था पेंशन (IGNOAPS)',
      mr: 'इंदिरा गांधी वृद्धावस्था पेन्शन (IGNOAPS)',
    },
    ministry: {
      en: 'Ministry of Rural Development',
      hi: 'ग्रामीण विकास मंत्रालय',
      mr: 'ग्रामीण विकास मंत्रालय',
    },
    category: {
      en: 'Pension',
      hi: 'पेंशन',
      mr: 'पेन्शन',
    },
    amount: {
      en: '₹200 per month (central) + state share',
      hi: 'मासिक ₹200 (केंद्र) + राज्य हिस्सा',
      mr: 'मासिक ₹200 (केंद्र) + राज्य वाटा',
    },
    summary: {
      en: 'Monthly pension for persons aged 60+ living below the poverty line.',
      hi: '60 वर्ष से अधिक गरीबी रेखा के नीचे जीवन जीने वालों के लिए मासिक पेंशन।',
      mr: '60 वर्षांपेक्षा जास्त दारिद्र्यरेषेखाली जगणाऱ्यांसाठी मासिक पेन्शन.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Age proof', hi: 'आयु प्रमाण', mr: 'वयाचा पुरावा' },
      { en: 'BPL certificate / ration card', hi: 'BPL प्रमाणपत्र / राशन कार्ड', mr: 'BPL प्रमाणपत्र / रेशन कार्ड' },
    ],
    applySteps: [
      { en: 'Apply at your Gram Panchayat / Municipal office or online on the state portal', hi: 'ग्राम पंचायत / नगरपालिका कार्यालय में या राज्य पोर्टल पर ऑनलाइन आवेदन करें', mr: 'ग्राम पंचायत / नगरपालिका कार्यालयात किंवा राज्य पोर्टलवर ऑनलाइन अर्ज करा' },
      { en: 'Submit age proof and BPL certificate', hi: 'आयु प्रमाण और BPL प्रमाणपत्र जमा करें', mr: 'वयाचा पुरावा आणि BPL प्रमाणपत्र जमा करा' },
      { en: 'Pension is credited to your bank account monthly', hi: 'पेंशन मासिक रूप से आपके बैंक खाते में आती है', mr: 'पेन्शन मासिक तुमच्या बँक खात्यात येते' },
    ],
    criteria: [
      { field: 'age', label: { en: 'You are 60 or older', hi: 'आप 60 या अधिक उम्र के हैं', mr: 'तुम्ही 60 किंवा त्यापेक्षा जास्त वयाचे आहात' }, test: (p) => (p.age ?? 0) >= 60, required: true },
      { field: 'bpl', label: { en: 'You are below the poverty line', hi: 'आप गरीबी रेखा के नीचे हैं', mr: 'तुम्ही दारिद्र्यरेषेखाली आहात' }, test: (p) => !!p.bpl, required: true },
    ],
    sources: [{label:{en:'nsap.nic.in',hi:'nsap.nic.in',mr:'nsap.nic.in'},url:'https://nsap.nic.in'}],
    lastVerified: '2026-06-15',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'age_proof',label:{en:'Age proof type',hi:'आयु प्रमाण प्रकार',mr:'वय पुरावा प्रकार'},type:'select',required:true,options:[{en:'Aadhaar',hi:'आधार',mr:'आधार'},{en:'Voter ID',hi:'वोटर आईडी',mr:'वोटर आयडी'},{en:'Birth certificate',hi:'जन्म प्रमाणपत्र',mr:'जन्म प्रमाणपत्र'}]},{id:'bpl_number',label:{en:'BPL card number',hi:'BPL कार्ड नंबर',mr:'BPL कार्ड नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'widow-pension',
    name: {
      en: 'Indira Gandhi Widow Pension (IGNWPS)',
      hi: 'इंदिरा गांधी विधवा पेंशन (IGNWPS)',
      mr: 'इंदिरा गांधी विधवा पेन्शन (IGNWPS)',
    },
    ministry: {
      en: 'Ministry of Rural Development',
      hi: 'ग्रामीण विकास मंत्रालय',
      mr: 'ग्रामीण विकास मंत्रालय',
    },
    category: {
      en: 'Pension',
      hi: 'पेंशन',
      mr: 'पेन्शन',
    },
    amount: {
      en: '₹200 per month (central) + state share',
      hi: 'मासिक ₹200 (केंद्र) + राज्य हिस्सा',
      mr: 'मासिक ₹200 (केंद्र) + राज्य वाटा',
    },
    summary: {
      en: 'Monthly pension for widows aged 40-79 living below the poverty line.',
      hi: '40-79 वर्ष की गरीबी रेखा के नीचे रहने वाली विधवाओं के लिए मासिक पेंशन।',
      mr: '40-79 वर्षांच्या दारिद्र्यरेषेखाली राहणाऱ्या विधवांसाठी मासिक पेन्शन.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Husband death certificate', hi: 'पति का मृत्यु प्रमाणपत्र', mr: 'पतीचा मृत्यू प्रमाणपत्र' },
      { en: 'BPL certificate / ration card', hi: 'BPL प्रमाणपत्र / राशन कार्ड', mr: 'BPL प्रमाणपत्र / रेशन कार्ड' },
    ],
    applySteps: [
      { en: 'Apply at your Gram Panchayat / Municipal office', hi: 'ग्राम पंचायत / नगरपालिका कार्यालय में आवेदन करें', mr: 'ग्राम पंचायत / नगरपालिका कार्यालयात अर्ज करा' },
      { en: 'Submit death certificate and BPL proof', hi: 'मृत्यु प्रमाणपत्र और BPL प्रमाण जमा करें', mr: 'मृत्यू प्रमाणपत्र आणि BPL पुरावा जमा करा' },
      { en: 'Pension is credited monthly to your bank account', hi: 'पेंशन मासिक रूप से बैंक खाते में आती है', mr: 'पेन्शन मासिक बँक खात्यात येते' },
    ],
    criteria: [
      { field: 'widow', label: { en: 'You are a widow', hi: 'आप विधवा हैं', mr: 'तुम्ही विधवा आहात' }, test: (p) => !!p.widow, required: true },
      { field: 'age', label: { en: 'You are between 40 and 79 years', hi: 'आपकी आयु 40-79 वर्ष है', mr: 'तुमचे वय 40-79 आहे' }, test: (p) => (p.age ?? 0) >= 40 && (p.age ?? 0) <= 79, required: false },
      { field: 'bpl', label: { en: 'You are below the poverty line', hi: 'आप गरीबी रेखा के नीचे हैं', mr: 'तुम्ही दारिद्र्यरेषेखाली आहात' }, test: (p) => !!p.bpl, required: true },
    ],
    sources: [{label:{en:'nsap.nic.in',hi:'nsap.nic.in',mr:'nsap.nic.in'},url:'https://nsap.nic.in'}],
    lastVerified: '2026-06-15',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'death_cert',label:{en:'Husband death certificate number',hi:'पति मृत्यु प्रमाणपत्र नंबर',mr:'पती मृत्यू प्रमाणपत्र नंबर'},type:'text',required:true},{id:'bpl_number',label:{en:'BPL card number',hi:'BPL कार्ड नंबर',mr:'BPL कार्ड नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'disability-pension',
    name: {
      en: 'Indira Gandhi Disability Pension (IGNDPS)',
      hi: 'इंदिरा गांधी विकलांगता पेंशन (IGNDPS)',
      mr: 'इंदिरा गांधी विकलांगता पेन्शन (IGNDPS)',
    },
    ministry: {
      en: 'Ministry of Rural Development',
      hi: 'ग्रामीण विकास मंत्रालय',
      mr: 'ग्रामीण विकास मंत्रालय',
    },
    category: {
      en: 'Pension',
      hi: 'पेंशन',
      mr: 'पेन्शन',
    },
    amount: {
      en: '₹200 per month (central) + state share',
      hi: 'मासिक ₹200 (केंद्र) + राज्य हिस्सा',
      mr: 'मासिक ₹200 (केंद्र) + राज्य वाटा',
    },
    summary: {
      en: 'Monthly pension for persons with severe (80%+) disability aged 18-79 living below the poverty line.',
      hi: '80%+ विकलांगता वाले 18-79 वर्ष के गरीबी रेखा के नीचे व्यक्तियों के लिए मासिक पेंशन।',
      mr: '80%+ विकलांगता असलेल्या 18-79 वर्षांच्या दारिद्र्यरेषेखाली व्यक्तींसाठी मासिक पेन्शन.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Disability certificate', hi: 'विकलांगता प्रमाणपत्र', mr: 'विकलांगता प्रमाणपत्र' },
      { en: 'BPL certificate / ration card', hi: 'BPL प्रमाणपत्र / राशन कार्ड', mr: 'BPL प्रमाणपत्र / रेशन कार्ड' },
    ],
    applySteps: [
      { en: 'Get a disability certificate from a government hospital', hi: 'सरकारी अस्पताल से विकलांगता प्रमाणपत्र लें', mr: 'सरकारी रुग्णालयातून विकलांगता प्रमाणपत्र घ्या' },
      { en: 'Apply at Gram Panchayat / Municipal office', hi: 'ग्राम पंचायत / नगरपालिका कार्यालय में आवेदन करें', mr: 'ग्राम पंचायत / नगरपालिका कार्यालयात अर्ज करा' },
      { en: 'Pension is credited monthly to your bank account', hi: 'पेंशन मासिक रूप से बैंक खाते में आती है', mr: 'पेन्शन मासिक बँक खात्यात येते' },
    ],
    criteria: [
      { field: 'disability', label: { en: 'You have a disability', hi: 'आपको विकलांगता है', mr: 'तुम्हाला विकलांगता आहे' }, test: (p) => !!p.disability, required: true },
      { field: 'age', label: { en: 'You are between 18 and 79 years', hi: 'आपकी आयु 18-79 वर्ष है', mr: 'तुमचे वय 18-79 आहे' }, test: (p) => (p.age ?? 0) >= 18 && (p.age ?? 0) <= 79, required: false },
      { field: 'bpl', label: { en: 'You are below the poverty line', hi: 'आप गरीबी रेखा के नीचे हैं', mr: 'तुम्ही दारिद्र्यरेषेखाली आहात' }, test: (p) => !!p.bpl, required: true },
    ],
    sources: [{label:{en:'nsap.nic.in',hi:'nsap.nic.in',mr:'nsap.nic.in'},url:'https://nsap.nic.in'}],
    lastVerified: '2026-06-15',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'disability_cert',label:{en:'Disability certificate number',hi:'विकलांगता प्रमाणपत्र नंबर',mr:'विकलांगता प्रमाणपत्र नंबर'},type:'text',required:true},{id:'bpl_number',label:{en:'BPL card number',hi:'BPL कार्ड नंबर',mr:'BPL कार्ड नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'pmjjby',
    name: {
      en: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
      hi: 'पीएम जीवन ज्योति बीमा योजना (PMJJBY)',
      mr: 'पीएम जीवन ज्योति बिमा योजना (PMJJBY)',
    },
    ministry: {
      en: 'Ministry of Finance',
      hi: 'वित्त मंत्रालय',
      mr: 'वित्त मंत्रालय',
    },
    category: {
      en: 'Life Insurance',
      hi: 'जीवन बीमा',
      mr: 'जीवन विमा',
    },
    amount: {
      en: '₹2 lakh life cover for ₹436/year',
      hi: '₹436/वर्ष में ₹2 लाख जीवन कवर',
      mr: '₹436/वर्षात ₹2 लाख जीवन कव्हर',
    },
    summary: {
      en: 'Life insurance cover of ₹2 lakh for just ₹436 per year, for savings bank account holders aged 18-50.',
      hi: 'मात्र ₹436 वार्षिक में ₹2 लाख जीवन बीमा, 18-50 वर्ष के बचत खाताधारकों के लिए।',
      mr: 'फक्त ₹436 वार्षिकात ₹2 लाख जीवन विमा, 18-50 वर्षांच्या बचत खाते धारकांसाठी.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Savings bank account passbook', hi: 'बचत बैंक खाता पासबुक', mr: 'बचत बँक खाते पासबुक' },
      { en: 'Nominee details', hi: 'नॉमिनी विवरण', mr: 'नॉमिनी तपशील' },
    ],
    applySteps: [
      { en: 'Visit your bank branch or use your bank app', hi: 'अपने बैंक शाखा में जाएँ या बैंक ऐप इस्तेमाल करें', mr: 'तुमच्या बँक शाखेत जा किंवा बँक अॅप वापरा' },
      { en: 'Fill the PMJJBY enrolment form and submit', hi: 'PMJJBY फॉर्म भरें और जमा करें', mr: 'PMJJBY फॉर्म भरा आणि जमा करा' },
      { en: '₹436 is auto-debited yearly from your account', hi: '₹436 वार्षिक स्वतः आपके खाते से कटा जाता है', mr: '₹436 वार्षिक स्वतः तुमच्या खात्यातून कापले जाते' },
    ],
    criteria: [
      { field: 'age', label: { en: 'You are between 18 and 50 years', hi: 'आपकी आयु 18-50 वर्ष है', mr: 'तुमचे वय 18-50 आहे' }, test: (p) => (p.age ?? 0) >= 18 && (p.age ?? 0) <= 50, required: true },
    ],
    sources: [{label:{en:'pmjjby.gov.in',hi:'pmjjby.gov.in',mr:'pmjjby.gov.in'},url:'https://pmjjby.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true},{id:'nominee',label:{en:'Nominee name',hi:'नॉमिनी नाम',mr:'नॉमिनी नाव'},type:'text',required:true}],
  },
  {
    id: 'pmsby',
    name: {
      en: 'PM Suraksha Bima Yojana (PMSBY)',
      hi: 'पीएम सुरक्षा बीमा योजना (PMSBY)',
      mr: 'पीएम सुरक्षा बिमा योजना (PMSBY)',
    },
    ministry: {
      en: 'Ministry of Finance',
      hi: 'वित्त मंत्रालय',
      mr: 'वित्त मंत्रालय',
    },
    category: {
      en: 'Accident Insurance',
      hi: 'दुर्घटना बीमा',
      mr: 'अपघात विमा',
    },
    amount: {
      en: '₹2 lakh accident cover for ₹20/year',
      hi: '₹20/वर्ष में ₹2 लाख दुर्घटना कवर',
      mr: '₹20/वर्षात ₹2 लाख अपघात कव्हर',
    },
    summary: {
      en: 'Accident insurance cover of ₹2 lakh for just ₹20 per year, for savings bank account holders aged 18-70.',
      hi: 'मात्र ₹20 वार्षिक में ₹2 लाख दुर्घटना बीमा, 18-70 वर्ष के बचत खाताधारकों के लिए।',
      mr: 'फक्त ₹20 वार्षिकात ₹2 लाख अपघात विमा, 18-70 वर्षांच्या बचत खाते धारकांसाठी.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Savings bank account passbook', hi: 'बचत बैंक खाता पासबुक', mr: 'बचत बँक खाते पासबुक' },
    ],
    applySteps: [
      { en: 'Visit your bank branch or use your bank app', hi: 'अपने बैंक शाखा में जाएँ या बैंक ऐप इस्तेमाल करें', mr: 'तुमच्या बँक शाखेत जा किंवा बँक अॅप वापरा' },
      { en: 'Fill the PMSBY enrolment form and submit', hi: 'PMSBY फॉर्म भरें और जमा करें', mr: 'PMSBY फॉर्म भरा आणि जमा करा' },
      { en: '₹20 is auto-debited yearly from your account', hi: '₹20 वार्षिक स्वतः आपके खाते से कटा जाता है', mr: '₹20 वार्षिक स्वतः तुमच्या खात्यातून कापले जाते' },
    ],
    criteria: [
      { field: 'age', label: { en: 'You are between 18 and 70 years', hi: 'आपकी आयु 18-70 वर्ष है', mr: 'तुमचे वय 18-70 आहे' }, test: (p) => (p.age ?? 0) >= 18 && (p.age ?? 0) <= 70, required: true },
    ],
    sources: [{label:{en:'pmsby.gov.in',hi:'pmsby.gov.in',mr:'pmsby.gov.in'},url:'https://pmsby.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'sukanya',
    name: {
      en: 'Sukanya Samriddhi Yojana',
      hi: 'सुकन्या समृद्धि योजना',
      mr: 'सुकन्या समृद्धी योजना',
    },
    ministry: {
      en: 'Ministry of Finance',
      hi: 'वित्त मंत्रालय',
      mr: 'वित्त मंत्रालय',
    },
    category: {
      en: 'Savings / Girl Child',
      hi: 'बचत / बालिका',
      mr: 'बचत / बालिका',
    },
    amount: {
      en: 'High-interest savings account (8.2% p.a.)',
      hi: 'उच्च ब्याज बचत खाता (8.2% वार्षिक)',
      mr: 'उच्च व्याज बचत खाते (8.2% वार्षिक)',
    },
    summary: {
      en: 'A small-savings scheme for a girl child under 10 — deposit from ₹250 to ₹1.5 lakh/year, tax-free interest and maturity.',
      hi: '10 वर्ष से कम बालिका के लिए छोटी बचत योजना — ₹250 से ₹1.5 लाख/वर्ष जमा, कर-मुक्त ब्याज।',
      mr: '10 वर्षांखालील बालिकेसाठी लहान बचत योजना — ₹250 ते ₹1.5 लाख/वर्ष जमा, कर-मुक्त व्याज.',
    },
    documents: [
      { en: 'Girl child birth certificate', hi: 'बालिका का जन्म प्रमाणपत्र', mr: 'बालिकेचा जन्म प्रमाणपत्र' },
      { en: 'Guardian Aadhaar card', hi: 'अभिभावक का आधार कार्ड', mr: 'पालकाचे आधार कार्ड' },
      { en: 'Guardian ID proof', hi: 'अभिभावक पहचान प्रमाण', mr: 'पालक ओळख पुरावा' },
    ],
    applySteps: [
      { en: 'Open the account at any post office or authorised bank', hi: 'किसी भी डाकघर या अधिकृत बैंक में खाता खोलें', mr: 'कोणत्याही पोस्ट ऑफिस किंवा अधिकृत बँकेत खाते उघडा' },
      { en: 'Deposit minimum ₹250 to start', hi: 'शुरू करने के लिए न्यूनतम ₹250 जमा करें', mr: 'सुरू करण्यासाठी किमान ₹250 जमा करा' },
      { en: 'Account matures after 21 years or on marriage after 18', hi: 'खाता 21 वर्ष बाद या 18 के बाद विवाह पर परिपक्व होता है', mr: 'खाते 21 वर्षांनी किंवा 18 नंतर लग्नावर परिपक्व होते' },
    ],
    criteria: [
      { field: 'children', label: { en: 'You have a daughter under 10', hi: 'आपके पास 10 से कम उम्र की बेटी है', mr: 'तुमच्याकडे 10 पेक्षा कमी वयाची मुलगी आहे' }, test: (p) => (p.children ?? 0) > 0, required: false },
      { field: 'woman', label: { en: 'For a girl child', hi: 'बालिका के लिए', mr: 'बालिकेसाठी' }, test: () => true, required: false },
    ],
    sources: [{label:{en:'india.gov.in/sukanya',hi:'india.gov.in/sukanya',mr:'india.gov.in/sukanya'},url:'https://www.india.gov.in/sukanya-samriddhi-yojana'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'guardian_name',label:{en:'Guardian full name',hi:'अभिभावक पूरा नाम',mr:'पालक पूर्ण नाव'},type:'text',required:true},{id:'child_name',label:{en:'Girl child name',hi:'बालिका का नाम',mr:'बालिकेचे नाव'},type:'text',required:true},{id:'child_dob',label:{en:'Child date of birth',hi:'बच्ची जन्म तिथि',mr:'मुलीचा जन्म दिनांक'},type:'date',required:true},{id:'aadhaar',label:{en:'Guardian Aadhaar',hi:'अभिभावक आधार',mr:'पालक आधार'},type:'text',required:true},{id:'initial_deposit',label:{en:'Initial deposit (₹)',hi:'प्रारंभिक जमा (₹)',mr:'प्रारंभिक जमा (₹)'},type:'number',required:true}],
  },
  {
    id: 'pmay',
    name: {
      en: 'PM Awas Yojana (PMAY-Gramin)',
      hi: 'पीएम आवास योजना (PMAY-ग्रामीण)',
      mr: 'पीएम आवास योजना (PMAY-ग्रामीण)',
    },
    ministry: {
      en: 'Ministry of Rural Development',
      hi: 'ग्रामीण विकास मंत्रालय',
      mr: 'ग्रामीण विकास मंत्रालय',
    },
    category: {
      en: 'Housing',
      hi: 'आवास',
      mr: 'गृहनिर्माण',
    },
    amount: {
      en: '₹1.2 lakh subsidy (rural) / ₹2.67 lakh (urban)',
      hi: '₹1.2 लाख सब्सिडी (ग्रामीण) / ₹2.67 लाख (शहरी)',
      mr: '₹1.2 लाख अनुदान (ग्रामीण) / ₹2.67 लाख (शहरी)',
    },
    summary: {
      en: 'Financial assistance to build a pucca house for families without pucca shelter, especially in rural areas.',
      hi: 'पक्का घर न होने वाले परिवारों को पक्का घर बनाने हेतु वित्तीय सहायता, विशेषकर ग्रामीण क्षेत्र।',
      mr: 'पक्के घर नसलेल्या कुटुंबांना पक्के घर बांधण्यासाठी आर्थिक मदत, विशेषतः ग्रामीण भागात.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Income certificate', hi: 'आय प्रमाणपत्र', mr: 'उत्पन्न प्रमाणपत्र' },
      { en: 'Land documents', hi: 'भूमि कागजात', mr: 'जमीन कागदपत्रे' },
      { en: 'Caste certificate (if applicable)', hi: 'जाति प्रमाणपत्र (यदि लागू)', mr: 'जात प्रमाणपत्र (जर लागू)' },
    ],
    applySteps: [
      { en: 'Apply online at pmaymis.nic.in or at a CSC', hi: 'pmaymis.nic.in पर ऑनलाइन या CSC पर आवेदन करें', mr: 'pmaymis.nic.in वर ऑनलाइन किंवा CSC वर अर्ज करा' },
      { en: 'Submit income and land documents', hi: 'आय और भूमि दस्तावेज़ जमा करें', mr: 'उत्पन्न आणि जमीन कागदपत्रे जमा करा' },
      { en: 'Subsidy is credited in stages as construction progresses', hi: 'सब्सिडी निर्माण अग्रगति अनुसार चरणों में मिलती है', mr: 'अनुदान बांधकाम प्रगतीनुसार टप्प्यांत मिळते' },
    ],
    criteria: [
      { field: 'bpl', label: { en: 'You do not own a pucca house', hi: 'आपके पास पक्का घर नहीं है', mr: 'तुमच्याकडे पक्के घर नाही' }, test: (p) => !!p.bpl || (p.income ?? 0) < 300000, required: false },
      { field: 'landowner', label: { en: 'You own a plot or have land', hi: 'आपके पास भूखंड या भूमि है', mr: 'तुमच्याकडे आडमोडा किंवा जमीन आहे' }, test: (p) => !!p.landowner, required: false },
    ],
    sources: [{label:{en:'pmaymis.nic.in',hi:'pmaymis.nic.in',mr:'pmaymis.nic.in'},url:'https://pmaymis.nic.in'}],
    lastVerified: '2026-06-20',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'income_cert',label:{en:'Income certificate number',hi:'आय प्रमाणपत्र नंबर',mr:'उत्पन्न प्रमाणपत्र नंबर'},type:'text',required:true},{id:'land_doc',label:{en:'Land document number',hi:'भूमि दस्तावेज़ नंबर',mr:'जमीन कागदपत्र नंबर'},type:'text',required:false},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'pm-svanidhi',
    name: {
      en: 'PM SVANIDHI (Street Vendor Loan)',
      hi: 'पीएम स्वनिधि (ठेला विक्रेता ऋण)',
      mr: 'पीएम स्वनिधी (ठेला विक्रेता कर्ज)',
    },
    ministry: {
      en: 'Ministry of Housing & Urban Affairs',
      hi: 'आवास एवं शहरी कार्य मंत्रालय',
      mr: 'गृहनिर्माण आणि शहरी कार्य मंत्रालय',
    },
    category: {
      en: 'Micro-credit',
      hi: 'सूक्ष्म ऋण',
      mr: 'सूक्ष्म कर्ज',
    },
    amount: {
      en: 'Working capital loan up to ₹10,000 (first tranche)',
      hi: 'कार्यशील पूँजी ऋण ₹10,000 तक (पहली किस्त)',
      mr: 'कार्यरत भांडवल कर्ज ₹10,000 पर्यंत (पहिला हप्ता)',
    },
    summary: {
      en: 'Collateral-free working capital loan for street vendors to resume and expand their business.',
      hi: 'ठेला विक्रेताओं को व्यवसाय शुरू करने और बढ़ाने हेतु बिना गिरवी कार्यशील पूँजी ऋण।',
      mr: 'ठेला विक्रेत्यांना व्यवसाय सुरू करण्यासाठी बिना तारण कार्यरत भांडवल कर्ज.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Vending certificate from ULB', hi: 'ULB से वेंडिंग प्रमाणपत्र', mr: 'ULB कडून वेंडिंग प्रमाणपत्र' },
      { en: 'Bank account details', hi: 'बैंक खाता विवरण', mr: 'बँक खाते तपशील' },
    ],
    applySteps: [
      { en: 'Get a vending certificate from your Urban Local Body', hi: 'अपने शहरी निकाय से वेंडिंग प्रमाणपत्र लें', mr: 'तुमच्या शहरी स्थानिक संस्थेकडून वेंडिंग प्रमाणपत्र घ्या' },
      { en: 'Apply through a nearby bank or the SVANIDHI app', hi: 'नजदीकी बैंक या SVANIDHI ऐप से आवेदन करें', mr: 'जवळच्या बँक किंवा SVANIDHI अॅपवरून अर्ज करा' },
      { en: 'Loan is credited to your bank account', hi: 'ऋण आपके बैंक खाते में जमा होता है', mr: 'कर्ज तुमच्या बँक खात्यात जमा होते' },
    ],
    criteria: [
      { field: 'occupation', label: { en: 'You are a street vendor', hi: 'आप ठेला विक्रेता हैं', mr: 'तुम्ही ठेला विक्रेता आहात' }, test: (p) => anyState(p.occupation ?? '', 'vendor', 'ठेला', 'street'), required: true },
    ],
    sources: [{label:{en:'pmsvanidhi.mohua.gov.in',hi:'pmsvanidhi.mohua.gov.in',mr:'pmsvanidhi.mohua.gov.in'},url:'https://pmsvanidhi.mohua.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'vending_cert',label:{en:'Vending certificate number',hi:'वेंडिंग प्रमाणपत्र नंबर',mr:'वेंडिंग प्रमाणपत्र नंबर'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'nsm',
    name: {
      en: 'Pre/Post Matric Scholarship (SC/ST/OBC)',
      hi: 'प्री/पोस्ट मैट्रिक छात्रवृत्ति (SC/ST/OBC)',
      mr: 'प्री/पोस्ट मॅट्रिक शिष्यवृत्ती (SC/ST/OBC)',
    },
    ministry: {
      en: 'Ministry of Social Justice',
      hi: 'सामाजिक न्याय मंत्रालय',
      mr: 'सामाजिक न्याय मंत्रालय',
    },
    category: {
      en: 'Education / Scholarship',
      hi: 'शिक्षा / छात्रवृत्ति',
      mr: 'शिक्षण / शिष्यवृत्ती',
    },
    amount: {
      en: '₹350-₹1,600 per month (varies by level)',
      hi: 'मासिक ₹350-₹1,600 (स्तर अनुसार)',
      mr: 'मासिक ₹350-₹1,600 (स्तरानुसार)',
    },
    summary: {
      en: 'Scholarship for SC/ST/OBC students from class 9 onwards to support their education.',
      hi: 'कक्षा 9 से आगे के SC/ST/OBC छात्रों के लिए शिक्षा सहायता छात्रवृत्ति।',
      mr: 'इयत्ता 9 पासून पुढे SC/ST/OBC विद्यार्थ्यांसाठी शिक्षण सहाय्य शिष्यवृत्ती.',
    },
    documents: [
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
      { en: 'Caste certificate', hi: 'जाति प्रमाणपत्र', mr: 'जात प्रमाणपत्र' },
      { en: 'Income certificate', hi: 'आय प्रमाणपत्र', mr: 'उत्पन्न प्रमाणपत्र' },
      { en: 'Previous mark sheet', hi: 'पिछला अंकपत्र', mr: 'मागील अक्षरपत्र' },
    ],
    applySteps: [
      { en: 'Apply online on the National Scholarship Portal (scholarships.gov.in)', hi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (scholarships.gov.in) पर ऑनलाइन आवेदन करें', mr: 'राष्ट्रीय शिष्यवृत्ती पोर्टल (scholarships.gov.in) वर ऑनलाइन अर्ज करा' },
      { en: 'Upload caste and income certificates', hi: 'जाति और आय प्रमाणपत्र अपलोड करें', mr: 'जात आणि उत्पन्न प्रमाणपत्र अपलोड करा' },
      { en: 'Scholarship is credited to your bank account', hi: 'छात्रवृत्ति आपके बैंक खाते में आती है', mr: 'शिष्यवृत्ती तुमच्या बँक खात्यात येते' },
    ],
    criteria: [
      { field: 'student', label: { en: 'You are a student', hi: 'आप छात्र हैं', mr: 'तुम्ही विद्यार्थी आहात' }, test: (p) => !!p.student, required: true },
      { field: 'caste', label: { en: 'You belong to SC/ST/OBC category', hi: 'आप SC/ST/OBC श्रेणी के हैं', mr: 'तुम्ही SC/ST/OBC श्रेणीचे आहात' }, test: (p) => p.caste === 'sc' || p.caste === 'st' || p.caste === 'obc', required: true },
    ],
    sources: [{label:{en:'scholarships.gov.in',hi:'scholarships.gov.in',mr:'scholarships.gov.in'},url:'https://scholarships.gov.in'}],
    lastVerified: '2026-07-01',
    formFields: [{id:'name',label:{en:'Student full name',hi:'छात्र पूरा नाम',mr:'विद्यार्थी पूर्ण नाव'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true},{id:'caste_cert',label:{en:'Caste certificate number',hi:'जाति प्रमाणपत्र नंबर',mr:'जात प्रमाणपत्र नंबर'},type:'text',required:true},{id:'income_cert',label:{en:'Income certificate number',hi:'आय प्रमाणपत्र नंबर',mr:'उत्पन्न प्रमाणपत्र नंबर'},type:'text',required:true},{id:'institution',label:{en:'Institution name',hi:'संस्थान नाम',mr:'संस्था नाव'},type:'text',required:true},{id:'bank_account',label:{en:'Bank account number',hi:'बैंक खाता नंबर',mr:'बँक खाते नंबर'},type:'text',required:true}],
  },
  {
    id: 'ex-servicemen',
    name: {
      en: 'Ex-Servicemen Contributory Health Scheme (ECHS)',
      hi: 'भूतपूर्व सैनिक स्वास्थ्य योजना (ECHS)',
      mr: 'माजी सैनिक आरोग्य योजना (ECHS)',
    },
    ministry: {
      en: 'Ministry of Defence',
      hi: 'रक्षा मंत्रालय',
      mr: 'संरक्षण मंत्रालय',
    },
    category: {
      en: 'Health / Veterans',
      hi: 'स्वास्थ्य / भूतपूर्व सैनिक',
      mr: 'आरोग्य / माजी सैनिक',
    },
    amount: {
      en: 'Free medical treatment at ECHS polyclinics',
      hi: 'ECHS पॉलीक्लिनिक में मुफ्त इलाज',
      mr: 'ECHS पॉलीक्लिनिक मध्ये मोफत उपचार',
    },
    summary: {
      en: 'Comprehensive health cover for ex-servicemen and their dependants through ECHS polyclinics and empanelled hospitals.',
      hi: 'ECHS पॉलीक्लिनिक और सूचीबद्ध अस्पतालों के माध्यम से भूतपूर्व सैनिकों और उनके आश्रितों के लिए संपूर्ण स्वास्थ्य कवर।',
      mr: 'ECHS पॉलीक्लिनिक आणि नोंदणीकृत रुग्णालयांमार्फत माजी सैनिक आणि त्यांच्या आश्रितांसाठी सर्वसमावेशक आरोग्य कव्हर.',
    },
    documents: [
      { en: 'Ex-servicemen ID (ESM I-Card)', hi: 'भूतपूर्व सैनिक पहचान पत्र', mr: 'माजी सैनिक ओळख पत्र' },
      { en: 'PPO / discharge book', hi: 'PPO / डिस्चार्ज बुक', mr: 'PPO / डिस्चार्ज बुक' },
      { en: 'Aadhaar card', hi: 'आधार कार्ड', mr: 'आधार कार्ड' },
    ],
    applySteps: [
      { en: 'Visit the nearest ECHS polyclinic with your ESM I-Card', hi: 'अपने ESM I-Card के साथ नजदीकी ECHS पॉलीक्लिनिक में जाएँ', mr: 'तुमच्या ESM I-Card सह जवळच्या ECHS पॉलीक्लिनिक मध्ये जा' },
      { en: 'Register yourself and your dependants', hi: 'अपना और आश्रितों का पंजीकरण कराएँ', mr: 'स्वतःची आणि आश्रितांची नोंदणी करा' },
      { en: 'Get free treatment and medicines at the polyclinic', hi: 'पॉलीक्लिनिक में मुफ्त इलाज और दवाएँ पाएँ', mr: 'पॉलीक्लिनिक मध्ये मोफत उपचार आणि औषधे मिळवा' },
    ],
    criteria: [
      { field: 'veteran', label: { en: 'You are an ex-serviceman', hi: 'आप भूतपूर्व सैनिक हैं', mr: 'तुम्ही माजी सैनिक आहात' }, test: (p) => !!p.veteran, required: true },
    ],
    sources: [{label:{en:'echs.gov.in',hi:'echs.gov.in',mr:'echs.gov.in'},url:'https://echs.gov.in'}],
    lastVerified: '2026-06-01',
    formFields: [{id:'name',label:{en:'Full name',hi:'पूरा नाम',mr:'पूर्ण नाव'},type:'text',required:true},{id:'esm_id',label:{en:'ESM I-Card number',hi:'ESM I-Card नंबर',mr:'ESM I-Card नंबर'},type:'text',required:true},{id:'ppo',label:{en:'PPO number',hi:'PPO नंबर',mr:'PPO नंबर'},type:'text',required:true},{id:'aadhaar',label:{en:'Aadhaar number',hi:'आधार नंबर',mr:'आधार नंबर'},type:'text',required:true}],
  },
  {
    id: 'icds',
    name: {
      en: 'ICDS / Anganwadi Services',
      hi: 'ICDS / आंगनवाड़ी सेवाएँ',
      mr: 'ICDS / आंगणवाडी सेवा',
    },
    ministry: {
      en: 'Ministry of Women & Child Development',
      hi: 'महिला एवं बाल विकास मंत्रालय',
      mr: 'महिला आणि बाल विकास मंत्रालय',
    },
    category: {
      en: 'Nutrition / Mother & Child',
      hi: 'पोषण / माता और बाल',
      mr: 'पोषण / माता आणि बाल',
    },
    amount: {
      en: 'Supplementary nutrition + health check-ups',
      hi: 'अनुपूरक पोषण + स्वास्थ्य जाँच',
      mr: 'पूरक पोषण + आरोग्य तपासणी',
    },
    summary: {
      en: 'Supplementary nutrition, immunisation, and health check-ups for children 0-6, pregnant and nursing mothers.',
      hi: '0-6 वर्ष के बच्चों, गर्भवती और स्तनपान कराने वाली माताओं के लिए अनुपूरक पोषण, टीकाकरण, स्वास्थ्य जाँच।',
      mr: '0-6 वर्षांच्या मुलां, गर्भवती आणि स्तनपान करणाऱ्या मातांसाठी पूरक पोषण, लसीकरण, आरोग्य तपासणी.',
    },
    documents: [
      { en: 'Child birth certificate', hi: 'बच्चे का जन्म प्रमाणपत्र', mr: 'मुलाचा जन्म प्रमाणपत्र' },
      { en: 'Aadhaar card (mother)', hi: 'आधार कार्ड (माता)', mr: 'आधार कार्ड (माता)' },
      { en: 'Address proof', hi: 'पता प्रमाण', mr: 'पत्ता पुरावा' },
    ],
    applySteps: [
      { en: 'Visit the nearest Anganwadi centre with your child', hi: 'अपने बच्चे के साथ नजदीकी आंगनवाड़ी केंद्र में जाएँ', mr: 'तुमच्या मुलासह जवळच्या आंगणवाडी केंद्रात जा' },
      { en: 'Register your child and yourself', hi: 'अपने बच्चे और स्वयं का पंजीकरण कराएँ', mr: 'तुमच्या मुलाची आणि स्वतःची नोंदणी करा' },
      { en: 'Receive supplementary nutrition and health services', hi: 'अनुपूरक पोषण और स्वास्थ्य सेवाएँ पाएँ', mr: 'पूरक पोषण आणि आरोग्य सेवा मिळवा' },
    ],
    criteria: [
      { field: 'children', label: { en: 'You have a child under 6 or are pregnant', hi: 'आपके पास 6 से कम उम्र का बच्चा है या गर्भवती हैं', mr: 'तुमच्याकडे 6 पेक्षा कमी वयाचे मूल आहे किंवा गर्भवती आहात' }, test: (p) => (p.children ?? 0) > 0, required: false },
      { field: 'woman', label: { en: 'For mothers and children', hi: 'माताओं और बच्चों के लिए', mr: 'मातां आणि मुलांसाठी' }, test: (p) => !!p.woman, required: false },
    ],
    sources: [{label:{en:'wcd.nic.in',hi:'wcd.nic.in',mr:'wcd.nic.in'},url:'https://wcd.nic.in'}],
    lastVerified: '2026-06-01',
    formFields: [{id:'mother_name',label:{en:'Mother name',hi:'माता का नाम',mr:'मातेचे नाव'},type:'text',required:true},{id:'child_name',label:{en:'Child name',hi:'बच्चे का नाम',mr:'मुलाचे नाव'},type:'text',required:true},{id:'child_dob',label:{en:'Child date of birth',hi:'बच्चे की जन्म तिथि',mr:'मुलाचा जन्म दिनांक'},type:'date',required:true},{id:'aadhaar',label:{en:'Aadhaar (mother)',hi:'आधार (माता)',mr:'आधार (माता)'},type:'text',required:true}],
  },
]
