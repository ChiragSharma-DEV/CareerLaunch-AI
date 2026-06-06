# Requirements Document

## Introduction

CareerLaunch AI is an end-to-end job readiness suite built as a Streamlit-based MVP for a 7-hour hackathon. It unifies three distinct employability problem statements — resume and GitHub profile auditing, job fit and skill gap analysis, and dynamic mock interview coaching — into a single, state-managed pipeline. Data produced in each stage flows forward into the next, creating a personalized, connected preparation experience for final-year computer science students and early-career job seekers.

The system uses Groq's LLaMA-3-8b API for all AI inference, the GitHub REST API for portfolio analysis, PyPDF2/pdfplumber for resume parsing, and fpdf2 for downloadable PDF report generation. All processing is in-memory; no user data is persisted.

---

## Glossary

- **CareerLaunch_AI**: The overall Streamlit application encompassing all three modules.
- **Profile_Auditor**: Module 1 — responsible for resume parsing and GitHub profile analysis.
- **Skill_Gap_Analyzer**: Module 2 — responsible for job description parsing and gap identification.
- **Interview_Coach**: Module 3 — responsible for tailored question generation, answer evaluation, and report generation.
- **LLM_Engine**: The Groq API client using the LLaMA-3-8b model, used for all AI inference tasks.
- **Session_State**: Streamlit's `st.session_state` dictionary that persists data across tab interactions within a single browser session.
- **Candidate_Profile**: The structured data object assembled by the Profile_Auditor, containing extracted resume text, parsed skills, and GitHub repository metadata.
- **Gap_Report**: The structured JSON object produced by the Skill_Gap_Analyzer listing missing skills, matched skills, and an overall match score.
- **PDF_Parser**: The component using PyPDF2 or pdfplumber to extract text from uploaded resume PDF files.
- **GitHub_Client**: The component making authenticated or unauthenticated calls to the GitHub REST API.
- **Portfolio_Scorer**: The sub-component of the Profile_Auditor that scores GitHub repository quality.
- **Report_Generator**: The fpdf2-based component that produces the downloadable PDF interview feedback report.
- **ATS**: Applicant Tracking System — automated resume screening software used by employers.
- **JD**: Job Description — the text input provided by the user describing a target role.
- **Match_Score**: A 0–100 integer representing the percentage alignment between Candidate_Profile skills and JD requirements.
- **Tab_State**: The enabled/disabled status of each of the three tabs in the CareerLaunch_AI UI, controlled by Session_State flags.

---

## Requirements

### Requirement 1: Application State Machine & Tab Navigation

**User Story:** As Rahul, a final-year CS student, I want the application to guide me through a locked, sequential workflow so that I cannot skip ahead to interview prep before my profile has been analyzed.

#### Acceptance Criteria

1. THE CareerLaunch_AI SHALL render three tabs: "Profile Auditor", "Job Fit Analyzer", and "Mock Interview Coach".
2. WHEN CareerLaunch_AI is first loaded in a browser session, THE CareerLaunch_AI SHALL display Tab 1 ("Profile Auditor") as active and SHALL render Tab 2 and Tab 3 as disabled and non-interactive.
3. WHEN the Profile_Auditor completes a successful profile audit, THE CareerLaunch_AI SHALL store a `profile_complete` flag in Session_State and SHALL enable Tab 2 ("Job Fit Analyzer").
4. WHEN the Skill_Gap_Analyzer completes a successful gap analysis, THE CareerLaunch_AI SHALL store a `gap_analysis_complete` flag in Session_State and SHALL enable Tab 3 ("Mock Interview Coach").
5. IF a user attempts to navigate to Tab 2 and Session_State does not contain a `profile_complete` flag set to true, THEN THE CareerLaunch_AI SHALL keep Tab 2 disabled and SHALL display an instructional message directing the user to complete Tab 1 first.
6. IF a user attempts to navigate to Tab 3 and Session_State does not contain a `gap_analysis_complete` flag set to true, THEN THE CareerLaunch_AI SHALL keep Tab 3 disabled and SHALL display an instructional message directing the user to complete Tab 2 first.
7. THE CareerLaunch_AI SHALL preserve all Session_State data across tab switches within the same browser session without requiring re-upload or re-submission of any prior inputs.

