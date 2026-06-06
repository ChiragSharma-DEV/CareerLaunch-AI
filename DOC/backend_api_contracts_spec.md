# CareerLaunch AI: Backend Folder Structure & API Contracts Specification
**Author:** Lead Backend Engineer  
**Target Audience:** Backend Developers, Integrators, Evaluators  
**Classification:** Backend Architecture & API Contract Specification

---

## SECTION 1: GRANULAR FOLDER STRUCTURE DIRECTORY TREE

To maintain modularity and keep the codebase clean during the 7-hour development timeline, CareerLaunch AI follows a modular project structure that separates business logic from frontend layout components.

```
careerlaunch_ai/
├── .streamlit/
│   └── secrets.toml
├── assets/
│   └── design_architecture.png
├── modules/
│   ├── __init__.py
│   ├── pdf_parser.py
│   ├── github_scraper.py
│   ├── llm_client.py
│   └── report_generator.py
├── app.py
├── requirements.txt
└── README.md
```

### 1.1 Directory & File Roles and Responsibilities
*   **`careerlaunch_ai/`:** The project root containing main execution scripts and dependency files.
*   **`.streamlit/`:** Stores Streamlit-specific configuration profiles.
    *   `secrets.toml`: Stores sensitive environment keys (e.g., Groq API key, GitHub PAT) to keep them secure and isolated from git.
*   **`assets/`:** Stores static files, such as architecture diagrams, to display in the README or the application's help screens.
*   **`modules/`:** The core business logic directory. Each file operates as a standalone module.
    *   `__init__.py`: Marks the directory as a Python package, allowing simple imports in the main script (e.g., `from modules.pdf_parser import ResumeParser`).
    *   `pdf_parser.py`: Contains the PDF extraction and text normalization engine.
    *   `github_scraper.py`: Contains the GitHub REST API client, URL parsing regex patterns, and rate-limit managers.
    *   `llm_client.py`: Orchestrates connections to LLM providers (e.g., Groq LLaMA-3), manages prompt structures, and handles JSON parsing.
    *   `report_generator.py`: Generates the PDF scorecard report.
*   **`app.py`:** The main entry point for the Streamlit application. It handles routing, UI rendering, session state management, and coordinates the modular backend engines.
*   **`requirements.txt`:** Lists all project dependencies with strict version pinning to ensure stable, repeatable builds.
*   **`README.md`:** Project documentation explaining setup, deployment instructions, and how the system works.

---

## SECTION 2: PYTHON INTERFACE DEFINITIONS & METHOD SIGNATURES

The following code stubs define the core API interfaces for each module, complete with type hints and documentation.

### 2.1 `modules/pdf_parser.py`
```python
from typing import Any
import io
import re
from pypdf import PdfReader

class ResumeParser:
    """
    Handles parsing and sanitizing text content from uploaded PDF resumes.
    """
    
    def __init__(self) -> None:
        pass
        
    def extract_text_from_pdf(self, uploaded_file: Any) -> str:
        """
        Extracts raw text from an uploaded file buffer, sanitizes whitespace, 
        and returns a normalized string.
        
        Args:
            uploaded_file (Any): The file-like object returned by st.file_uploader.
            
        Returns:
            str: The sanitized and normalized text extracted from the PDF.
        """
        if uploaded_file is None:
            return ""
            
        pdf_stream = io.BytesIO(uploaded_file.getvalue())
        reader = PdfReader(pdf_stream)
        raw_pages = []
        
        for page in reader.pages:
            text = page.extract_text()
            if text:
                raw_pages.append(text)
                
        full_text = "\n".join(raw_pages)
        
        # Strip non-printable ASCII and consolidate whitespaces
        sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', full_text)
        sanitized = re.sub(r'\s+', ' ', sanitized)
        sanitized = re.sub(r'(\r?\n)+', '\n', sanitized)
        
        return sanitized.strip()
```

