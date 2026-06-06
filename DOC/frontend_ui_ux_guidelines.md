# CareerLaunch AI: Frontend Layout & UI/UX Guidelines (Streamlit)
**Author:** Senior UI/UX Engineer  
**Target Audience:** Frontend Engineers, Streamlit Developers, Design Reviewers  
**Classification:** Interface Design & Frontend Guidelines

---

## SECTION 1: DESIGN SYSTEM, TYPOGRAPHY, & PALETTE

Streamlit applications run within a standardized layout wrapper. To achieve a custom, premium aesthetic without writing complex React components, we utilize Streamlit’s native styling variables along with custom CSS wrappers injected using `st.markdown(unsafe_allow_html=True)`.

```
┌────────────────────────────────────────────────────────┐
│                   DASHBOARD CANVAS                     │
│                                                        │
│   PRIMARY ACCENT         SUCCESS STATE       WARNING   │
│   ┌──────────────┐     ┌──────────────┐   ┌─────────┐  │
│   │  Indigo/Blue │     │  Emerald-Grn │   │ Crimson │  │
│   └──────────────┘     └──────────────┘   └─────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 1.1 Cohesive Palette Design (Light & Dark Theme Matching)
To ensure accessibility and design consistency, the interface uses a harmonious color palette that adapts to the host container's styling variables.

| Role | HEX (Dark Theme) | HEX (Light Theme) | Streamlit CSS Mapping | Application Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#0E1117` (Charcoal) | `#F8F9FA` (Off-white) | `theme.backgroundColor` | Main layout viewport. |
| **Card / Surface** | `#1A1C23` (Dark Gray) | `#FFFFFF` (Pure White) | `theme.secondaryBackgroundColor` | Input boxes, metric cards, expander backgrounds. |
| **Primary Accent** | `#4F46E5` (Indigo) | `#3B82F6` (Cobalt Blue) | `theme.primaryColor` | Buttons, step progress bars, highlighted metrics. |
| **Positive State** | `#10B981` (Emerald) | `#059669` (Dark Green) | Custom Badge Class | Matched skills list, high match scores (>= 75). |
| **Negative State** | `#EF4444` (Crimson) | `#DC2626` (Red) | Custom Alert Class | Identified skill gaps, low match scores (< 50). |

---

### 1.2 Typography Hierarchy
To avoid visual clutter, typography uses clean sans-serif typefaces (e.g., *Inter*, *Segoe UI*, or *Roboto*) and follows a clear hierarchy to guide the user's eye:
*   **Page Titles (H1):** `bold 24px` (using `st.title` or `st.header`). This establishes the primary focal point of the page.
*   **Subheaders / Section Anchors (H2):** `semibold 18px` (using `st.subheader`). Used to separate logic steps on the screen.
*   **Metrics / Scores:** `bold 32px` (using `st.metric`). Designed to draw immediate attention to the user's compatibility scores.
*   **Body Copy & Instructions:** `regular 14px` (using `st.write` or `st.markdown`). Left-aligned with comfortable line spacing (1.5) to maximize readability.

---

## SECTION 2: MULTI-TAB NAVIGATION & VIEW MANAGEMENT

### 2.1 State-Locking Tab Design
To enforce the application's step-by-step workflow, views are organized into three tabs. Tab access is gated using conditional state flags to prevent users from bypassing steps.

```
┌────────────────────────────────────────────────────────┐
│                       TAB ROADMAP                      │
│                                                        │
│  [ Tab 1: Profile ]  [ Tab 2: Analyzer ]  [ Tab 3: Mock ]│
│         │                    │                  │      │
│     Accessible           Locked if          Locked if  │
│      on Load             State < 2          State < 3  │
└────────────────────────────────────────────────────────┘
```

1.  **Tab 1: Profile Auditor (Active on Load):** Always accessible. The user uploads their resume and verifies their GitHub repository.
2.  **Tab 2: Skill Gap Analyzer (Locked):** Accessible only when `fsm_state >= 2`. If locked, clicking this tab displays a styled warning block:
    ```python
    st.warning("🔒 Section Locked: Please upload your resume and verify your GitHub URL in Tab 1 first.")
    ```
3.  **Tab 3: Mock Interview Coach (Locked):** Accessible only when `fsm_state >= 3`. If locked, clicking this tab displays a styled info block:
    ```python
    st.info("🔒 Arena Locked: Please paste a Job Description and analyze compatibility in Tab 2 to unlock your mock interview.")
    ```

---

### 2.2 Preserving State Across Reruns
Because Streamlit re-runs the entire Python script from top to bottom whenever a user interacts with a widget, we protect in-memory assets using execution guards in `st.session_state`. This prevents the application from losing uploaded files or redrawing expensive API results when users toggle between tabs:

```python
import streamlit as st

def init_session_state():
    """Initializes and guards state variables from script re-runs."""
    defaults = {
        "fsm_state": 0,
        "resume_text": "",
        "github_meta": None,
        "job_desc": "",
        "analysis_results": None,
        "interview_active": False,
        "interview_graded": False,
        "raw_pdf_buffer": None
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value
```

---

## SECTION 3: STEP-BY-STEP COMPONENT GRID MAP

### 3.1 Tab 1 Layout: Profile Ingestion
Designed as a dual-column workspace to separate resume uploading from Git code verification.

```
┌────────────────────────────────────────────────────────┐
│ Tab 1: Profile Ingestion                               │
├────────────────────────────┬───────────────────────────┤
│ Column 1 (Left)            │ Column 2 (Right)          │
│                            │                           │
│ st.file_uploader           │ st.text_input (GitHub)    │
│                            │                           │
│ Status:                    │ button ("Verify")         │
│ st.success("Parsed!")      │                           │
├────────────────────────────┴───────────────────────────┤
│ Bottom Row (Full Width Metrics - Appears on State 2)   │
│ st.metric("Git Health")      st.metric("Resume Score") │
└────────────────────────────────────────────────────────┘
```

