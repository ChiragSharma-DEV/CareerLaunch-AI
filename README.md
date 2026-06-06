<!-- HERO SECTION START -->
<div align="center">

<!-- Custom Dynamic Gradient SVG Logo -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="100%" max-width="600" height="auto">
  <defs>
    <linearGradient id="purplePink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#d946ef;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="blueTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background Glow Element -->
  <rect x="10" y="10" width="780" height="200" rx="24" fill="#0e0d1a" stroke="url(#purplePink)" stroke-width="2" />
  
  <!-- Logo Icon -->
  <g transform="translate(45, 50)">
    <circle cx="60" cy="60" r="50" fill="url(#purplePink)" filter="url(#neonGlow)" opacity="0.9" />
    <path d="M35 80 L60 35 L85 80 Z" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" />
    <circle cx="60" cy="58" r="6" fill="#ffffff" />
    <path d="M48 80 L72 80" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Typography -->
  <text x="190" y="115" font-family="'Inter', 'Segoe UI', sans-serif" font-weight="900" font-size="44" fill="#f0eeff" letter-spacing="2">CAREERLAUNCH</text>
  <text x="560" y="115" font-family="'Inter', 'Segoe UI', sans-serif" font-weight="900" font-size="44" fill="url(#blueTeal)" letter-spacing="2">AI</text>
  <text x="192" y="155" font-family="'Inter', 'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#a8a3c9" letter-spacing="4">THE END-TO-END JOB READINESS SUITE</text>
</svg>

<br/>

<!-- Animated Showcase Banner -->
<img src="https://via.placeholder.com/1200x450/08070f/a855f7?text=Career+Launch+AI+-+Cinematic+Dashboard+Orchestration" alt="Career Launch AI Dynamic Banner" width="100%" style="border-radius:14px; border: 1px solid rgba(168,85,247,0.25); box-shadow: 0 20px 50px rgba(0,0,0,0.8);" />

<br/>
<br/>

<!-- Modern Badge Row -->
<p align="center">
  <img src="https://img.shields.io/badge/build-passing-success?style=for-the-badge&logo=github-actions&logoColor=white&color=a855f7" alt="Build" />
  <img src="https://img.shields.io/badge/release-v1.0.0--beta-blue?style=for-the-badge&logo=git&logoColor=white&color=3b82f6" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge&logo=open-source-initiative&logoColor=white&color=10b981" alt="License" />
  <img src="https://img.shields.io/badge/stack-Serverless%20%7C%20AI-orange?style=for-the-badge&logo=javascript&logoColor=white&color=ec4899" alt="Stack" />
  <img src="https://img.shields.io/github/stars/ChiragSharma-DEV/AI-FOR-IMPACT?style=for-the-badge&logo=github&logoColor=white&color=f59e0b" alt="Stars" />
</p>

<p align="center">
  <strong>An elite, zero-persistence developer preparation workspace.</strong><br/>
  Synthesizes browser-side document tokenization, GitHub contribution analytics, and LLaMA-3.1 inference gateways<br/>
  to transform candidate portfolios into verified, interview-ready profiles.
</p>

</div>
<!-- HERO SECTION END -->

<!-- SECTION DIVIDER (SVG Gradient Wave) -->
<div align="center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" width="100%" height="auto" style="margin: 20px 0;">
    <path fill="none" stroke="url(#purplePink)" stroke-width="2" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32" />
    <path fill="url(#purplePink)" fill-opacity="0.05" d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" />
  </svg>
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

### 1. System Component Block Diagram
This system-level breakdown shows the separation of concerns between client sandboxes and external servers.

```mermaid
graph TD
    subgraph Browser ["User Browser Environment (Sandbox)"]
        UI[Glassmorphic HTML UI]
        Theme[Theme CSS & Design Tokens]
        State[Local Storage & Session State]
        
        subgraph Ingestion ["Ingestion Module"]
            PDFJS[PDF.js Binary Parser]
            GitConnector[GitHub REST API Connector]
        end
    end
    
    subgraph Gateways ["External API Services"]
        GitHubAPI[GitHub REST Gateway]
        GroqAPI[Groq Serverless Inference]
    end

    UI -->|Loads| Theme
    UI -->|Reads/Writes| State
    UI -->|Instantiates| PDFJS
    UI -->|Executes| GitConnector
    
    GitConnector <-->|HTTPS REST| GitHubAPI
    UI <-->|JSON Payload Mode| GroqAPI
    
    GitHubAPI -->|Commit Data| State
    GroqAPI -->|Analysis JSON| State

    style Browser fill:#0e0d1a,stroke:#a855f7,stroke-width:2px,color:#fff
    style Gateways fill:#08070f,stroke:#06b6d4,stroke-width:2px,color:#fff
```

