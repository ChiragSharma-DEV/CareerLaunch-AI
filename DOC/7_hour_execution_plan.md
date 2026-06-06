# CareerLaunch AI: 7-Hour Implementation & Execution Plan
**Author:** Technical Project Manager & Scrum Master  
**Target Audience:** Development Team, Hackathon Judges, Project Evaluators  
**Date:** Saturday, June 6, 2026 (Hackathon Day)  
**Time Window:** 10:00 AM - 5:00 PM (Final Submission deadline at 5:00 PM)  
**Classification:** Project Management & Agile Execution Plan

---

## SECTION 1: TEAM ROLES & RESPONSIBILITIES

To avoid duplication of work and minimize integration friction, development responsibilities are split into four clear areas. 

```
┌────────────────────────────────────────────────────────────────────────┐
│                          WORKLOAD DISTRIBUTIONS                        │
│                                                                        │
│  ┌────────────────────────┐            ┌────────────────────────────┐  │
│  │      DEVELOPER 1       │            │        DEVELOPER 2         │  │
│  │   Frontend & State     │            │      Backend & Parser      │  │
│  └────────────────────────┘            └────────────────────────────┘  │
│  ┌────────────────────────┐            ┌────────────────────────────┐  │
│  │      DEVELOPER 3       │            │        DEVELOPER 4         │  │
│  │     AI Integration     │            │    DevOps, QA, & Video     │  │
│  └────────────────────────┘            └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1 4-Developer Team Configuration
*   **Developer 1 (Frontend & State Master):**
    *   *Deliverables:* Main application interface (`app.py`), tab layouts, session state definitions, progress indicators, styling, and navigation logic.
    *   *Critical KPI:* Ensure no UI state is lost when toggling between tabs.
*   **Developer 2 (Backend & Parser Specialist):**
    *   *Deliverables:* In-memory PDF parsing logic (`pdf_parser.py`), GitHub API integrations (`github_scraper.py`), inline parser validation wrappers, and the downloadable PDF report exporter (`report_generator.py`).
    *   *Critical KPI:* Prevent unhandled parsing exceptions or tracebacks on the UI.
*   **Developer 3 (AI Integration & Prompt Engineer):**
    *   *Deliverables:* LLM client interface (`llm_client.py`), prompt engineering (XML/JSON context injection templates), JSON Mode schemas, mock fallback payloads, and response validation.
    *   *Critical KPI:* Ensure valid JSON responses from LLaMA-3 under 1.5 seconds.
*   **Developer 4 (DevOps, QA, & Presentation Lead):**
    *   *Deliverables:* Secure credential configuration (`.streamlit/secrets.toml`), test execution (using sample resumes and repos), architecture diagrams, setup documentation (`README.md`), and recording the final 3-minute video presentation.
    *   *Critical KPI:* Ensure the repository compiles cleanly on a fresh machine.

### 1.2 2-Developer Team Alternative Mapping
If executing with a two-person team, roles are grouped as follows:
*   **Developer A (Frontend + AI Integration):** Combines the roles of Developer 1 and Developer 3. Handles UI layout, session state, LLM API integration, and prompt engineering.
*   **Developer B (Backend + DevOps + QA):** Combines the roles of Developer 2 and Developer 4. Handles PDF/GitHub parsing pipelines, PDF report exports, environment configuration, system testing, and video production.

---

## SECTION 2: HOUR-BY-HOUR CRITICAL PATH MILESTONES

Today is Saturday, June 6, 2026. The current local time is **11:15 AM**. The critical path milestones map the remaining hours leading to the 5:00 PM submission.

```
 11:00 AM ──► 12:00 PM: UI Foundation & Setup
 12:00 PM ──► 01:30 PM: Core Ingestion (PDF / Git)
 01:30 PM ──► 02:30 PM: LLM / JSON Integration
 02:30 PM ──► 03:30 PM: FSM Gating & PDF Exporter
 03:30 PM ──► 04:30 PM: QA, Docs & Diagrams
 04:30 PM ──► 05:00 PM: Recording & Repo Submission