*   **Grid Structure:** `left_col, right_col = st.columns([1, 1])`
*   **Left Column (Resume):**
    *   `st.file_uploader("Upload PDF Resume", type=["pdf"])`
    *   *Interaction:* When a PDF is detected, parse it and update `st.session_state.resume_text`. Show a success toast to indicate completion.
*   **Right Column (GitHub):**
    *   `st.text_input("Public GitHub Repository URL")`
    *   `st.button("Verify Repository Details")`
    *   *Interaction:* Triggers the GitHub API pipeline, returning repository stats and file structures to `st.session_state.github_meta` before advancing the state machine to State 2.
*   **Data Summary Cards:**
    *   Once FSM State reaches 2, render two columns displaying the parsed metrics side-by-side using `st.metric`.

---

### 3.2 Tab 2 Layout: Compatibility Matcher
Designed to let the user paste their target job description and view their match statistics immediately.

```
┌────────────────────────────────────────────────────────┐
│ Tab 2: Compatibility Matcher                           │
├────────────────────────────┬───────────────────────────┤
│ Column 1 (Left)            │ Column 2 (Right)          │
│                            │                           │
│ st.text_area               │ st.metric("Match Score")  │
│ (Job Description)          │                           │
│                            │ Custom HTML Badges        │
│ button ("Run Matcher")     │ (Matched vs Gaps)         │
└────────────────────────────────────────────────────────┘
```

*   **Grid Structure:** `input_col, dashboard_col = st.columns([2, 3])`
*   **Input Column (Left):**
    *   `st.text_area("Target Job Description", height=350)`
    *   `st.button("Analyze Compatibility")`
*   **Dashboard Column (Right):**
    *   Displays after API processing completes:
        *   `st.columns(2)` displaying the overall compatibility score and gap index metrics.
        *   **Skill Badges Panel:** Group matched skills in green HTML badges and missing skills in red HTML badges.
        *   `st.markdown("### Recommendation Summary")` containing structured steps to help the user bridge their skill gaps.

---

### 3.3 Tab 3 Layout: Interactive Interview Arena
Designed as a clean, focused viewport for simulated interview practice.

```
┌────────────────────────────────────────────────────────┐
│ Tab 3: Interactive Interview Arena                     │
├────────────────────────────────────────────────────────┤
│ st.info("Question: Explain your experience with Docker")│
│                                                        │
│ st.text_area("Your Response", height=200)              │
│                                                        │
│ button("Submit Answer")                                │
├────────────────────────────────────────────────────────┤
│ Expander Panel (Appears after Grading)                 │
│ st.expander("🔍 View AI Score & STAR Critique")        │
└────────────────────────────────────────────────────────┘
```

*   **Question Callout:**
    *   `st.info(body=current_question_text)`
*   **Answer Inputs:**
    *   `st.text_area("Your Answer", height=220, placeholder="Explain step-by-step how you solved this scenario...")`
    *   `st.button("Submit Answer for Grading")`
*   **Critique Panel:**
    *   `st.expander("🔍 View AI Score & STAR Critique")`
    *   Inside the expander, display the numerical score, a checklist of strengths, and an optimized version of the user's answer rewritten using the STAR (Situation, Task, Action, Result) method.

---

## SECTION 4: MICRO-INTERACTIONS & RECOVERY DESIGN

To build user trust and keep them engaged, the frontend uses helpful loading states, success toasts, and clean error messages.

### 4.1 Loading States & Feedback Cues
*   **Visual Indicators:** Every external network request is wrapped in an `st.spinner` callout to let the user know the application is actively processing their request:
    *   `with st.spinner("Extracting resume layout features..."):`
    *   `with st.spinner("Running compatibility match engine..."):`
*   **Success Toasts:** Once a step is successfully completed, the app triggers a toast notification to confirm the data was processed:
    *   `st.toast("✅ Profile analyzed! Tab 2 is now unlocked.", icon="🎉")`

---

### 4.2 Error Recovery & Inline Alerts
To prevent raw Python errors or exceptions from showing up on the UI, the application wraps all API integrations and parsing steps in `try/except` blocks. If an error occurs, the user is shown a clean, actionable warning banner instead of a traceback.

```
 Invalid File Type ──► Intercepted Exception ──► st.error Banner ──► Actions to Resolve
```

#### Code Pattern for Ingest Validation:
```python
import streamlit as st

def handle_pdf_ingestion_safely(file_buffer):
    """
    Safely processes an uploaded file, displaying clean inline alerts on failure.
    """
    if file_buffer is None:
        return
        
    # Check file type
    if not file_buffer.name.endswith(".pdf"):
        st.error("⚠️ Unsupported File Format")
        st.markdown(
            "Please upload your resume as a standard PDF file. "
            "Word documents (.docx) or image files are not supported."
        )
        return
        
    try:
        with st.spinner("Parsing resume PDF..."):
            # Call underlying parsing pipeline
            text = extract_and_sanitize_pdf(file_buffer)
            st.session_state.resume_text = text
            st.session_state.fsm_state = max(st.session_state.fsm_state, 1)
            st.success("Resume parsed successfully!")
            st.toast("📄 Resume loaded!", icon="✅")
    except Exception as e:
        st.error("⚠️ Parsing Failure")
        st.markdown(
            "We encountered an issue while reading your PDF. "
            "Please check that the file is not password-protected or corrupted."
        )
```
Using this pattern ensures that user errors (such as uploading the wrong file format or entering an incorrect repository URL) are handled with helpful, actionable suggestions rather than technical error logs.
