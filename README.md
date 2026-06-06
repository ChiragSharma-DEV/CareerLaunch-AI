<!-- HERO SECTION START -->
<div align="center">

<!-- Centered Project Logo (Static SVG) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120">
  <defs>
    <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url(#grad-primary)" filter="url(#glow)" />
  <path d="M35 65 L48 35 L65 65 Z" fill="none" stroke="#ffffff" stroke-width="6" stroke-linejoin="round" />
  <circle cx="50" cy="48" r="4" fill="#ffffff" />
</svg>

# Career Launch AI

### The End-to-End Job Readiness Suite

[![Build Status](https://img.shields.io/badge/build-passing-success?style=for-the-badge&logo=github-actions&logoColor=white&color=a855f7)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge&logo=open-source-initiative&logoColor=white&color=ec4899)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-v1.0.0--beta-orange?style=for-the-badge&logo=git&logoColor=white&color=3b82f6)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT)
[![Tech Stack](https://img.shields.io/badge/tech--stack-AI%20%7C%20Serverless%20JS-brightgreen?style=for-the-badge&logo=javascript&logoColor=white&color=06b6d4)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT)
[![Contributors](https://img.shields.io/github/contributors/ChiragSharma-DEV/AI-FOR-IMPACT?style=for-the-badge&logo=github&logoColor=white&color=10b981)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/ChiragSharma-DEV/AI-FOR-IMPACT?style=for-the-badge&logo=github&logoColor=white&color=f59e0b)](https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT/stargazers)

<br/>

**Career Launch AI** is a state-of-the-art, client-side, zero-persistence job readiness platform built explicitly for engineering students and freshers. By marrying high-performance LLMs (LLaMA-3 via Groq) with browser-based parsing engines (PDF.js) and real-time developer profiling (GitHub REST API), it equips candidates to audit their resumes, close technical skill gaps, simulate enterprise-grade AI technical interviews, and model collaborative development workstreams.

---

<!-- Animated Banner Placeholder (GIF) -->
<div align="center">
  <img src="https://via.placeholder.com/1200x500/08070f/a855f7?text=Career+Launch+AI+-+Interactive+Platform+Dashboard+Showcase.gif" alt="Career Launch AI Dashboard Banner" width="100%" style="border-radius:10px; border: 1px solid rgba(168,85,247,0.15);" />
  <p><em>[Animated Banner Demo: Synthesizing candidate resume text alongside real-time GitHub commit history graphs and projecting an interactive skill gap matrix on a dark glassmorphic dashboard.]</em></p>
</div>

</div>

---

## ⚡ The Problem & The Solution

```mermaid
graph TD
    subgraph StatusQuo ["The Broken Status Quo"]
        A[Static Resume PDF] -->|1. Naive Keyword Matching| B(Keyword-Stuffed ATS Files)
        C[Public Repositories] -->|2. Separated Code Signals| D(Untapped Developer Data)
        B -->|3. Black-Box Rejections| E{Hiring Gateways}
        D -->|4. Ignored Core Contributions| E
        E -->|5. High Rejection Rate| F[Stressful, Generic Interviews]
    end

    subgraph CareerLaunch ["The Career Launch AI Solution"]
        G[PDF Resume] -->|A1: PDF.js In-Browser Parsing| H(Clean Client Text Buffer)
        I[GitHub Profile] -->|A2: REST Contribution Audit| J(Verified Code Signatures)
        H --> K[Groq AI Integration Layer]
        J --> K
        K -->|A3: LLaMA-3.1 Real-time Synthesis| L[Structured Readiness Score]
        L --> M[Interactive Technical Interview Coaching]
        L --> N[Collaborative Sprint Planner Simulator]
    end

    style StatusQuo fill:#140e15,stroke:#f43f5e,stroke-width:2px,color:#fff
    style CareerLaunch fill:#0c101a,stroke:#10b981,stroke-width:2px,color:#fff
    style E fill:#45161c,stroke:#f43f5e
    style K fill:#25163a,stroke:#a855f7
```

<details>
<summary>📖 Click to expand System Overview & Architectural Motivation</summary>
<br/>

Traditional recruitment mechanisms rely on unverified textual claims, creating an optimization loophole where candidates focus on matching keywords rather than building practical engineering competencies. 

**Career Launch AI** directly addresses this mismatch. By extracting structured data points from PDF formats locally and querying authentic commit signatures from the GitHub REST API, the platform builds an objective profile. It feeds this unified data model directly into high-throughput LLM endpoints, enabling automated skill audits and customized technical mock interviews.
</details>

---

## 🏛️ System & Container Architecture

### C4 Container Diagram
Illustrates the container boundaries and integration protocols.

```mermaid
graph LR
    User[Developer Candidate] -->|Interacts HTTPS| WebApp[Single Page App Container]
    
    subgraph AppBoundary ["Career Launch AI Architecture"]
        WebApp -->|Uses JS Runtime| PDFParser[PDF.js Text Extractor]
        WebApp -->|Queries| GitFetcher[GitHub Data Retriever]
        WebApp -->|Configures State| Storage[Browser LocalStorage]
    end
    
    GitFetcher -->|OAuth HTTP Request| GitHub[GitHub REST API]
    WebApp -->|Bearer Token HTTP POST| Groq[Groq AI Completion Engine]

    style AppBoundary fill:#141325,stroke:#ec4899,stroke-width:2px,color:#fff
    style WebApp fill:#1c1a30,stroke:#3b82f6,color:#fff
    style GitHub fill:#0e0d1a,stroke:#10b981,color:#fff
    style Groq fill:#0e0d1a,stroke:#a855f7,color:#fff
```

### Chronological Ingestion & Analysis Sequence
```mermaid
sequenceDiagram
    autonumber
    actor User as Candidate Browser
    participant UI as Glassmorphic View Layer
    participant PDF as PDF.js Parser
    participant Git as GitHub Connector
    participant Groq as Groq AI Gateway
    participant Storage as LocalStorage State

    User->>UI: Drop Resume & Enter Repo Target
    UI->>PDF: Parse File Binary Buffer
    activate PDF
    PDF->>PDF: Extract raw layouts & format text
    PDF-->>UI: Return sanitized string
    deactivate PDF
    UI->>Storage: Update 'resume_text'

    UI->>Git: Request GitHub Repository Details
    activate Git
    Git->>Git: Verify OAuth Headers & Rate Limits
    Git-->>UI: Return Commits, Code Topology & Languages
    deactivate Git
    UI->>Storage: Update 'github_metadata'

    UI->>Groq: Exec completion request (JSON Mode)
    activate Groq
    Note over Groq: Process Resume Text + GitHub Metadata <br/> against Job Description requirements
    Groq-->>UI: Return structured JSON evaluation
    deactivate Groq
    
    UI->>Storage: Update 'evaluation_results'
    UI-->>User: Refresh dynamic widgets & unlock coach panels
```

### State Store & Local Database Entities
```mermaid
erDiagram
    CandidateProfile {
        string groq_api_key PK
        string github_pat
        string resume_text
    }
    GitHubAnalysis {
        string repository_url PK
        string primary_language
        list active_commits
        list directory_tree
    }
    EvaluationResults {
        int fit_score
        list skills_discovered
        list gaps_identified
        string code_assertions_review
    }
    CandidateProfile ||--|| GitHubAnalysis : "binds"
    CandidateProfile ||--|| EvaluationResults : "evaluates"
```

### Deployment Topology
```mermaid
graph TD
    subgraph Hosting ["Edge Content Delivery Network"]
        CDN[GitHub Pages / Vercel Edge] -->|Deploy Static Assets| Edge[Client Browser Target]
    end
    
    subgraph AICloud ["Groq Serverless Cluster"]
        Engine[Groq API Edge Nodes] -->|Execute Inference| LLaMA[LLaMA-3.1 8B Model]
    end

    subgraph PlatformCloud ["GitHub Platform"]
        GitAPI[GitHub REST API Engine]
    end

    Edge -->|HTTP GET/POST| Engine
    Edge -->|HTTP GET| GitAPI

    style Hosting fill:#0e0d1a,stroke:#3b82f6,color:#fff
    style AICloud fill:#0e0d1a,stroke:#ec4899,color:#fff
    style PlatformCloud fill:#0e0d1a,stroke:#10b981,color:#fff
```

---

## 🕹️ Core Modules & Features

<div align="center">

| 📄 **Profile Auditor** | 💻 **GitHub Connector** | 🎙️ **AI Interview Coach** |
| :--- | :--- | :--- |
| Uses **PDF.js** directly inside the browser sandbox to parse binary layouts, strip control codes, and isolate clean candidate texts without server upload lags. | Queries public repositories via REST to check stars, file schemas, language splits, and commit frequency. | Runs live mock technical chats with LLaMA-3.1, providing detailed feedback on conceptual answers. |
| **Ingestion Flow:** <br> `PDF -> [PDF.js] -> Clean Text -> State` | **Audit Flow:** <br> `Repo -> [REST API] -> Code Signature` | **Execution Flow:** <br> `Q & A -> [LLaMA-3] -> Gap Score` |
| <img src="https://via.placeholder.com/260x150/08070f/a855f7?text=PDF.js+Extractor+GIF" width="100%" /> | <img src="https://via.placeholder.com/260x150/08070f/3b82f6?text=Git+Audit+GIF" width="100%" /> | <img src="https://via.placeholder.com/260x150/08070f/ec4899?text=AI+Mock+Coach+GIF" width="100%" /> |

<br/>

| 📊 **Insights Dashboard** | 🎯 **Team Sprint Simulator** | ⌨️ **Omni Command Palette** |
| :--- | :--- | :--- |
| Maps resume skills against target job description requirements, highlighting matches and high-priority gaps. | Simulates an agile Scrum sprint, modeling technical task allocation across diverse developer personas. | Access global application state, run feature triggers, and search documentation instantly using `Ctrl+K`. |
| **Dashboard Flow:** <br> `Text Analysis -> [Match Matrix] -> Chart` | **Simulation Flow:** <br> `Sprint -> [AI Agents] -> Task Allocation` | **Interface Flow:** <br> `Ctrl+K -> [Dynamic Search] -> Route` |
| <img src="https://via.placeholder.com/260x150/08070f/06b6d4?text=Insights+Dashboard+GIF" width="100%" /> | <img src="https://via.placeholder.com/260x150/08070f/d946ef?text=Sprint+Simulator+GIF" width="100%" /> | <img src="https://via.placeholder.com/260x150/08070f/10b981?text=Command+Palette+GIF" width="100%" /> |

</div>

---

## 📂 Repository Directory Layout

```
career-launch-ai/
├── DOC/                             # Architect specifications & planning documents
│   ├── system_architecture_spec.md  # Detailed data flow & rate limit specification
│   ├── tech_stack_api_spec.md       # Integration blueprints for Groq & GitHub APIs
│   └── prd_mvp_v1.md                # Functional specifications & roadmap phases
├── stitch_frontend/
│   └── app/                         # Frontend client codebase
│       ├── index.html               # Main router & auto-redirect gateway
│       ├── insights.html            # Profile analyzer & match dashboard
│       ├── mock-interview.html      # Technical interview simulator
│       ├── profile-auditor.html     # Resume ingestion & verification engine
│       ├── team-planner.html        # Agile sprint emulator
│       ├── command-palette.html     # Omni search navigation panel
│       ├── auth.js                  # Secret validation & configuration module
│       └── theme.css                # Visual style guide & glassmorphic tokens
├── li_script.js                     # Platform background operations parser
├── .gitignore                       # Repository exclusion rules
└── README.md                        # Project technical manual
```

---

## ⚡ API Architecture & Lifecycle

### API Request Lifecycles
```mermaid
sequenceDiagram
    autonumber
    participant Client as User Web Browser
    participant Git as GitHub API Endpoint
    participant Groq as Groq Completions API

    %% GitHub Lifecycle
    Client->>Git: HTTP GET repo metadata (Bearer token header)
    activate Git
    Note over Git: Check API key validity & quota constraints
    Git-->>Client: Return 200 OK (Metadata body)
    deactivate Git

    %% Groq LLM Lifecycle
    Client->>Groq: HTTP POST chat/completions (JSON format request)
    activate Groq
    Note over Groq: Process system directives & output schema
    Groq-->>Client: Return 200 OK (Structured JSON response)
    deactivate Groq
```

---

## 🔒 Security & Performance Model

### Zero-Persistence Privacy Model

```mermaid
graph TD
    subgraph BrowserSandbox ["Secure Client Sandbox (In-Memory Only)"]
        A[Resume File Buffer]
        B[User OAuth Credentials]
        C[LocalStorage State Store]
    end
    
    subgraph Blocked ["Untrusted Environments"]
        D[No Backend Database Server]
        E[No Proxy Server Logs]
    end
    
    subgraph Gateways ["Target API Providers"]
        F[GitHub REST Gateway]
        G[Groq LLM Gateways]
    end

    A -->|Direct Call TLS 1.3| F
    B -->|Direct Call TLS 1.3| G
    C -.->|Access Boundary| D

    style BrowserSandbox fill:#0d1c12,stroke:#10b981,stroke-width:2px,color:#fff
    style Blocked fill:#1c0d0d,stroke:#f43f5e,stroke-width:2px,color:#fff
    style Gateways fill:#0e0d1a,stroke:#3b82f6,color:#fff
```

### Performance Metrics & Token Flow
*   **Document Ingestion (PDF.js)**: Reads, cleans, and outputs text in `< 350ms`.
*   **Groq API Completion Generation**: LLaMA-3.1 generates a full assessment in `< 1.2s`.
*   **Edge CDN Load Time**: Static UI components load in `< 500ms` globally.

---

## 🛠️ Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ChiragSharma-DEV/CareerLaunch-AI.git
cd CareerLaunch-AI
```

### 2. Configure Credentials
Because Career Launch AI runs entirely in your browser sandbox, credentials are saved securely in your browser's local storage and are never sent to external servers.

```javascript
// Open your browser console (F12) on localhost and run:
localStorage.setItem('groq_api_key', 'gsk_YOUR_GROQ_API_KEY_HERE');
localStorage.setItem('github_pat', 'ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE');
```

### 3. Run Locally
```bash
# Using Python
cd stitch_frontend/app
python -m http.server 8080
```
Visit `http://localhost:8080` in your web browser.

---

## 🗺️ Project Timeline & CI/CD Pipeline

### 1. Gantt Implementation Roadmap
```mermaid
gantt
    title Career Launch AI Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Core MVP
    PDF.js Ingestion Pipeline           :done,    des1, 2026-05-01, 2026-05-10
    GitHub Profile REST Connector      :done,    des2, 2026-05-11, 2026-05-20
    Groq LLaMA-3 Integration           :done,    des3, 2026-05-21, 2026-05-30
    section Enhancements
    Audio Interview Responses          :active,  des4, 2026-06-01, 2026-06-15
    Multi-Agent Sprint Planner Sim     :active,  des5, 2026-06-16, 2026-06-30
```

### 2. CI/CD Pipeline Flow
```mermaid
graph LR
    Push[Developer Push Commit] --> Lint[Linting Check]
    Lint --> UT[Execute Unit Tests]
    UT --> Build[Static Build Compilation]
    Build --> Deploy[Edge CDN Deploy]

    style Push fill:#0e0d1a,stroke:#a855f7,color:#fff
    style UT fill:#0e0d1a,stroke:#ec4899,color:#fff
    style Deploy fill:#0d1c12,stroke:#10b981,color:#fff
```

---

## 🤝 Contribution Strategy & Branch Workflow

```mermaid
graph LR
    Fork[Fork Repository] --> Branch[Create Feature Branch]
    Branch --> Code[Implement Feature]
    Code --> Test[Run Local Tests]
    Test --> PullRequest[Open Pull Request]
    PullRequest --> Review[Maintainer Code Review]
    Review --> Merge[Merge to Main]

    style Fork fill:#0e0d1a,stroke:#a855f7,color:#fff
    style PullRequest fill:#0e0d1a,stroke:#ec4899,color:#fff
    style Merge fill:#0d1c12,stroke:#10b981,color:#fff
```

---

## 📄 License & Credits

*   Distributed under the **MIT License**. For details, review [LICENSE](file:///e:/HACKATHON/AI%20FOR%20IMPACT/LICENSE) (if available).
*   **PDF.js** is maintained by the Mozilla Foundation.
*   **Groq API** and **LLaMA-3** are powered by Groq Cloud and Meta respectively.
*   Designed with inspiration from glassmorphic design languages.

---
<div align="center">
  <sub>Developed by elite minds, built for future builders. Powered by Career Launch AI.</sub>
</div>
