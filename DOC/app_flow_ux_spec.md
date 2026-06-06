# CareerLaunch AI: App Flow & User Journey Specification
**Author:** Lead Interaction Designer & UI/UX Director  
**Target Audience:** Enterprise Engineering Judges, Frontend Engineers, Product Managers  
**Classification:** UX/UI Design & Interaction Specification

---

## SECTION 1: USER PERSONA CONTEXT & EMOTIONAL MAP

### 1.1 Target Persona: Rahul
*   **Age:** 21
*   **Role:** Final-year Computer Science & Engineering student at a Tier-2 technical university.
*   **Goal:** Secure a Software Engineering (SWE) role at a high-growth tech company.
*   **Core Psychographics:** 
    *   *High Anxiety:* Suffers from imposter syndrome. He sees complex job descriptions requiring "3+ years of experience" and feels underqualified.
    *   *Skepticism:* Tired of generic "AI resume writers" that simply insert keywords. He wants concrete proof that his projects are technically sound.
    *   *Validation-Seeking:* Needs a realistic evaluation of his capabilities mapped directly to actual code contributions, along with targeted training to build confidence.

---

### 1.2 Emotional Journey Map

```
  Ingestion Phase (Anxious/Skeptical)
           │
           ▼
  Audit Phase (Relieved/Aware)
           │
           ▼
  Gap Analysis Phase (Determined/Informed)
           │
           ▼
  Practice Phase (Confident/Prepared)
```

| Dimension | Phase 1: Ingestion | Phase 2: Audit | Phase 3: Gap Analysis | Phase 4: Practice |
| :--- | :--- | :--- | :--- | :--- |
| **User State** | **Anxious / Skeptical** | **Relieved / Aware** | **Determined / Informed** | **Confident / Prepared** |
| **Thoughts** | *"Will this tool just waste my time? My resume feels empty. I hope my GitHub commits are enough."* | *"Wow, it actually parsed my real code. It recognizes that I wrote the API handlers myself!"* | *"I see exactly what is missing for this Backend Developer role. The path to fix it is clear."* | *"That mock interview feedback was tough but fair. I feel ready to answer this in the real interview."* |
| **Actions** | Drag-and-drops PDF resume; enters public GitHub repo URL. | Reviews parsed file structure, metadata, and commit logs mapped side-by-side. | Inputs target job description; views matched vs. missing skills dashboard. | Selects generated question; types mock answer; reviews targeted feedback. |
| **Touchpoints** | Clean, minimalist dual-column drop zone with immediate validation feedback. | Component cards detailing repo stats and commit history. | Dynamic skill badges (emerald/rose) and match score metrics. | Interactive text arena with structured grading expanders. |
| **UX Goals** | Minimize friction; establish trust through micro-copy; prevent input errors. | Demonstrate transparency; validate and display data accurately. | Present gap analysis constructively without causing despair. | Provide actionable, safe training space with constructive feedback loops. |

---

## SECTION 2: THE STATE MACHINE MODEL (STATE GRAPH)

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

### 2.1 State Definitions
*   **State 0: Uninitialized state.** The application is empty. Only Tab 1 (Resume & Project Ingestion) is accessible. The system is waiting for both a resume upload and a valid GitHub URL.
*   **State 1: Document Loaded state.** The candidate’s resume has been parsed and normalized in memory. The system is waiting for a validated GitHub repository context.
*   **State 2: Data Bound state.** The resume has been parsed, and the GitHub repository data has been successfully retrieved via the GitHub API. Tab 2 (Job Matching) is unlocked.
*   **State 3: Fully Active state.** The user has input a target Job Description, and the system has executed the AI Orchestration layer. Tab 2 and Tab 3 (Practice Arena) are fully unlocked, displaying personalized metrics and mock interview questions.

### 2.2 State Locking & Tab Navigation Logic
Streamlit renders navigation tabs sequentially. Because Streamlit does not natively support disabling individual tabs programmatically, we enforce state locking through a logical gate combined with clear visual blocks:

1.  **Visual Lock Indicators:** If the user attempts to click on Tab 2 or Tab 3 while in **State 0** or **State 1**, the view renders an info box stating the prerequisites.
2.  **Prerequisite Check:**
    ```python
    import streamlit as st

    # Initialize FSM State in Session State if not present
    if "fsm_state" not in st.session_state:
        st.session_state.fsm_state = 0 # Ranges from 0 to 3
    ```

