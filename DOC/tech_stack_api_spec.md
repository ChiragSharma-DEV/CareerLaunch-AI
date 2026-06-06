# CareerLaunch AI: Tech Stack Selection & API Integrations Specification
**Author:** Enterprise Technical Lead  
**Target Audience:** Microsoft Evaluators, Enterprise Judges, Lead Developers  
**Classification:** Technical Stack & API Specification

---

## SECTION 1: DETAILED TECH STACK CHOICE & RATIONALE

To deliver a high-quality, production-ready MVP within a constrained 7-hour hackathon window, the technology choices were chosen for speed of development, system responsiveness, and architectural simplicity.

```
                  ┌─────────────────────────────────────┐
                  │          CAREERLAUNCH AI            │
                  │   Streamlit Single-Process Engine   │
                  └──────┬──────────────┬─────────┬─────┘
                         │              │         │
          In-Memory PDF  │              │ HTTP    │ HTTP
          Parsing        ▼              │ REST    │ JSON
                  ┌────────────┐        ▼         ▼
                  │   pypdf    │   ┌────────┐ ┌────────┐
                  └────────────┘   │ GitHub │ │  Groq  │
                                   │  API   │ │  API   │
                                   └────────┘ └────────┘
```

### 1.1 Frontend & Core App Runtime: Streamlit
*   **Alternative Evaluated:** React (Vite) + Node.js (Express) on Azure App Services.
*   **Selection:** Streamlit (Python-based application framework).
*   **Rationale:** 
    *   *Zero-Config Frontend/Backend Boundary:* Streamlit unifies the user interface and backend execution into a single process. This eliminates the need to build, debug, and coordinate REST APIs, state serialization interfaces, or CORS controls, saving roughly 3-4 hours of development time.
    *   *Native Support for Multi-Tab UI Components:* Streamlit’s native `st.tabs` component makes it easy to separate ingestion, analysis, and interview practice views, removing the need for a separate router or client-side navigation library.
    *   *Native State Management:* Native `st.session_state` stores data in-memory without needing a state management library like Redux or Pinia, making it easy to transition between FSM states during script reruns.

### 1.2 Primary Language: Python 3.10+
*   **Selection:** Python 3.10+.
*   **Rationale:** 
    *   *Library Support:* Python has native, lightweight libraries for text parsing, PDF manipulation, and HTTP communication.
    *   *Official LLM SDKs:* Major LLM providers release first-class Python libraries, reducing integration friction.
    *   *Pattern Matching:* Python 3.10’s structural pattern matching (`match`/`case`) simplifies FSM state checking and response handling.

### 1.3 AI Processing Engine: Groq API (LLaMA-3-8b-8192)
*   **Alternative Evaluated:** Azure OpenAI Service (GPT-4o).
*   **Selection:** Groq LLaMA-3-8b-8192.
*   **Rationale:**
    *   *Speed:* Groq’s LPU (Language Processing Unit) architecture processes tokens at speeds exceeding 250 tokens per second, with an average response time of under 1.5 seconds. This is critical for keeping users engaged during live demos, whereas standard cloud APIs can take 8 to 15 seconds.
    *   *JSON Mode Support:* LLaMA-3-8b natively supports structured JSON modes, ensuring responses format correctly as typed dictionaries that parser scripts can read immediately.

### 1.4 Core Utilities
*   **`pypdf`:** A lightweight, pure-Python library chosen for PDF text extraction. Unlike heavy OCR tools, `pypdf` runs entirely in memory without requiring external binary dependencies or database engines.
*   **`requests` / `httpx`:** Standard libraries used to query public GitHub API endpoints.
*   **`fpdf2`:** A simple PDF generation library chosen to format the final analysis scorecard. It runs entirely on the application instance, creating downloadable reports as in-memory bytes arrays without writing files to local storage.

---

## SECTION 2: API PAYLOAD CONTRACTS & SCHEMAS

### 2.1 GitHub REST API Contract
The system authenticates with the GitHub REST API using a GitHub Personal Access Token (PAT) to ensure high rate limits.

#### 1. HTTP Request Configuration
```http
GET /repos/{owner}/{repo} HTTP/1.1
Host: api.github.com
Authorization: token ghp_82ab9128371283abc...
Accept: application/vnd.github+json
User-Agent: CareerLaunch-AI-Client/1.0
```

#### 2. Expected Response Schema: Repository Metadata
```json
{
  "name": "my-backend-engine",
  "description": "Production database engine with custom caching built on FastAPI.",
  "html_url": "https://github.com/testuser/my-backend-engine",
  "stargazers_count": 12,
  "forks_count": 2,
  "language": "Python",
  "created_at": "2025-06-01T12:00:00Z",
  "updated_at": "2026-06-05T18:30:00Z"
}
```