### 2.2 `modules/github_scraper.py`
```python
from typing import Dict, Tuple, Optional
import re
import httpx

class GitHubScraper:
    """
    Handles connection validation and data gathering from public GitHub repositories.
    """
    
    def __init__(self, api_token: Optional[str] = None) -> None:
        self.api_token = api_token
        self.headers = {"Accept": "application/vnd.github+json"}
        if api_token:
            self.headers["Authorization"] = f"token {api_token}"
            
    def validate_url(self, url: str) -> bool:
        """
        Validates whether a GitHub repository URL matches expected formats using Regex.
        
        Args:
            url (str): The repository URL entered by the user.
            
        Returns:
            bool: True if the URL is valid, False otherwise.
        """
        pattern = r"^(https?://)?(www\.)?github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/?$"
        return bool(re.match(pattern, url.strip()))
        
    def parse_owner_repo(self, url: str) -> Tuple[str, str]:
        """
        Extracts the repository owner and name from a validated URL.
        """
        pattern = r"^(https?://)?(www\.)?github\.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/?$"
        match = re.match(pattern, url.strip())
        if not match:
            raise ValueError("Invalid URL format.")
        return match.group(3), match.group(4)
        
    def fetch_repo_data(self, url: str) -> Dict[str, Any]:
        """
        Fetches repository metadata, directory structures, and recent commit messages.
        
        Args:
            url (str): Validated public GitHub repository URL.
            
        Returns:
            dict: Structured dictionary containing repo metadata, file lists, and commits.
        """
        owner, repo = self.parse_owner_repo(url)
        base_url = f"https://api.github.com/repos/{owner}/{repo}"
        
        with httpx.Client(headers=self.headers, timeout=10.0) as client:
            # Metadata API request
            meta_res = client.get(base_url)
            meta_res.raise_for_status()
            meta_data = meta_res.json()
            
            # Contents API request
            contents_res = client.get(f"{base_url}/contents")
            contents_res.raise_for_status()
            contents = contents_res.json()
            
            # Commits API request
            commits_res = client.get(f"{base_url}/commits?per_page=10")
            commits_res.raise_for_status()
            commits = commits_res.json()
            
        return {
            "name": meta_data.get("name"),
            "description": meta_data.get("description"),
            "language": meta_data.get("language"),
            "stars": meta_data.get("stargazers_count"),
            "file_tree": [f.get("path") for f in contents if f.get("type") == "file"],
            "commit_history": [
                {
                    "sha": c.get("sha")[:7],
                    "message": c.get("commit", {}).get("message"),
                    "date": c.get("commit", {}).get("author", {}).get("date")
                }
                for c in commits
            ]
        }
```

### 2.3 `modules/llm_client.py`
```python
from typing import Dict, Any, Optional
import json
from groq import Groq

class LLMClient:
    """
    Handles prompt creation, token streaming, and JSON response parsing 
    for LLM API endpoints.
    """
    
    def __init__(self, api_key: str) -> None:
        self.client = Groq(api_key=api_key)
        
    def get_skill_gaps(self, resume_text: str, github_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        """
        Runs a compatibility analysis comparing the user's resume and GitHub 
        metrics against a target job description.
        
        Args:
            resume_text (str): Sanitized text from the user's resume.
            github_data (dict): Repository metadata, structure, and commits.
            job_description (str): Target job description text.
            
        Returns:
            dict: Structured gap analysis containing match score, key gaps, and learning roadmaps.
        """
        # Dynamic prompt construction
        system_prompt = (
            "You are an AI Technical Evaluator. Compare the candidate's resume and code "
            "metrics against the target job description. Output a valid JSON response."
        )
        user_prompt = f"""
        JOB DESCRIPTION: {job_description}
        RESUME: {resume_text}
        GITHUB METADATA: {json.dumps(github_data)}
        
        Generate analysis matching the JSON structure:
        - match_score (int)
        - matched_skills (list of str)
        - skill_gaps (list of str)
        - match_justification (str)
        - learning_roadmap (object detailing resources for gaps)
        """
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
        
    def evaluate_interview_response(self, question: str, answer: str) -> Dict[str, Any]:
        """
        Evaluates a candidate's mock interview response, providing feedback and STAR revisions.
        
        Args:
            question (str): The mock interview question asked.
            answer (str): The raw text response entered by the user.
            
        Returns:
            dict: Structured critique containing scores, key gaps, and a rewritten STAR response.
        """
        system_prompt = (
            "You are a Mock Interview Coach. Grade the candidate's response. "
            "Identify strong points and gaps, and rewrite the response using the STAR format. "
            "Output a valid JSON response."
        )
        user_prompt = f"QUESTION: {question}\nANSWER: {answer}"
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)
```

