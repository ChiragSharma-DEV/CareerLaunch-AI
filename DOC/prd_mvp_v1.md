# Product Requirement Document (PRD): CareerLaunch AI (MVP v1.0)
**Author:** Principal Product Manager  
**Target Timeline:** 7-Hour Rapid Hackathon Deployment  
**Key Stakeholders:** Engineering Team, UX Designer, Hackathon Evaluators (Microsoft Engineers)  
**Status:** Draft (Ready for Tech Review)

---

## SECTION 1: DOCUMENT METADATA & VERSION CONTROL

| Field | Details | Notes |
| :--- | :--- | :--- |
| **Document Title** | CareerLaunch AI PRD (MVP v1.0) | Target specification for MVP release. |
| **Target Timeline** | 7-Hour Rapid Hackathon Deployment | Time-constrained development plan. |
| **Key Stakeholders** | Engineering Team, UX Designer, Hackathon Evaluators | Microsoft engineers evaluating project delivery. |
| **Document Status** | Draft (Ready for Tech Review) | Frozen for active implementation phase. |
| **Current Date** | Saturday, June 6, 2026 | Live Hackathon Day execution. |

---

## SECTION 2: EXECUTIVE SUMMARY & VALUE PROPOSITION

### 2.1 Project Vision
CareerLaunch AI is an **End-to-End Job Readiness Suite** designed to bridge the gap between academic preparation and industry expectations. 

Standard hackathon submissions in this domain are typically fragmented—either acting as isolated resume ATS parsers or generic chatbot interviewers. CareerLaunch AI unifies these components into a **connected data pipeline**. The data collected from the candidate's actual projects (GitHub) and historical experience (Resume) flows directly into the compatibility engine. The output of that match (the identified skill gaps) is then used to dynamically customize the mock interview simulator, creating a personalized preparation loop.

```
┌─────────────────┐       In-Memory        ┌─────────────────┐
│ Profile Auditor ├───────────────────────►│  Job Analyzer   │
│  (Resume & Git) │  Developer Context     │   (Gap List)    │
└─────────────────┘                        └────────┬────────┘
                                                    │
                                                    │ Injected Gaps
                                                    ▼
                                           ┌─────────────────┐
                                           │ Interview Coach │
                                           │  (STAR Mock)    │
                                           └─────────────────┘
```

---

### 2.2 Core Problem Statement
For students and freshers entering the job market, technical preparation is often fragmented:
1.  **Blind Spots:** Candidates do not know how their skills compare to the job description, often missing critical tool requirements (e.g., Docker, Redis).
2.  **Unverified Portfolios:** Standard resume screeners evaluate keywords but cannot verify if a candidate has actually written code using that stack.
3.  **Generic Interview Preparation:** Candidates practice using generic question banks instead of targeting their specific skill gaps, reducing the effectiveness of their preparation.

---

### 2.3 Unique Value Proposition (UVP)
*   **Data-Driven Customization:** Instead of manual setup, candidate profile data (Resume + GitHub) dynamically configures the downstream mock interview coach.
*   **Validated Skills Evaluation:** The GitHub analyzer parses directory structures and commit histories to verify the candidate's project claims.
*   **Actionable Gap Closure:** Identified skill gaps are mapped directly to study resources and targeted interview questions, providing a clear path to readiness.

---

## SECTION 3: TARGET USER PERSONAS

### 3.1 Persona Card: Rahul
*   **Demographics:** 21 years old, final-year Computer Science & Engineering student at a Tier-2 technical university.
*   **Goals:**
    *   Secure a Software Engineering (SWE) role at a high-growth tech company.
    *   Validate that his academic projects meet industry standards.
    *   Practice answering technical questions under pressure before real interviews.
*   **Pain Points:**
    *   His resume gets filtered out by automated ATS screeners.
    *   He has a public GitHub repository but doesn't know if his project structure or commit quality is up to par.
    *   Suffers from imposter syndrome and gets anxious during technical interviews.
