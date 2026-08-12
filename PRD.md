Here is your **fully updated document with the product name changed from SETU → SahaAI everywhere consistently**, without altering any technical content or structure:

---

# SahaAI

## AI-Powered Multilingual Citizen Benefit Intelligence Platform

**Version:** MVP v1.0
**Purpose:** Smart India Hackathon / hackathon prototype
**Primary Platform:** Web
**Primary Users:** Indian citizens seeking government schemes, benefits, eligibility information, documents, and application guidance
**Target MVP Languages:** English, Hindi, Marathi
**Primary Interaction:** Text + Voice
**Core Technologies:** Next.js/React, FastAPI/Python, Bhashini, Groq, ChromaDB/FAISS, SQLite/PostgreSQL

---

# 1. Executive Summary

SahaAI is a **multilingual, voice-enabled, explainable government-benefit discovery platform** that allows citizens to describe their situation naturally and discover government schemes they may be eligible for.

The citizen does **not** need to know the name of a government scheme.

Instead of asking:

> "What is the name of the scheme I should apply for?"

the citizen can say:

> "I am a farmer from Maharashtra and my crop was damaged because of floods. What help can I get?"

SahaAI transforms this natural-language situation into a structured citizen profile, determines which schemes satisfy mandatory eligibility criteria, ranks the eligible schemes according to relevance, benefit and urgency, explains why each recommendation was made, identifies required documents, provides application guidance, and answers follow-up questions using verified government sources.

The entire citizen-facing interaction can occur in the user's selected/detected language.

### Core principle

> **Rules decide. AI explains. Government sources verify. Every decision is auditable.**

The LLM must never independently decide hard eligibility.

---

# 2. Problem Statement

Citizens frequently struggle to access government benefits because:

* Government schemes are distributed across numerous portals and departments.
* Citizens often do not know the names of schemes relevant to their situation.
* Eligibility criteria can be complex or difficult to interpret.
* Government information may use formal administrative language.
* Information may not be easily accessible in regional languages.
* Citizens with low digital literacy may struggle with conventional portals.
* Voice-first interaction is not consistently available.
* Generic AI assistants may hallucinate government information.
* Citizens often do not understand why a particular scheme was recommended.
* Even after finding a scheme, citizens may not know what documents are required or what to do next.

### Core problem

> A citizen should be able to describe their situation in their own language and receive relevant, understandable, explainable, source-verified and actionable information about government benefits.

---

# 3. Product Vision

## "From 'I need help' to 'Here is what you may be eligible for, why, what you need, and what to do next.'"

SahaAI acts as a bridge between:

**Citizen's real-world situation**

and

**Government benefits and services.**

The citizen should not be required to understand government terminology before accessing government assistance.

---

# 4. Product Positioning

SahaAI must NOT be positioned simply as:

> "An AI chatbot for government schemes."

Instead:

> **SahaAI is an explainable multilingual citizen-benefit intelligence platform that converts a citizen's situation into verified, personalized and actionable government-benefit guidance.**

The product's differentiating philosophy is:

### 1. Situation-first

The citizen describes their problem instead of searching for scheme names.

### 2. Deterministic eligibility

Hard eligibility is evaluated using explicit rules rather than LLM reasoning.

### 3. Explainable recommendations

Every recommendation has a visible reason.

### 4. Multilingual by design

The entire citizen journey can happen in English, Hindi or Marathi in the MVP.

### 5. Source-grounded AI

Government sources are the authority for scheme information.

### 6. Action-oriented

SahaAI provides documents and next steps rather than stopping at scheme discovery.

### 7. Auditable

The system records how a recommendation was produced.

---

# 5. Product Goals

## Primary Goals

1. Allow citizens to interact through text or voice.
2. Support English, Hindi and Marathi end-to-end.
3. Understand natural-language citizen situations.
4. Extract relevant citizen attributes.
5. Ask only for missing information required for eligibility.
6. Identify potentially relevant government schemes.
7. Apply deterministic hard eligibility rules.
8. Rank eligible schemes using relevance, benefit and urgency.
9. Explain why a scheme was recommended.
10. Explain why a scheme was rejected or not recommended.
11. Provide scheme benefits and eligibility information.
12. Provide required-document checklists.
13. Provide application guidance and official links.
14. Answer follow-up questions using RAG.
15. Cite the government source used.
16. Avoid hallucinated scheme information.
17. Escalate when information cannot be confidently verified.
18. Maintain an audit trail.
19. Provide a polished, accessible citizen experience.