---

### Requirement 2: PDF Resume Ingestion and Text Extraction

**User Story:** As Rahul, I want to upload my resume as a PDF so that the system can extract my skills and experience without me manually entering them.

#### Acceptance Criteria

1. THE Profile_Auditor SHALL provide a file upload widget that accepts files with the `.pdf` extension only.
2. WHEN a valid PDF file is uploaded, THE PDF_Parser SHALL extract all readable text from the PDF and SHALL store the extracted text in Session_State under the key `resume_text`.
3. WHEN text extraction succeeds and the extracted text contains at least 50 characters, THE Profile_Auditor SHALL display a confirmation message and a truncated preview of the first 300 characters of the extracted text.
4. IF the uploaded PDF file contains no extractable text (e.g., a scanned image PDF), THEN THE PDF_Parser SHALL display an error message stating "Could not extract text from this PDF. Please upload a text-based PDF." and SHALL NOT update Session_State.
5. IF the uploaded file exceeds 5 MB, THEN THE Profile_Auditor SHALL reject the file and SHALL display an error message stating the file size limit before the parse attempt.
6. WHEN a new PDF is uploaded in the same session, THE Profile_Auditor SHALL overwrite the previous `resume_text` in Session_State and SHALL reset the `profile_complete`, `gap_analysis_complete` flags to false, disabling Tab 2 and Tab 3.

---

### Requirement 3: GitHub Repository Data Fetching

**User Story:** As Rahul, I want the system to analyze my public GitHub profile so that it can assess my portfolio quality alongside my resume.

#### Acceptance Criteria

1. THE Profile_Auditor SHALL provide a text input field for the user to enter a GitHub username.
2. WHEN a GitHub username is submitted, THE GitHub_Client SHALL call the GitHub REST API endpoint `GET /users/{username}/repos` with a `per_page` parameter of 30 and SHALL retrieve the list of public repositories.
3. WHEN the GitHub REST API returns a successful response, THE GitHub_Client SHALL extract the following fields for each repository: `name`, `description`, `stargazers_count`, `forks_count`, `language`, `updated_at`, and `default_branch`.
4. WHEN repository data is fetched successfully, THE GitHub_Client SHALL call `GET /repos/{username}/{repo}/contents/` for each of the top 5 repositories sorted by `updated_at` descending, and SHALL retrieve the root directory file listing.
5. WHEN repository data is fetched successfully, THE GitHub_Client SHALL call `GET /repos/{username}/{repo}/commits?per_page=10` for each of the top 5 repositories and SHALL retrieve the 10 most recent commit messages.
6. WHEN all GitHub data has been retrieved, THE GitHub_Client SHALL store the aggregated repository metadata, directory listings, and commit messages in Session_State under the key `github_data`.
7. IF the GitHub REST API returns a 404 status code for a username, THEN THE GitHub_Client SHALL display the error message "GitHub user '{username}' not found. Please check the username." and SHALL NOT update Session_State.
8. IF the GitHub REST API returns a 403 status code indicating rate limit exhaustion, THEN THE GitHub_Client SHALL display the error message "GitHub API rate limit reached. Please wait 60 minutes or provide a GitHub Personal Access Token." and SHALL NOT update Session_State.
9. IF a repository within the top 5 has its contents or commits endpoint return a non-200 status, THEN THE GitHub_Client SHALL skip that repository's detailed fetch and SHALL log a warning in the UI, continuing to process the remaining repositories.
10. WHERE a GitHub Personal Access Token is provided by the user, THE GitHub_Client SHALL include the token as a Bearer authorization header in all API requests to increase the rate limit to 5,000 requests per hour.

---

### Requirement 4: Portfolio Quality Scoring

**User Story:** As Rahul, I want to receive a quality score for my GitHub portfolio so that I understand how a recruiter perceives my open-source presence.

#### Acceptance Criteria