#### 3. Expected Response Schema: Commit History
*   **Path:** `GET /repos/{owner}/{repo}/commits?per_page=10`
```json
[
  {
    "sha": "9b1deb4d3b7d1e84aa623fdfa6238ad5ff008a9f",
    "commit": {
      "author": {
        "name": "Test User",
        "date": "2026-06-05T14:32:00Z"
      },
      "message": "feat: integrate API connection and build parser error handling"
    }
  }
]
```

---

### 2.2 LLM Gap Analysis JSON Payload (Groq/Cohere API)

#### 1. API Request JSON Payload
```json
{
  "model": "llama3-8b-8192",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert Solutions Architect. Compare the user's resume text and GitHub project data with the target job description. Identify matched skills and missing gaps, and output a valid JSON response matching the requested schema."
    },
    {
      "role": "user",
      "content": "JOB DESCRIPTION: Need a backend engineer with Python, FastAPI, and Docker experience. RESUME: Has Python and FastAPI. GITHUB COMMITS: Added endpoints to FastAPI app. File tree contains main.py, requirements.txt."
    }
  ],
  "response_format": {
    "type": "json_object"
  },
  "temperature": 0.2
}
```

#### 2. Expected Output JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "GapAnalysisResponse",
  "type": "object",
  "properties": {
    "match_score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100
    },
    "matched_skills": {
      "type": "array",
      "items": { "type": "string" }
    },
    "skill_gaps": {
      "type": "array",
      "items": { "type": "string" }
    },
    "match_justification": {
      "type": "string"
    },
    "learning_roadmap": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "concept_to_learn": { "type": "string" },
          "recommended_resource": { "type": "string" },
          "estimated_hours": { "type": "integer" }
        },
        "required": ["concept_to_learn", "recommended_resource", "estimated_hours"]
      }
    }
  },
  "required": ["match_score", "matched_skills", "skill_gaps", "match_justification", "learning_roadmap"]
}
```

---

### 2.3 LLM Interview Feedback JSON Payload

#### 1. API Request JSON Payload
```json
{
  "model": "llama3-8b-8192",
  "messages": [
    {
      "role": "system",
      "content": "Grade the user's mock interview response based on the question context. Highlight strengths, identify answer gaps, and provide a rewrite using the STAR method. Output must match the requested JSON schema."
    },
    {
      "role": "user",
      "content": "QUESTION: How do you handle database connections under high loads? ANSWER: I just open connections when I need them, but it got slow so I added some try-catch statements."
    }
  ],
  "response_format": {
    "type": "json_object"
  },
  "temperature": 0.3
}
```

#### 2. Expected Output JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "InterviewFeedbackResponse",
  "type": "object",
  "properties": {
    "answer_score": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10
    },
    "strong_points": {
      "type": "array",
      "items": { "type": "string" }
    },
    "gaps_in_answer": {
      "type": "array",
      "items": { "type": "string" }
    },
    "optimized_star_answer": {
      "type": "string"
    }
  },
  "required": ["answer_score", "strong_points", "gaps_in_answer", "optimized_star_answer"]
}
```

---

## SECTION 3: ENVIRONMENT CONFIGURATION & SECURITY

### 3.1 Secrets Configuration (`.streamlit/secrets.toml`)
Streamlit uses a local configuration file to load API keys securely without exposing them in git repositories.

```toml
# ==============================================================================
# SECURE CONFIGURATION FILE - DO NOT COMMIT TO SOURCE CONTROL
# File Path: .streamlit/secrets.toml
# ==============================================================================

# API authentication credentials for the LLaMA-3 processing engine
GROQ_API_KEY = "gsk_yA7182ba817381283abc123xyz..."

# Optional token to raise GitHub API rate limits
GITHUB_PAT = "ghp_82ab9128371283abc789xyz..."
```

---

### 3.2 Security Mitigation Strategy & Data Lifecycle
To meet enterprise compliance standards (such as Microsoft AI privacy guidelines), the application implements a strict **zero-retention policy**.

```
 Upload File ──► System RAM ──► API Request ──► Session Close ──► Garbage Collection
```

*   **Stateless Operations:** PDF files parsed by `pypdf` are read directly from memory bytes streams.
*   **No Persistence:** Uploaded files and git trees are never written to local disks, databases, or temporary system files.
*   **Memory Isolation:** Streamlit assigns session state dictionary elements to distinct user sessions. When a browser tab is closed, the garbage collector wipes the associated variables from system memory.
*   **Transit Security:** All API connections (GitHub API and Groq Engine) are forced through HTTPS connections over TLS 1.3.