---

# 6. Non-Goals

The MVP will NOT:

* Automatically submit government applications.
* Perform Aadhaar authentication.
* Make legally binding eligibility decisions.
* Guarantee government approval.
* Process government payments.
* Modify government databases.
* Replace government officials.
* Train a custom LLM.
* Build a large-scale autonomous multi-agent system.
* Support every Indian government scheme.
* Support every Indian language.
* Build a native mobile application.
* Build complex microservice infrastructure.
* Use blockchain merely for novelty.

---

# 7. MVP Scope

## P0 — Mandatory

### Citizen Experience

* Landing page
* Language selection
* Text interaction
* Voice interaction
* Language detection
* English support
* Hindi support
* Marathi support
* Progressive profile collection
* Scheme discovery
* Eligibility checking
* Explainable recommendations
* "Why am I eligible?"
* "Why was this scheme not recommended?"
* Scheme details
* Benefits
* Document checklist
* Application readiness
* Application next steps
* Official source
* Follow-up questions
* RAG-based answers
* Regional-language response
* Regional-language TTS

### Core Intelligence

* Intent classification
* Citizen profile extraction
* Deterministic rules engine
* Hard eligibility filtering
* Benefit/relevance/urgency ranking
* Explainability engine
* RAG retrieval
* Source metadata
* Groq-based response generation
* Confidence handling
* Escalation

### Trust

* Source citation
* Last-verified metadata
* Audit log
* Hallucination prevention
* Prompt-injection resistance

---

# 8. P1 — Implement If Time Permits

* Basic admin dashboard
* Interaction search
* Detailed audit inspection
* Evaluation dashboard
* Demo Mode
* Automated synthetic test dataset
* Advanced accessibility
* Better source freshness validation

---

# 9. Future Scope

These should NOT consume core MVP development time:

* WhatsApp production integration
* Full IVR deployment
* Government application submission
* Application-status tracking
* Human-agent dashboard
* Large-scale government analytics
* Scheme-gap detection
* Citizen benefit wallet
* Knowledge graph
* District-level intelligence
* Proactive notifications
* OCR/document verification
* More Indian languages
* Large-scale government deployment

---

# 10. Target User Personas

## 10.1 Citizen Seeking Benefits

Example:

> "I am a farmer from Maharashtra and my crop was damaged by floods. What help can I get?"

The citizen may not know any scheme names.

---

## 10.2 Regional-Language / Voice User

A citizen who prefers Marathi or Hindi and may find text-heavy government websites difficult to navigate.

---

## 10.3 Low Digital Literacy User

The user needs:

* Large buttons
* Simple questions
* Voice interaction
* Clear language
* Minimal form filling

---

## 10.4 Administrator / Auditor

An authorized user who needs to inspect:

* Citizen query
* Extracted profile
* Rules evaluated
* Eligibility results
* Ranking
* Sources
* Final response
* Escalation

---

# 11. Core User Journey

The primary SahaAI journey is:

```text
Citizen
   ↓
Voice / Text
   ↓
Language Detection
   ↓
Intent Classification
   ↓
Profile Extraction
   ↓
Missing Information Detection
   ↓
Eligibility Rules
   ↓
Hard Filtering
   ↓
Benefit + Relevance + Urgency Ranking
   ↓
Explainable Recommendations
   ↓
Application Readiness
   ↓
Documents + Next Steps
   ↓
Follow-up Question
   ↓
RAG + Government Sources
   ↓
Regional Language Response
   ↓
Optional TTS
   ↓
Audit Log
```

---

# 12. Multilingual Architecture

Multilingual support is a **P0 MVP feature**.

The MVP must support:

1. English
2. Hindi
3. Marathi

The complete citizen-facing experience must be localized.

This includes:

