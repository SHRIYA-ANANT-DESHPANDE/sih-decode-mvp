# SahaAI

### Your situation. Your language. Your benefits.

SahaAI is a multilingual, voice-enabled citizen-benefit intelligence platform that helps citizens discover government schemes based on their real-world situation.

Instead of requiring citizens to know the name of a government scheme, SahaAI lets them describe what they need in their own language.

> **Rules decide. AI explains. Sources verify. Every decision is auditable.**

---

## Problem

Government schemes are often difficult to discover because:

* Information is distributed across multiple portals.
* Citizens may not know which schemes apply to them.
* Eligibility criteria can be difficult to understand.
* Information may not be available in the citizen's preferred language.
* Citizens may not know which documents they need.
* Generic AI systems can provide unverified or hallucinated information.

SahaAI aims to reduce this gap between citizens and government benefits.

---

## What SahaAI Does

A citizen can:

1. Describe their situation using text or voice.
2. Interact in English, Hindi or Marathi.
3. Allow SahaAI to extract relevant profile information.
4. Provide only the additional information needed to evaluate eligibility.
5. Discover potentially relevant government schemes.
6. See which schemes they appear eligible for.
7. Understand **why** a scheme was recommended.
8. Understand **why** another scheme was not recommended.
9. See benefits and required documents.
10. Check application readiness.
11. Get verified application guidance.
12. Ask follow-up questions using source-grounded RAG.
13. Receive the response in their preferred language.
14. Receive a voice response when supported.

---

## Core Architecture

```text
                     CITIZEN
                        │
                 Voice / Text
                        │
                        ▼
                Bhashini Layer
                ASR / Language
                        │
                        ▼
                 Intent Engine
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Scheme Discovery       Question
              │                   │
              ▼                   ▼
       Profile Extraction      RAG
              │                   │
              ▼                   ▼
        Rules Engine         Vector Search
              │                   │
              ▼                   ▼
       Hard Eligibility       Groq LLM
              │                   │
              ▼                   │
       Relevance + Urgency       │
          + Benefit               │
              │                   │
              └─────────┬─────────┘
                        ▼
                  Explainability
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
             WHY?    CITATIONS  CONFIDENCE
                        │
                        ▼
              Application Readiness
                        │
                        ▼
                Documents + Steps
                        │
                        ▼
                 Bhashini NMT/TTS
                        │
                        ▼
                     CITIZEN
                        │
                        ▼
                   Audit Log
```

---

## Core Design Principles

### Rules decide

Hard eligibility is determined using deterministic rules.

### AI explains

The LLM is used for natural-language understanding and explanations, not hard eligibility decisions.

### Sources verify

Government information is grounded in verified sources.

### Every decision is auditable

The system records the information and reasoning used to produce a recommendation.

---

## MVP Features

### Multilingual

* English
* Hindi
* Marathi
* Text interaction
* Voice interaction
* Speech-to-text
* Translation
* Text-to-speech

### Intelligent Discovery

* Situation-first scheme discovery
* Intent classification
* Profile extraction
* Progressive questioning
* Deterministic eligibility
* Explainable recommendations
* "Why am I eligible?"
* "Why not this scheme?"
* Benefit/relevance/urgency ranking

### Actionability

* Scheme details
* Benefits
* Required documents
* Application readiness
* Application steps
* Official source links

### Trust

* RAG
* Government-source citations
* Source metadata
* Confidence handling
* Escalation
* Audit logging
* Hallucination prevention

---

## Technology Stack

| Layer             | Technology                                  |
| ----------------- | ------------------------------------------- |
| Frontend          | Next.js, React, TypeScript, Tailwind CSS    |
| Backend           | Python, FastAPI                             |
| LLM               | Groq                                        |
| Speech / Language | Bhashini                                    |
| Vector Search     | ChromaDB / FAISS                            |
| Database          | SQLite / PostgreSQL                         |
| Testing           | Project-specific unit and integration tests |

---

## Repository Structure

```text
SahaAI/
│
├── AGENTS.md
├── PRD.md
├── ARCHITECTURE.md
├── DECISIONS.md
├── ROADMAP.md
├── DIFFERENTIATORS.md
├── TESTING.md
├── SECURITY.md
├── README.md
│
├── frontend/
├── backend/
├── data/
├── evaluation/
├── tests/
└── docs/
```

---

## Getting Started

### Prerequisites

* Node.js
* Python 3.x
* Git
* A supported package manager
* Required API credentials for external services

### Clone

```bash
git clone <repository-url>
cd SahaAI
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment and install dependencies:

```bash
pip install -r requirements.txt
```

Start the API:

```bash
uvicorn main:app --reload
```

---

## Environment Variables

Create appropriate `.env` files locally.

Example:

```env
GROQ_API_KEY=
BHASHINI_API_KEY=
DATABASE_URL=
```

Never commit secrets to Git.

---

## Development Philosophy

SahaAI is being developed as a hackathon MVP.

The priority is:

1. Correctness
2. Reliability
3. Citizen usability
4. Explainability
5. Multilingual accessibility
6. Source verification
7. Demonstrability

The project intentionally avoids unnecessary technologies that do not improve the citizen problem being solved.

---

## Current MVP Flow

```text
Citizen
  ↓
Voice / Text
  ↓
Language Detection
  ↓
Intent
  ↓
Profile
  ↓
Missing Information
  ↓
Rules
  ↓
Eligibility
  ↓
Ranking
  ↓
Explanation
  ↓
Documents
  ↓
Application Readiness
  ↓
RAG Follow-up
  ↓
Verified Source
  ↓
Regional Language Response
  ↓
TTS
  ↓
Audit
```

---

## Documentation

| Document          | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `PRD.md`          | Complete product requirements               |
| `AGENTS.md`       | Instructions for Codex and AI coding agents |
| `ARCHITECTURE.md` | Technical architecture                      |
| `DECISIONS.md`    | Important technical/product decisions       |
| `ROADMAP.md`      | Development phases                          |
| `TESTING.md`      | Testing and evaluation strategy             |
| `SECURITY.md`     | Security and privacy considerations         |

---

## Project Status

**Status:** MVP in development

The current implementation should be considered a hackathon prototype and not an official government service.

SahaAI does not provide official government approval or eligibility decisions.

---

## Product Philosophy

> **Your situation. Your language. Your benefits.**

> **Rules decide. AI explains. Sources verify. Every decision is auditable.**