### 2.4 `modules/report_generator.py`
```python
from typing import Dict, Any
from fpdf import FPDF

class PDFReportGenerator:
    """
    Generates a downloadable PDF scorecard containing the user's evaluation 
    results and interview feedback.
    """
    
    def __init__(self) -> None:
        pass
        
    def generate_scorecard(self, audit_data: Dict[str, Any], gap_analysis: Dict[str, Any], interview_feedback: Dict[str, Any]) -> bytes:
        """
        Generates a PDF scorecard based on the session's evaluation results.
        
        Args:
            audit_data (dict): Parsed GitHub and resume metadata.
            gap_analysis (dict): Compatibility metrics and skill gaps.
            interview_feedback (dict): Mock interview questions and evaluations.
            
        Returns:
            bytes: Binary PDF data ready to download in Streamlit via st.download_button.
        """
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        
        # Title
        pdf.cell(40, 10, "CareerLaunch AI: Interview Readiness Scorecard")
        pdf.ln(15)
        
        # Match Score
        pdf.set_font("Arial", "", 12)
        score = gap_analysis.get("match_score", 0)
        pdf.cell(40, 10, f"Overall Job Match Compatibility: {score}%")
        pdf.ln(10)
        
        # Render lists of gaps
        pdf.set_font("Arial", "B", 12)
        pdf.cell(40, 10, "Key Skill Gaps Identified:")
        pdf.ln(8)
        pdf.set_font("Arial", "", 12)
        for gap in gap_analysis.get("skill_gaps", []):
            pdf.cell(40, 8, f"- {gap}")
            pdf.ln(6)
            
        # Mock Feedback
        pdf.ln(10)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(40, 10, "Mock Interview Coaching Critique:")
        pdf.ln(8)
        pdf.set_font("Arial", "", 12)
        pdf.multi_cell(0, 8, interview_feedback.get("optimized_star_answer", "No responses submitted."))
        
        # Output as binary stream
        return bytes(pdf.output())
```

---

## SECTION 3: MOCK INTEGRATION & TESTING FALLBACK

To allow offline testing or work without active API keys, the application uses a mock fallback switch controlled by environment configurations.

### 3.1 Fallback Controller logic (`app.py`)
```python
import streamlit as st
import os

# Set execution mode via session state or environment variables
DEBUG_MOCK_MODE = st.sidebar.checkbox("Activate Mock Logic (Offline Mode)", value=False)

def check_use_mock() -> bool:
    """
    Checks if the application should use mock data based on active keys or settings.
    """
    # Force mock mode if checked in settings
    if DEBUG_MOCK_MODE:
        return True
        
    # Check for missing API keys
    if "GROQ_API_KEY" not in st.secrets:
        return True
        
    return False
```

---

### 3.2 Standardized Mock Payloads

The system uses these static payloads when running in mock fallback mode:

#### 1. Mock GitHub Data
```json
{
  "name": "mock-hackathon-engine",
  "description": "Mock repo for local system testing.",
  "language": "Python",
  "stars": 8,
  "file_tree": ["main.py", "app.py", "Dockerfile", "requirements.txt"],
  "commit_history": [
    {
      "sha": "a1b2c3d",
      "message": "feat: initialize Docker setup and API server",
      "date": "2026-06-05T12:00:00Z"
    },
    {
      "sha": "e5f6g7h",
      "message": "fix: resolve connection leaks in server database pools",
      "date": "2026-06-05T15:30:00Z"
    }
  ]
}
```

#### 2. Mock Gap Analysis Response
```json
{
  "match_score": 78,
  "matched_skills": ["Python", "FastAPI", "REST API Development"],
  "skill_gaps": ["Docker", "Redis", "Unit Testing"],
  "match_justification": "The candidate has strong experience building Python APIs, supported by validated GitHub commits. However, they lack Docker containerization skills needed for production environments.",
  "learning_roadmap": {
    "Docker": {
      "concept_to_learn": "Multi-stage builds and docker-compose configurations.",
      "recommended_resource": "Docker Deep Dive by Nigel Poulton",
      "estimated_hours": 8
    },
    "Redis": {
      "concept_to_learn": "In-memory database setups and standard query configurations.",
      "recommended_resource": "Official Redis University",
      "estimated_hours": 4
    }
  }
}
```

#### 3. Mock Interview Coaching Feedback
```json
{
  "answer_score": 6,
  "strong_points": [
    "Identified the basic problem with database connection pool sizes under high load."
  ],
  "gaps_in_answer": [
    "Failed to mention connection recycling parameters.",
    "Did not explain how to monitor connection pools under stress."
  ],
  "optimized_star_answer": "SITUATION: During a traffic spike, our backend API slowed down due to database connection exhaustion. TASK: My task was to optimize the connection manager to handle high user loads. ACTION: I implemented SQLAlchemy connection pooling with a pool size of 20, set max overflow to 10, and configured a pool timeout of 30 seconds. RESULT: This resolved connection timeouts, reducing response times by 40% under peak load."
}
```
Using this mock configuration allows frontend development and testing to continue even when offline or during API rate limits.