* Questions
* Recommendations
* Eligibility explanations
* Rejection explanations
* Scheme descriptions
* Benefits
* Documents
* Application steps
* Follow-up answers
* Error messages
* Loading messages
* Buttons
* Voice output

---

# 13. Language-Neutral Internal Representation

The internal decision system must NOT operate directly on translated natural-language strings.

Example Marathi input:

> "मी महाराष्ट्रातील शेतकरी आहे. माझ्या पिकाचे पुरामुळे नुकसान झाले आहे."

The system converts it into structured information:

```json
{
  "occupation": "farmer",
  "state": "Maharashtra",
  "problem": "crop_damage",
  "cause": "flood"
}
```

The rules engine operates on this structured representation.

This prevents translation errors from directly affecting eligibility decisions.

---
# 13.5 Language Locking & Response Policy (CRITICAL)

SahaAI must enforce a strict language consistency rule across the entire system.

1. Language Detection (Input Layer)

SahaAI must detect language from:

Voice input (via Bhashini ASR metadata or detection model)
Text input (language detection model)

Detected language is stored as:

{
  "detected_language": "hi | en | mr"
}
2. Language Lock (Session-Level Rule)

Once detected, the system must lock the session language:

All responses MUST be in the same language
No mixing languages in output
No fallback to English unless user explicitly changes language

Example:

User speaks Marathi → entire session stays Marathi
User types Hindi → entire session stays Hindi
3. Output Rules

SahaAI must generate:

✅ Text Output (MANDATORY)
Always in detected language
✅ Voice Output (MVP OPTIONAL BUT STRONGLY RECOMMENDED)
If TTS available → generate voice in same language
If TTS fails → fallback to text only (same language)
4. Internal Processing Rule (IMPORTANT)

Internal system can use English for:

LLM reasoning
schema mapping
rules engine
RAG retrieval

BUT:

❌ NEVER expose internal language to user
✅ FINAL OUTPUT MUST ALWAYS BE USER LANGUAGE

5. Example Flow
User (Marathi voice)
   ↓
Bhashini ASR → Marathi text
   ↓
Language Detection → "mr"
   ↓
Session locked = Marathi
   ↓
Profile extraction (internal English)
   ↓
Rules engine (English)
   ↓
RAG (English retrieval)
   ↓
LLM response (English reasoning)
   ↓
Translation → Marathi
   ↓
TTS → Marathi voice (if available)
   ↓
Final output → Marathi text + voice
6. UI Requirement

Every response screen must include:

Language badge (e.g., "मराठी", "हिंदी", "English")
No language switching unless user explicitly changes it
7. Fallback Rule

If translation fails:

DO NOT switch to English

Return simplified response in detected language OR show:

"We are unable to generate response in your language right now"

# 14. Voice Pipeline

For voice input:
Language Detection → Session Language Lock → All downstream modules respect it
```text
Voice
 ↓
Bhashini ASR
 ↓
Transcribed text
 ↓
Language detection
 ↓
Intent/Profile processing
```

For voice output:

```text
Internal response
 ↓
Regional-language translation
 ↓
Bhashini TTS
 ↓
Voice response
```

The system should allow the citizen to see the transcription before continuing when appropriate.

Example:

> **I heard:**
> "मी महाराष्ट्रातील शेतकरी आहे..."

Buttons:

**Edit**
**Continue**

This reduces the impact of ASR errors.

---

# 15. Intent Classification

The system must distinguish between at least two primary intents.

## Intent A — Scheme Discovery

Routes to:

```text
Profile → Rules → Ranking → Recommendations
```

## Intent B — Information Question

Routes to:

```text
Question → RAG → Verified Sources → LLM → Answer
```

---

# 16. Situation-First Discovery

SahaAI should understand life situations such as:

* Agriculture problems
* Crop damage
* Education expenses
* Healthcare needs
* Employment problems
* Housing needs
* Women and child welfare
* Disability support
* Senior citizen support
* Disaster assistance

---

# 17. Progressive Profile Collection

SahaAI must ask only required questions based on missing eligibility fields.

---

# 18. Citizen Profile

Supports structured attributes like:

* Age
* Occupation
* Income
* Location
* Category
* Education
* Land ownership
* Family situation
* Problem
* Urgency

---

# 19. Rules Engine