```

### 11:00 AM - 12:00 PM: UI Foundation & Setup
*   **Goal:** Build the UI skeleton and verify environment settings.
*   **Tasks:**
    *   Initialize the repository structure and add dependencies to `requirements.txt`.
    *   Set up local environment configurations in `.streamlit/secrets.toml`.
    *   Develop the tab structure in `app.py` with mock states to verify tab locking visual behaviors.
*   **Milestone Checkpoint (12:00 PM):** Main interface compiles locally with three locked tabs and state placeholders.

### 12:00 PM - 01:30 PM: Core Ingestion (PDF / Git)
*   **Goal:** Parse PDF resumes and ingest repository metadata.
*   **Tasks:**
    *   Implement `ResumeParser` in `pdf_parser.py` using `pypdf` to extract text from sample resumes.
    *   Implement `GitHubScraper` in `github_scraper.py` using `httpx` to parse repository URLs, fetch metadata, and collect commit logs.
    *   Add regex URL validations and try/except handlers to block incorrect URL input.
*   **Milestone Checkpoint (01:30 PM):** PDF text extraction and GitHub API calls function cleanly, printing structured dictionaries to the console.

### 01:30 PM - 02:30 PM: LLM / JSON Integration
*   **Goal:** Wire LLM prompt calls and parse structured JSON responses.
*   **Tasks:**
    *   Configure `LLMClient` in `llm_client.py` and verify connection to Groq LLaMA-3.
    *   Write the prompt template, injecting parsed resume text and repository metrics.
    *   Enforce JSON output schemas to automatically extract matching skills and gap roadmaps.
    *   Pass the output gaps into the mock question generator to dynamically populate the Tab 3 practice arena.
*   **Milestone Checkpoint (02:30 PM):** LLaMA-3 returns valid JSON structures under 1.5 seconds, populating the skills dashboard and mock questions.

### 02:30 PM - 03:30 PM: FSM Gating & PDF Exporter
*   **Goal:** Connect FSM state locks and build the scorecard PDF generator.
*   **Tasks:**
    *   Connect `st.session_state` flags to unlock Tab 2 and Tab 3 as ingestion steps are completed.
    *   Create the PDF scorecard generator in `report_generator.py` using `fpdf2`.
    *   Expose the PDF scorecard download button on Tab 2.
*   **Milestone Checkpoint (03:30 PM):** Tabs unlock dynamically based on input actions, and the scorecard downloads as a formatted PDF.

### 03:30 PM - 04:30 PM: QA, Docs & Diagrams
*   **Goal:** Run end-to-end tests, compile visual documentation, and finalize setup guides.
*   **Tasks:**
    *   Test the application using different resumes (e.g., student vs. experienced) to confirm prompt consistency.
    *   Save the final system architecture and data flow diagrams.
    *   Write a complete `README.md` detailing tech choices, environment configuration steps, and setup instructions.
*   **Milestone Checkpoint (04:30 PM):** Codebase is locked; local tests are completed, and setup documentation is finalized.

### 04:30 PM - 05:00 PM: Recording & Repo Submission
*   **Goal:** Record the demo video and submit the repository URL.
*   **Tasks:**
    *   Record a 3-minute, high-quality walkthrough video showing PDF uploads, GitHub parsing, AI analysis dashboard results, and mock interview practice.
    *   Push final code commits to the remote repository.
    *   Verify deployment links and submit the repository URL before the 5:00 PM deadline.
*   **Milestone Checkpoint (05:00 PM):** Project is successfully submitted with all code, documentation, and demo videos in place.

---

## SECTION 3: STRUCTURAL SEMANTIC COMMIT ROADMAP

To present a professional development workflow to evaluators, the team will use semantic commit messages to track progression.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       COMMIT PROGRESSION TIMELINE                      │
│                                                                        │
│  docs: PRD ──► feat: UI skeleton ──► feat: parser ──► feat: Git API   │
│                                                                  │     │
│  docs: README ◄── style: UI polish ◄── feat: PDF ◄── feat: LLM   │
└────────────────────────────────────────────────────────────────────────┘
```

1.  `docs: define PRD and architectural diagram schemas`
    *   Commit initial documentation files and architectural diagrams to the `DOC/` folder.
2.  `feat: initialize streamlit boilerplate and multi-tab state layout`
    *   Commit the base tab skeleton code, setup checks, and in-memory session states.
3.  `feat: implement resume pdf text parser module`
    *   Commit `modules/pdf_parser.py` containing text extraction and sanitization logic.
4.  `feat: integrate github rest api metadata and commit retriever`
    *   Commit `modules/github_scraper.py` containing URL validation patterns and API request handlers.
5.  `feat: connect groq llm client and configure json gap analysis schema`
    *   Commit `modules/llm_client.py` containing the prompt orchestrator, JSON configurations, and mock payloads.
6.  `feat: implement dynamic state lock and tab progression rules`
    *   Commit FSM gating rules and conditional checks in `app.py`.
7.  `feat: add pdf report scorecard generator`
    *   Commit `modules/report_generator.py` containing `fpdf2` configurations and download buttons.
8.  `style: polish dashboard visualizations and error callout states`
    *   Commit custom CSS, loading indicators, and error-handling blocks.
9.  `docs: update readme with setup instructions and finalize deployment link`
    *   Commit the final project README containing project summaries and installation guides.

---

## SECTION 4: RISK MITIGATION & CRISIS PLAN

### 4.1 Rate Limiting / API Key Failure
*   **Risk:** Groq API keys reach rate limits during live evaluation, or GitHub requests are blocked.
*   **Mitigation Strategy:** 
    *   Implement the mock fallback switch in `app.py`. If key loading fails or rate limits are reached, the application falls back to returning structured, pre-defined static mock payloads.
    *   Expose a "Mock Mode" checkbox on the sidebar, allowing developers or evaluators to test the frontend layouts immediately without calling live APIs.

---

### 4.2 Deployment Lag
*   **Risk:** Cloud hosting services (such as Streamlit Community Cloud) experience deployment delays close to the 5:00 PM deadline.
*   **Mitigation Strategy:**
    *   Prioritize local execution stability.
    *   Record the 3-minute video presentation showing the application running locally in a clean Python environment. This ensures you have a fallback submission showing the app in action even if cloud hosting runs into last-minute delays.

---

### 4.3 Handling Scanned PDF Uploads
*   **Risk:** The user uploads a scanned resume (image-only PDF), causing the parser to return empty text strings.
*   **Mitigation Strategy:**
    *   Add an empty text check right after PDF parsing. If the parsed string is empty or contains too few characters, display a helpful warning banner instead of attempting to send empty inputs to the LLM:
    ```python
    if len(extracted_text.strip()) < 50:
        st.warning(
            "⚠️ Scanned PDF Resume Detected.\n\n"
            "We were unable to read text from your PDF. Please upload a standard, text-based PDF resume "
            "to continue."
        )
    ```