1. WHEN `github_data` is present in Session_State, THE Portfolio_Scorer SHALL compute a Portfolio Quality Score as an integer between 0 and 100.
2. THE Portfolio_Scorer SHALL compute the README completeness sub-score by awarding 10 points if a file named `README.md` (case-insensitive) is present in the root directory of a repository, summed across the top 5 repositories and normalized to a 0–40 point contribution.
3. THE Portfolio_Scorer SHALL compute the commit quality sub-score by evaluating the ratio of commit messages exceeding 20 characters in length to total fetched commits, mapped to a 0–30 point contribution.
4. THE Portfolio_Scorer SHALL compute the language diversity sub-score by counting the number of distinct non-null `language` values across all fetched repositories, awarding 10 points per unique language up to a maximum 30-point contribution.
5. WHEN the Portfolio Quality Score is computed, THE Portfolio_Scorer SHALL display the total score, the three sub-scores, and a text interpretation label: "Needs Work" (0–39), "Developing" (40–69), or "Strong" (70–100).
6. WHEN the Portfolio Quality Score is computed, THE Portfolio_Scorer SHALL store the score and sub-scores in Session_State under the key `portfolio_score`.

---

### Requirement 5: Candidate Profile Assembly & Profile Completion

**User Story:** As Rahul, I want the system to combine my resume and GitHub data into a single candidate profile so that subsequent modules have a unified view of my skills.

#### Acceptance Criteria

1. WHEN both `resume_text` and `github_data` are present in Session_State, THE Profile_Auditor SHALL display an "Analyze Profile" button.
2. WHEN the "Analyze Profile" button is clicked, THE LLM_Engine SHALL receive a prompt containing the full `resume_text` and a summarized representation of `github_data`, and SHALL return a structured JSON object containing: a list of technical skills, a list of programming languages, a list of tools and frameworks, and a list of project names.
3. WHEN the LLM_Engine returns a valid JSON Candidate_Profile, THE Profile_Auditor SHALL store it in Session_State under the key `candidate_profile` and SHALL set the `profile_complete` flag to true.
4. WHEN `profile_complete` is set to true, THE Profile_Auditor SHALL display a summary card showing the extracted skills count, languages count, and tools count from the Candidate_Profile.
5. IF the LLM_Engine call fails or returns a response that cannot be parsed as valid JSON, THEN THE Profile_Auditor SHALL display an error message "Profile analysis failed. Please try again." and SHALL NOT set the `profile_complete` flag.
6. WHEN the LLM_Engine call is in progress, THE Profile_Auditor SHALL display a spinner with the message "Analyzing your profile with AI…" to communicate processing status.

---

### Requirement 6: Job Description Input and Extraction

**User Story:** As Rahul, I want to paste a job description into the system so that it can identify what the employer is specifically looking for.

#### Acceptance Criteria

1. THE Skill_Gap_Analyzer SHALL provide a multi-line text area input for the user to paste a job description.
2. WHEN the user submits a job description containing at least 100 characters, THE Skill_Gap_Analyzer SHALL store the raw JD text in Session_State under the key `job_description` and SHALL enable the gap analysis trigger.
3. IF the submitted job description contains fewer than 100 characters, THEN THE Skill_Gap_Analyzer SHALL display an inline validation error "Job description is too short. Please paste the full job description." and SHALL NOT store the text or enable gap analysis.
4. WHEN a new job description is submitted in a session that already has a completed gap analysis, THE Skill_Gap_Analyzer SHALL reset the `gap_analysis_complete` flag to false and SHALL clear the previous `gap_report` and Interview_Coach session data, disabling Tab 3.

---

### Requirement 7: Skill Gap Identification

**User Story:** As Rahul, I want to see a detailed breakdown of which skills I have, which I'm missing, and how well I match the job so that I can understand my readiness for a specific role.

#### Acceptance Criteria