*   **How CareerLaunch AI Solves Them:**
    *   **Module 1** evaluates his code repository structure and commit history, confirming his skills.
    *   **Module 2** maps his profile against target roles, identifying gaps (e.g., containerization or caching) and listing resources to learn them.
    *   **Module 3** generates mock questions targeting those specific gaps, helping him practice in a low-pressure environment.

---

## SECTION 4: SYSTEM FLOW & USER EXPERIENCE (STATE MACHINE)

To ensure a structured experience, CareerLaunch AI operates as a deterministic **Finite State Machine (FSM)**. The user cannot view downstream metrics or interact with advanced tabs until the prerequisite data validation passes.

```
┌──────────────┐      Upload Resume      ┌──────────────┐
│   STATE 0    ├────────────────────────►│   STATE 1    │
│  (Empty UI)  │      & Parse PDF        │ (Doc Loaded) │
└──────────────┘                         └──────┬───────┘
                                                │ Enter & Validate URL
                                                ▼
┌──────────────┐      LLM Synthesis      ┌──────────────┐
│   STATE 3    │◄────────────────────────┤   STATE 2    │
│  (Active)    │                         │(Data Bound)  │
└──────────────┘                         └──────────────┘
```

*   **State 0 (Landing State):** The application opens with Tab 1 active. Tab 2 and Tab 3 display placeholder warnings to guide the user to input their data first.
*   **State 1 (Profile Audited):** The user uploads their resume. The system extracts the text in memory, moving the application to State 1.
*   **State 2 (Data Bound):** The user inputs a valid public GitHub URL. The GitHub REST API scraper fetches the project data. Once verified, the application transitions to State 2, unlocking Tab 2.
*   **State 3 (Fit Analyzed):** The user pastes a job description and clicks "Analyze Compatibility." The LLM analyzes the inputs and returns a structured JSON of skill gaps. This transitions the app to State 3, unlocking the Tab 3 mock interview coach.
*   **State 4 (Interview Graded):** The user answers a mock interview question and submits it. The LLM evaluates the response and displays structured critique, completing the workflow.

---

## SECTION 5: DETAILED FUNCTIONAL REQUIREMENTS

### 5.1 Epic 1: Profile Auditor (Resume & GitHub)

#### Feature 1.1: PDF Resume Ingestion and Text Extraction
*   **Description:** The system must accept and parse PDF resumes.
*   **Acceptance Criteria:**
    *   *Given:* A user is on Tab 1 in State 0.
    *   *When:* They upload a valid, text-based PDF resume under 2MB.
    *   *Then:* The system parses the text in memory and transitions to State 1, displaying a success toast.

#### Feature 1.2: Public GitHub Repo REST API Integration
*   **Description:** The system must fetch repository data using the public GitHub API.
*   **Acceptance Criteria:**
    *   *Given:* The app is in State 1.
    *   *When:* The user enters a valid public GitHub URL and clicks "Verify Repository Details".
    *   *Then:* The system fetches the repo description, primary language, directory files, and commit logs, transitioning the app to State 2.

#### Feature 1.3: Portfolio Quality Scoring
*   **Description:** The system must run basic checks on the fetched repo data to measure code structure quality.
*   **Acceptance Criteria:**
    *   *Given:* The app is in State 2.
    *   *When:* The GitHub data parses successfully.
    *   *Then:* The system calculates a repo health score based on README presence, folder depth, and commit message formatting.

---

### 5.2 Epic 2: Job Fit & Skill Gap Analyzer

#### Feature 2.1: Job Description Input & Extraction
*   **Description:** The user can paste target job descriptions to map compatibility.
*   **Acceptance Criteria:**
    *   *Given:* The app is in State 2 (Tab 2 is unlocked).
    *   *When:* The user pastes a job description and clicks "Analyze Compatibility".
    *   *Then:* The system starts the analysis process and displays a loading spinner.

#### Feature 2.2: Gap Identification Prompt Engine
*   **Description:** Compare parsed resume and GitHub data with the job description using LLaMA-3-8b via Groq.
*   **Acceptance Criteria:**
    *   *Given:* The analysis is triggered.
    *   *When:* The LLM receives the input context.
    *   *Then:* It returns a structured JSON object containing the overall match score, matched skills, and identified gaps.