### 2. C4 Container Diagram
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

### 3. Chronological Ingestion & Analysis Sequence

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

### 4. Logical Database (Local Storage State) Entity-Relationship Model

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

### 5. Deployment Topology

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

The lifecycle of external requests is direct, moving from the client's browser sandbox to external API servers over secure HTTP connections.

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

### Endpoint Registry

| Service | Target Route | Method | Header Keys | Payload Format |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub REST** | `/repos/{owner}/{repo}` | `GET` | `Authorization: token <pat>` | Query params / JSON |
| **GitHub Commits** | `/repos/{owner}/{repo}/commits` | `GET` | `Authorization: token <pat>` | Query params / JSON |
| **Groq Engine** | `/openai/v1/chat/completions` | `POST` | `Authorization: Bearer <key>` | Structured JSON |

### Sample Groq Payload (JSON Mode Request)

**Request Payload:**
```json
{
  "model": "llama-3.1-8b-instant",
  "response_format": {
    "type": "json_object"
  },
  "messages": [
    {
      "role": "system",
      "content": "You are an expert technical interviewer. Return evaluation metrics in a valid JSON schema."
    },
    {
      "role": "user",
      "content": "Resume: [Extracted Resume Content] ... Github: [Git Stats] ... Target JD: [Job Description]"
    }
  ]
}
```

**Response Payload:**
```json
{
  "fit_score": 88,
  "skills_discovered": ["JavaScript", "TailwindCSS", "PDF.js"],
  "gaps": [
    {
      "skill": "Docker",
      "reason": "Target JD requests cloud container deployment, but candidate's git history shows no container configuration files.",
      "priority": "HIGH"
    }
  ],
  "project_validation": "Github repository contains commits matching assertions, verifying practical application."
}
```

---

## 🔒 Security & Performance Model

### Zero-Persistence Privacy Model

```mermaid
graph TD
    subgraph BrowserSandbox ["Secure Client Sandbox (In-Memory Only)"]
        A[Raw Resume Data Buffer]
        B[User OAuth Credentials]
        C[LocalStorage Configuration]
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
By executing client-side, the app scales with zero cloud server overhead and minimal startup lag:

*   **Document Ingestion (PDF.js)**: Reads, cleans, and outputs text in `< 350ms`.
*   **Groq API Completion Generation**: LLaMA-3.1 generates a full assessment in `< 1.2s`.
*   **Edge CDN Load Time**: Static UI components load in `< 500ms` globally.

---

## 🛠️ Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ChiragSharma-DEV/AI-FOR-IMPACT.git
cd AI-FOR-IMPACT
```

### 2. Configure Credentials
Because Career Launch AI runs entirely in your browser sandbox, credentials are saved securely in your browser's local storage and are never sent to external servers.

You can configure these directly in the application's developer settings panel, or preset them in your local debug environment by adding them to your browser's localStorage console:

```javascript
// Open your browser console (F12) on localhost and run:
localStorage.setItem('groq_api_key', 'gsk_YOUR_GROQ_API_KEY_HERE');
localStorage.setItem('github_pat', 'ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE');
```

### 3. Run Locally
Start a lightweight web server to load the pages. You can use any static server, such as `python` or `http-server`:

```bash
# Using Python
cd stitch_frontend/app
python -m http.server 8080

# Using Node.js
npx http-server -p 8080
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
    section Enterprise V2
    Automated Mock Testing Suites      :         des6, 2026-07-01, 15d
    Custom Multi-Repo Evaluator        :         des7, 2026-07-16, 15d
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

*   **Production Branch**: `main` houses the current production-stable deployment.
*   **Development workflow**: Create a descriptive branch named `feature/your-feature-name` or `bugfix/issue-resolved` and submit a Pull Request targeting `main`.

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