1. WHEN the "Analyze Fit" button is clicked and both `candidate_profile` and `job_description` are present in Session_State, THE LLM_Engine SHALL receive a prompt containing the Candidate_Profile JSON and the JD text, and SHALL return a structured JSON Gap_Report.
2. THE Gap_Report JSON produced by the LLM_Engine SHALL contain exactly the following top-level keys: `matched_skills` (array of strings), `missing_skills` (array of strings), `match_score` (integer 0–100), and `recommendation_summary` (string).
3. WHEN a valid Gap_Report is returned, THE Skill_Gap_Analyzer SHALL store it in Session_State under the key `gap_report` and SHALL set the `gap_analysis_complete` flag to true.
4. WHEN `gap_analysis_complete` is set to true, THE Skill_Gap_Analyzer SHALL display the `matched_skills` list with a green visual indicator and the `missing_skills` list with a red visual indicator.
5. WHEN `gap_analysis_complete` is set to true, THE Skill_Gap_Analyzer SHALL display the `match_score` as a numeric percentage and as a progress bar visual element.
6. WHEN `gap_analysis_complete` is set to true, THE Skill_Gap_Analyzer SHALL display the `recommendation_summary` text in a highlighted info box.
7. IF the LLM_Engine call fails or the response cannot be parsed as a valid Gap_Report JSON, THEN THE Skill_Gap_Analyzer SHALL display "Gap analysis failed. Please try again." and SHALL NOT set the `gap_analysis_complete` flag.
8. WHEN the LLM_Engine call is in progress, THE Skill_Gap_Analyzer SHALL display a spinner with the message "Identifying skill gaps…" to communicate processing status.

---

### Requirement 8: Match Score Visualization and Roadmap

**User Story:** As Rahul, I want to see a visual summary of my match score and a learning roadmap so that I understand not just my gaps but also what to do about them.

#### Acceptance Criteria

1. WHEN a Gap_Report with a `match_score` between 0 and 39 is stored in Session_State, THE Skill_Gap_Analyzer SHALL display the score in red with the label "Low Match".
2. WHEN a Gap_Report with a `match_score` between 40 and 69 is stored in Session_State, THE Skill_Gap_Analyzer SHALL display the score in yellow with the label "Moderate Match".
3. WHEN a Gap_Report with a `match_score` between 70 and 100 is stored in Session_State, THE Skill_Gap_Analyzer SHALL display the score in green with the label "Strong Match".
4. WHEN the Gap_Report contains at least one entry in `missing_skills`, THE Skill_Gap_Analyzer SHALL display each missing skill as a visual chip or badge element, each accompanied by a static resource link to a publicly accessible free learning resource for that skill category.

---

### Requirement 9: Tailored Interview Question Generation

**User Story:** As Rahul, I want to be asked interview questions that specifically target my identified skill gaps so that my practice time is focused on my actual weaknesses.

#### Acceptance Criteria

1. WHEN Tab 3 is first activated after `gap_analysis_complete` is true, THE Interview_Coach SHALL automatically retrieve `missing_skills` from Session_State.
2. WHEN `missing_skills` contains at least one entry, THE Interview_Coach SHALL display a "Generate Questions" button.
3. WHEN the "Generate Questions" button is clicked, THE LLM_Engine SHALL receive a prompt containing the `missing_skills` list and SHALL return a structured JSON array of exactly 5 interview questions, each with the fields: `question_id` (integer 1–5), `skill_targeted` (string from `missing_skills`), `question_text` (string), and `difficulty` (string: "Easy", "Medium", or "Hard").
4. WHEN the generated question set is returned, THE Interview_Coach SHALL store it in Session_State under the key `interview_questions` and SHALL render each question in a sequentially numbered, collapsible or individually displayed panel.
5. IF `missing_skills` is an empty array, THEN THE Interview_Coach SHALL display the message "Great news — no skill gaps were identified! Here are 5 general software engineering interview questions." and SHALL generate 5 general questions using the same JSON structure without a specific `skill_targeted` value.
6. IF the LLM_Engine fails to return a parseable 5-element JSON array for question generation, THEN THE Interview_Coach SHALL display "Question generation failed. Please try again." and SHALL NOT update Session_State.

---

### Requirement 10: Answer Submission and Evaluation

**User Story:** As Rahul, I want to type my answers to each interview question and receive immediate, detailed feedback so that I know what I did well and where I fell short.

#### Acceptance Criteria