3.  **Dynamic Rendering Gating Pattern:**
    *   **Tab 1 (Ingestion):** Always fully accessible.
    *   **Tab 2 (Job Matching & Analysis):**
        *   *If `st.session_state.fsm_state < 2`:* Render a styled warning block:
            `st.warning("🔒 Section Locked: Please upload a valid resume and verify your GitHub Repository under Tab 1 to unlock Job Matching.")`
        *   *Else:* Render the interactive Job Match inputs and metrics dashboard.
    *   **Tab 3 (Interactive Practice Arena):**
        *   *If `st.session_state.fsm_state < 3`:* Render a styled info block:
            `st.info("🔒 Arena Locked: Please paste a Job Description and run the Compatibility Matcher under Tab 2 to activate your custom interview questions.")`
        *   *Else:* Render the interactive practice questions and feedback arena.

---

## SECTION 3: STEP-BY-STEP UI LAYOUT & WIREFRAME CONCEPTS

### 3.1 Tab 1: Resume & Project Ingestion (State 0 ──► State 2)
The landing layout focuses on minimizing cognitive load. It uses a balanced two-column grid structure.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TAB BAR                                   │
│    [ Tab 1: Ingestion ]    [ Tab 2: Matcher (Locked) ]  [ Tab 3 (Locked) ]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │     COLUMN 1: RESUME          │   │      COLUMN 2: PROJECTS       │ │
│  │                               │   │                               │ │
│  │  ┌─────────────────────────┐  │   │  Enter Public GitHub URL:     │ │
│  │  │   Drag & Drop PDF       │  │   │  [ github.com/user/repo     ] │ │
│  │  └─────────────────────────┘  │   │                               │ │
│  │  Status: ✅ Ready             │   │  [ Verify Repository Details ]│ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                 METRIC SUMMARY (Appears on State 2)               │ │
│  │   [ Repo: My-App ]   [ Commits: 32 ]   [ Language: JavaScript ]   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Wireframe Breakdown & Streamlit Components:
*   **Header:** Standardized UI title and a clear subtitle detailing the application's capabilities.
*   **Column 1 (Left):**
    *   `st.file_uploader("Upload PDF Resume", type=["pdf"])`: Styled with custom instructions (Max file size 2MB).
    *   *Dynamic Indicator:* A green success toast appears once the file is parsed, shifting the state to State 1.
*   **Column 2 (Right):**
    *   `st.text_input("Public GitHub Repository URL", placeholder="https://github.com/username/project")`.
    *   `st.button("Verify Repository Details")`: Triggers the API validation engine.
*   **Post-Validation Status Container (Full-Width Row):**
    *   Renders once `st.session_state.fsm_state == 2`.
    *   Uses three `st.metric` cards mapping: **Primary Tech Stack**, **Commit Count (Last 30 Commits)**, and **Repository Health Score**.

---

### 3.2 Tab 2: Target Compatibility Matcher (State 2 ──► State 3)
Unlocked at FSM State 2. The page uses a split layout: left column for inputs, right column for the compatibility dashboard.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TAB BAR                                   │
│    [ Tab 1: Ingestion ]    [ Tab 2: Matcher ]           [ Tab 3 (Locked) ]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │   COLUMN 1: TARGET JOB        │   │   COLUMN 2: MATCH METRICS     │ │
│  │                               │   │                               │ │
│  │  Paste Job Description:       │   │  ┌───────────────┬──────────┐ │
│  │  ┌─────────────────────────┐  │   │  │  Match Score  │ Gap Index│ │
│  │  │                         │  │   │  │     84%       │  Medium  │ │
│  │  └─────────────────────────┘  │   │  └───────────────┴──────────┘ │
│  │                               │   │                               │ │
│  │  [ Analyze Compatibility ]    │   │  Matched: [Python] [FastAPI]  │ │
│  │                               │   │  Gaps:    [Docker] [Redis]    │ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Wireframe Breakdown & Streamlit Components:
*   **Left Column (Input Gate):**
    *   `st.text_area("Paste Target Job Description", height=300, placeholder="We are looking for a Software Engineer with experience in...")`
    *   `st.button("Analyze Compatibility")`: Runs the prompt builder and triggers the Groq connection under a loading spinner.
*   **Right Column (Visual Analytics Dashboard):**
    *   Displays after analytical response is parsed:
        *   `st.columns(2)` displaying Match Score (represented as a dynamic radial or percentage card) alongside the overall Gap Severity metric.
        *   **Skill Badges Container:** Custom CSS-wrapped buttons/labels styling matched skills in emerald green (`background-color: #e6fdf5; color: #047857`) and missing/gap skills in warning rose (`background-color: #fdf2f2; color: #b91c1c`).
        *   `st.markdown()` showing a clear breakdown of recommendations to bridge the identified gaps.