#### Feature 2.3: Overall Match Score Metric & Visual Roadmap
*   **Description:** Display matching and missing skills on the UI.
*   **Acceptance Criteria:**
    *   *Given:* The JSON gap analysis response is parsed successfully.
    *   *When:* The page refreshes.
    *   *Then:* The system displays metric cards for the match score, green badges for matched skills, red badges for gaps, and unlocks Tab 3.

---

### 5.3 Epic 3: Dynamic Mock Interview Coach

#### Feature 3.1: Tailored Question Generation
*   **Description:** Generate mock interview questions targeting the candidate's identified skill gaps.
*   **Acceptance Criteria:**
    *   *Given:* The app is in State 3 (Tab 3 is unlocked).
    *   *When:* The user opens Tab 3.
    *   *Then:* The system reads the gap list from session state, calls the LLM, and displays a question targeting one of the gaps inside a styled info callout.

#### Feature 3.2: Evaluation & Feedback Engine
*   **Description:** Evaluate the user's mock response and provide structured feedback.
*   **Acceptance Criteria:**
    *   *Given:* A mock question is active on the screen.
    *   *When:* The user types their answer and clicks "Submit Answer for Grading".
    *   *Then:* The system grades the response (1-10) and provides a list of strengths, gaps in the answer, and an optimized STAR rewrite.

#### Feature 3.3: Scorecard PDF Export
*   **Description:** Export the evaluation results as a downloadable PDF scorecard.
*   **Acceptance Criteria:**
    *   *Given:* The interview feedback has been generated.
    *   *When:* The user clicks "Download Exportable PDF Report".
    *   *Then:* The system generates a formatted PDF scorecard in memory using `fpdf2` and triggers a browser save dialog.

---

## SECTION 6: NON-FUNCTIONAL REQUIREMENTS (NFRs)

*   **Latency & Performance:** To ensure a responsive live demo, all LLM calls are routed to Groq LLaMA-3-8b, keeping average response times under 2 seconds.
*   **State Persistence:** All inputs and parsed states are saved in Streamlit's `st.session_state` to prevent data loss or layout resets when the user interacts with tabs or other inputs.
*   **Error Handling & Edge Cases:**
    *   *GitHub API Limit:* If the API key is missing or rate limits are reached, the app displays a clear warning and falls back to mock data.
    *   *Invalid Repo URLs:* If the repository URL is invalid, the app displays an inline warning with examples of correct formats.
    *   *Scanned PDFs:* If the resume parser extracts no text, the system displays an alert advising the user to upload a text-based PDF.
*   **Security & Privacy:** The application does not use external databases or write uploaded files to local disk storage. All data is processed in-memory and cleared when the user session ends.

---

## SECTION 7: MVP SCOPE & OUT OF SCOPE BOUNDARIES

To ensure the MVP is completed within the 7-hour hackathon limit, the following features are explicitly **out of scope**:
*   **Persistent Databases:** The application does not store historical profiles; all data runs in-memory.
*   **OAuth User Login:** The application does not require user registration or logins.
*   **Real-Time Audio Transcriptions:** Mock interview answers are submitted via text input, not audio streams.
*   **Multi-Repo Scanning:** The system scans a single repository per run to keep processing fast and simple.

---

## SECTION 8: SUCCESS CRITERIA & KPIs FOR EVALUATION

Microsoft evaluators should evaluate the application based on the following three criteria:
1.  **Technical Execution (40%):** Stable execution of the Streamlit state machine, clean error handling, and robust session state persistence without UI resets.
2.  **Depth of API Pipeline Integration (40%):** Seamless data flow where parsed PDF resumes and GitHub repository files directly customize downstream LLM prompts and interview questions.
3.  **Product Completeness (20%):** A complete job readiness loop showing candidate profile auditing, skill gap analysis, and mock interview practice.