1. THE Interview_Coach SHALL render a text area input beneath each displayed interview question for the user to type their answer.
2. WHEN the user submits an answer containing at least 20 characters for a given question, THE LLM_Engine SHALL receive a prompt containing the `question_text`, the `skill_targeted`, and the user's answer, and SHALL return a structured JSON evaluation object with the fields: `score` (integer 1–10), `strengths` (array of strings), `weaknesses` (array of strings), and `ideal_answer_summary` (string).
3. WHEN a valid evaluation object is returned, THE Interview_Coach SHALL display the `score` as a numeric label and a visual score indicator, and SHALL render the `strengths` list with a positive indicator and the `weaknesses` list with a constructive indicator.
4. WHEN a valid evaluation object is returned, THE Interview_Coach SHALL display the `ideal_answer_summary` in a collapsible "Model Answer" section.
5. IF the user submits an answer containing fewer than 20 characters, THEN THE Interview_Coach SHALL display an inline validation message "Please provide a more detailed answer (at least 20 characters)." and SHALL NOT trigger an LLM_Engine evaluation call.
6. WHEN all 5 questions have received evaluated answers, THE Interview_Coach SHALL display a "Generate Report" button.
7. WHEN an LLM_Engine evaluation call is in progress, THE Interview_Coach SHALL display a spinner beneath the corresponding question with the message "Evaluating your answer…".
8. IF an LLM_Engine evaluation call fails, THEN THE Interview_Coach SHALL display "Evaluation failed for this question. Please try again." inline beneath the affected question and SHALL allow the user to resubmit.

---

### Requirement 11: Downloadable PDF Feedback Report

**User Story:** As Rahul, I want to download a complete PDF report of my interview session so that I can review it offline and track my improvement over time.

#### Acceptance Criteria

1. WHEN the "Generate Report" button is clicked and all 5 evaluation objects are present in Session_State, THE Report_Generator SHALL compile a PDF document using fpdf2.
2. THE Report_Generator SHALL include the following sections in the PDF: a title page with "CareerLaunch AI — Interview Feedback Report" and the session date, a Candidate Profile Summary section listing extracted skills and Match_Score, a Skill Gap Summary section listing `matched_skills` and `missing_skills`, and an Interview Results section containing each question, the user's answer, the score, strengths, weaknesses, and ideal answer summary.
3. WHEN PDF generation is complete, THE Report_Generator SHALL provide a Streamlit download button that triggers a browser download of the PDF file named `CareerLaunch_AI_Report_{YYYY-MM-DD}.pdf`.
4. THE Report_Generator SHALL generate the PDF entirely in memory using an in-memory byte buffer and SHALL NOT write any file to disk.
5. IF PDF generation fails due to a library error, THEN THE Report_Generator SHALL display "Report generation failed. Please try again." and SHALL NOT present a download button.

---

### Requirement 12: LLM Latency and Performance

**User Story:** As Rahul, I want AI-powered responses to return quickly so that the application feels responsive and does not frustrate me during time-sensitive hackathon evaluation.

#### Acceptance Criteria

1. WHEN any single LLM_Engine API call is made to the Groq API, THE LLM_Engine SHALL receive a complete response within 5 seconds under normal network conditions for prompts under 2,000 tokens.
2. THE LLM_Engine SHALL use the model identifier `llama3-8b-8192` for all Groq API requests.
3. WHEN constructing prompts, THE LLM_Engine SHALL include explicit JSON output format instructions in the system prompt, specifying the exact expected keys and value types, to minimize token usage and reduce response parsing failures.
4. IF a Groq API call does not receive a response within 10 seconds, THEN THE LLM_Engine SHALL terminate the request and SHALL display a timeout error message to the user.

---

### Requirement 13: Session State Persistence and Data Isolation

**User Story:** As Rahul, I want my data to remain available as I move between tabs so that I never have to re-upload or re-enter information I have already provided.

#### Acceptance Criteria

1. THE CareerLaunch_AI SHALL use `st.session_state` as the sole mechanism for persisting data between tab interactions within a single browser session.
2. THE CareerLaunch_AI SHALL define and initialize the following Session_State keys at application startup with null or false default values: `resume_text`, `github_data`, `candidate_profile`, `portfolio_score`, `job_description`, `gap_report`, `interview_questions`, `profile_complete`, `gap_analysis_complete`.
3. WHEN the user refreshes the browser page, THE CareerLaunch_AI SHALL reset all Session_State to default values, requiring the user to restart the workflow from Tab 1.
4. THE CareerLaunch_AI SHALL NOT store any session data in external databases, files on disk, cookies, or browser local storage.