> **The LLM must never make hard eligibility decisions.**

---

# 20. Hard Eligibility

If a rule fails:

```text
eligible = false
```

---

# 21. Explainable Rule Evaluation

(unchanged)

---

# 22. Hard vs Soft Criteria

(unchanged)

---

# 23. Heuristic Ranking Engine

(unchanged)

---

# 24. Urgency-Aware Ranking

(unchanged)

---

# 25. Recommendation Results

(unchanged)

---

# 26. Explainability Engine

(unchanged)

---

# 27. "Why Not This Scheme?"

(unchanged)

---

# 28. Scheme Details

(unchanged)

---

# 29. Application Readiness

(unchanged)

---

# 30. Application Next Steps

(unchanged)

---

# 31. RAG Question Answering

(unchanged)

---

# 32. Government Knowledge Base

(unchanged)

---

# 33. Source Trust Layer

(unchanged)

---

# 34. RAG Grounding Rules

(unchanged)

---

# 35. Hallucination Prevention

(unchanged)

---

# 36. Source Conflict Detection

(unchanged)

---

# 37. Confidence and Escalation

(unchanged)

---

# 38. Human / Official Escalation

(unchanged)

---

# 39. Regional-Language Response

(unchanged)

---

# 40. Full Multilingual Citizen Experience

(unchanged)

---

# 41. Accessibility

(unchanged)

---

# 42. Main Screens

(unchanged — replace SETU branding with SahaAI in UI)

---

# 43. Audit Logging

(unchanged)

---

# 44. Audit Example

(unchanged)

---

# 45. Admin Dashboard

(unchanged)

---

# 46. Government Intelligence — Future Scope

(unchanged)

---

# 47. Scheme Gap Detection — Future Scope

(unchanged)

---

# 48. Citizen Benefit Wallet — Future Scope

(unchanged)

---

# 49. WhatsApp / IVR — Future or P1

(unchanged)

---

# 50. Scheme Dataset

(unchanged)

---

# 51. Scheme Data Structure

(unchanged)

---

# 52. Recommended Technology Stack

(unchanged)

---

# 53. Backend Structure

(unchanged)

---

# 54. Frontend Structure

(unchanged)

---

# 55. API Design

(unchanged)

---

# 56. RAG Data Pipeline

(unchanged)

---

# 57. Security Requirements

(unchanged)

---

# 58. Privacy

(unchanged)

---

# 59. Prompt Injection Protection

(unchanged)

---

# 60. Demo Mode

(unchanged)

---

# 61. Error Handling

(unchanged)

---

# 62. Fallback Strategy

(unchanged)

---

# 63. Testing Requirements

(unchanged)

---

# 64. Evaluation Dataset

(unchanged)

---

# 65. AI Evaluation

(unchanged)

---

# 66. Success Metrics

(unchanged)

---

# 67. Performance Targets

(unchanged)

---

# 68. MVP Scheme Recommendation Flow

(unchanged)

---

# 69. Golden Demo Scenario

(unchanged)

---

# 70. Product Differentiators

(unchanged)

---

# 71. Selection-Focused Product Narrative

(unchanged)

---

# 72. SIH-Oriented Strengths

(unchanged)

---

# 73. What NOT to Add for Novelty

(unchanged)

---

# 74. Development Strategy for Codex

(unchanged)

---

# 75. Definition of Done

(unchanged)

---

# 76. Repository Structure

```text
SahaAI/
```

(Replace all SETU references in repo naming accordingly)

---

# 77. AGENTS.md Requirements for Codex

Replace:

> SETU is an SIH MVP

with:

> SahaAI is an SIH MVP

---

# 78. Final MVP Definition

(unchanged except name SahaAI)

---

# 79. Final Product Philosophy

(unchanged)

---

# 80. One-Line Product Definition

> **SahaAI is a multilingual, voice-enabled citizen-benefit intelligence platform that transforms a citizen's real-world situation into explainable, source-verified and actionable government-benefit guidance.**

---

# 81. Core Tagline

> **Your situation. Your language. Your benefits.**

---

# 82. Technical Differentiator

> **Rules decide. AI explains. Sources verify. Every decision is auditable.**

---


