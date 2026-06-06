# CareerLaunch AI: Tech Stack Selection & API Integrations Specification (Updated V3.0)
**Author:** Enterprise Technical Lead  
**Target Audience:** Microsoft Evaluators, Enterprise Judges, Lead Developers  
**Classification:** Technical Stack & API Specification

---

## SECTION 1: DETAILED TECH STACK CHOICE & RATIONALE

To deliver a high-quality, production-ready mock interview simulator within a constrained timeline, the technology choices were chosen for speed of development, system responsiveness, serverless portability, and architectural simplicity.

```
                    ┌─────────────────────────────────────┐
                    │          CAREERLAUNCH AI            │
                    │   Client-Side Browser runtime       │
                    └──────┬──────────────┬─────────┬─────┘
                           │              │         │
            Browser PDF    │              │ HTTP    │ HTTP
            Parsing        ▼              │ REST    │ JSON
                    ┌────────────┐        ▼         ▼
                    │   PDF.js   │   ┌────────┐ ┌────────┐
                    └────────────┘   │ GitHub │ │  Groq  │
                                     │  API   │ │  API   │
                                     └────────┘ └────────┘
```

### 1.1 Core Platform Runtime: Pure Client-Side SPA Flow
*   **Alternative Evaluated:** React (Vite) + Node.js (Express) or Streamlit.
*   **Selection:** Pure Browser ES6 runtime (served via `python -m http.server 8000`).
*   **Rationale:** 
    *   *Zero Backend Boundary:* Unifying state and execution inside the browser eliminates the need to coordinate network routes, deploy servers, or handle CORS policies on localhost, making the app 100% portable and easy to run anywhere.
    *   *Dynamic Gating via localStorage:* Browser `localStorage` acts as a global in-memory state repository, passing profile data, repos, and gap analyses seamlessly between HTML pages.
    *   *Instant UI Reactivity:* Updates to the DOM happen instantly, avoiding Streamlit's full-script execution re-run delays and keeping the interface feeling snappy.

### 1.2 Core Client-Side Utilities

*   **PDF.js (v2.16.105):** Loaded via CDN, it parses uploaded PDF documents directly in the browser's sandbox using worker threads, extracting raw text and candidate details.
*   **Web Speech API (webkitSpeechRecognition):** Built-in browser speech-to-text API, enabling real-time voice response transcription with zero dependency on external audio processors.
*   **Chart.js (v4.x):** Renders the candidate's adaptive difficulty trajectory over the sequence of questions on a 2D line graph, visualizing the AI interviewer's internal adaptations.
*   **jsPDF (v2.5.1):** Loaded via CDN, it compiles all interview questions, user responses, scoreboards, and coaching recommendations into a downloadable PDF scorecard on the Mock Interview page, as well as the LinkedIn Audit Report PDF on the Profile Auditor page, compiled entirely in the user's browser.

---

## SECTION 2: API PAYLOAD CONTRACTS & SCHEMAS

### 2.1 GitHub REST API Contract
Queries GitHub's public API to retrieve repository files, stars, and commits.
*   **Endpoint:** `GET https://api.github.com/repos/{owner}/{repo}`
*   **Scope:** Commits (`/commits?per_page=10`), metadata, and languages.

### 2.2 Groq LLaMA-3.1 API Contract
Utilizes Groq's high-speed endpoint in JSON Mode for dynamic, low-latency compatibility analysis and mock evaluations.
*   **Model:** `llama-3.1-8b-instant`
*   **Headers:**
    *   `Authorization: Bearer <local_key>`
    *   `Content-Type: application/json`
*   **Response Format:** `{ "type": "json_object" }`