---

### Requirement 14: Privacy and In-Memory Processing

**User Story:** As Rahul, I want to be assured that my resume and personal data are not stored anywhere so that I can use the tool without privacy concerns.

#### Acceptance Criteria

1. THE CareerLaunch_AI SHALL process all uploaded resume content exclusively in memory and SHALL NOT write resume content to any file system path.
2. THE CareerLaunch_AI SHALL NOT log, transmit, or cache any personally identifiable information from the resume to any service other than the Groq API for the purpose of the current analysis call.
3. THE CareerLaunch_AI SHALL transmit resume content to the Groq API only over HTTPS.
4. THE CareerLaunch_AI SHALL display a one-line privacy notice on the upload widget stating "Your resume is processed in-memory only and is never stored."

---

### Requirement 15: GitHub API Error Handling and Edge Cases

**User Story:** As Rahul, I want the system to handle GitHub API failures gracefully so that a temporary API issue does not block me from completing my profile.

#### Acceptance Criteria

1. IF the GitHub REST API returns a 404 response for a `/repos/{username}/{repo}/contents/` request, THEN THE GitHub_Client SHALL treat that repository as having no README and SHALL assign it a README sub-score of 0 for the Portfolio_Scorer computation.
2. IF the GitHub user has zero public repositories, THEN THE GitHub_Client SHALL display the message "No public repositories found for this user." and SHALL store an empty array in Session_State under `github_data`, still allowing the Profile_Auditor to proceed using resume data alone.
3. IF a GitHub repository's `language` field is null, THEN THE Portfolio_Scorer SHALL exclude that repository from the language diversity sub-score calculation without raising an error.
4. WHEN the GitHub_Client encounters a network timeout after 8 seconds on any individual API request, THE GitHub_Client SHALL retry the request once and, IF the retry also times out, SHALL skip that specific request and continue processing remaining repositories.

---

### Requirement 16: Resume Edge Case Handling

**User Story:** As Rahul, I want the system to clearly inform me if my resume cannot be parsed so that I can take corrective action quickly.

#### Acceptance Criteria

1. IF the uploaded PDF is password-protected, THEN THE PDF_Parser SHALL detect the encryption and SHALL display "This PDF is password-protected. Please upload an unlocked PDF." without attempting text extraction.
2. IF the PDF_Parser extracts text that contains fewer than 50 characters, THEN THE Profile_Auditor SHALL display "Insufficient content extracted from resume. The PDF may be image-based. Please upload a text-based PDF." and SHALL NOT proceed to profile assembly.
3. WHEN the PDF_Parser encounters a parsing exception from the underlying library, THE PDF_Parser SHALL catch the exception and SHALL display "An error occurred while reading the PDF. Please try a different file." without exposing the raw exception message to the user.

---

### Requirement 17: MVP Scope Boundaries

**User Story:** As a hackathon evaluator, I want a clearly defined scope boundary so that I can assess the depth of the MVP against its stated goals without confusion about what is and is not included.

#### Acceptance Criteria

1. THE CareerLaunch_AI SHALL NOT implement persistent user accounts, login flows, or OAuth authentication of any kind in the MVP.
2. THE CareerLaunch_AI SHALL NOT implement persistent database storage (SQL, NoSQL, or vector databases) in the MVP.
3. THE CareerLaunch_AI SHALL NOT implement real-time voice or audio transcription for interview answer submission in the MVP.
4. THE CareerLaunch_AI SHALL NOT implement analysis of more than 30 public repositories per GitHub user in the MVP.
5. THE CareerLaunch_AI SHALL NOT implement multi-user concurrent session management or user-specific session isolation beyond Streamlit's default per-browser-tab session handling in the MVP.
6. THE CareerLaunch_AI SHALL NOT implement resume file formats other than PDF in the MVP.