---

### 3.3 Tab 3: Interactive Practice Arena (State 3)
Unlocked at FSM State 3. Designed as a distraction-free mock interview room.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TAB BAR                                   │
│    [ Tab 1: Ingestion ]    [ Tab 2: Matcher ]           [ Tab 3: Arena ]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  INTERVIEW QUESTION (Based on missing skill: Docker)              │ │
│  │  "Describe how you would containerize your Python application..." │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  Your Response:                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┐ │
│                                                                        │
│  [ Submit Answer for AI Grading ]                                      │
│                                                                        │
│  ▼ DETAILED CRITIQUE (st.expander)                                     │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Score: 7.5/10                                                    │ │
│  │  Strengths: Mentioned multi-stage builds.                          │ │
│  │  Refinements: Need to explain volume mounting for local dev.       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Wireframe Breakdown & Streamlit Components:
*   **Question Billboard:**
    *   `st.info(body=question_text)` displaying the target behavioral or technical question.
*   **Response Area:**
    *   `st.text_area("Your Response", height=200, placeholder="Explain step-by-step how you would solve this scenario...")`
    *   `st.button("Submit Answer for AI Grading")`
*   **Interactive Feedback Panel:**
    *   `st.expander("🔍 View Detailed AI Feedback & Grading Breakdown")`: Hidden by default to keep the interface clean.
    *   Inside the expander: Displays a calculated Score, Strengths checklist, and suggested Refinements to prepare for the real interview.

---

## SECTION 4: MICRO-INTERACTIONS & FEEDBACK LOOPS

To deliver a premium interface, the application uses real-time feedback loops to guide the user.

### 4.1 Loading States & API Latency Management
Network boundaries can introduce latency. The system manages this with three distinct feedback cues:
1.  **Context-Specific Spinners:** Rather than a generic loading indicator, the spinner displays messages indicating the specific task running in the background:
    *   `with st.spinner("Extracting & sanitizing document structures..."):`
    *   `with st.spinner("Fetching developer metrics from GitHub API..."):`
    *   `with st.spinner("Analyzing compatibility profile via LLaMA-3..."):`
2.  **State-Saving Toast Notifications:** On successful state transition, the user receives an unobtrusive confirmation popup:
    *   `st.toast("✅ Resume processed successfully!", icon="📄")`
    *   `st.toast("✅ Repository credentials verified!", icon="💻")`

---

### 4.2 Progress Visualization
To show progress and motivate the user, a persistent header element tracks progress through the evaluation cycle:
*   The progress value updates dynamically based on the FSM State:
    *   *State 0 & 1:* Progress = 25% (Awaiting setup)
    *   *State 2:* Progress = 50% (Data collected)
    *   *State 3:* Progress = 75% (Analysis complete)
    *   *Interview Submitted:* Progress = 100% (Ready to apply)
*   **Implementation:** `st.progress(st.session_state.fsm_state * 25 + 25)`

---

### 4.3 Actionable Error Recovery Flow
The application uses clear inline validation warnings instead of throwing generic Python stack traces, keeping the user in control when input errors occur.

```
 Invalid URL ──► Caught Exception ──► Inline Alert ──► Valid Code Example
```

#### The GitHub Verification Validation Pattern:
```python
import streamlit as st
import re

def validate_github_input(url_input: str):
    """
    Validates user URL input, providing clean instructions on failure.
    """
    # Normalize input
    cleaned_url = url_input.strip()
    
    # Empty input guard
    if not cleaned_url:
        st.warning("Please enter your GitHub repository URL to proceed.")
        return None
        
    # Standard GitHub Repository regex matching
    pattern = r"^(https?://)?(www\.)?github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/?$"
    match = re.match(pattern, cleaned_url)
    
    if not match:
        st.error("⚠️ Invalid Repository Format detected.")
        st.markdown(
            "**Please verify that the URL follows one of these formats:**\n"
            "*   `https://github.com/username/repository-name`\n"
            "*   `github.com/username/repository-name`"
        )
        return None
        
    owner = match.group(3)
    repo = match.group(4)
    return owner, repo
```
This pattern prevents raw exceptions from appearing on the UI, and provides the user with clear instructions and examples of valid inputs.
