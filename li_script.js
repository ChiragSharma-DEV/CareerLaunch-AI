
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        const dropzone = document.querySelector('.dropzone-area');
        const fileInput = document.getElementById('resumeFileInput');
        const browseBtn = document.getElementById('browseBtn');
        const githubInput = document.getElementById('githubUrlInput');
        const verifyGithubBtn = document.getElementById('verifyGithubBtn');

        // LinkedIn Selectors
        const tabResumeBtn = document.getElementById('tabResumeBtn');
        const tabLinkedInBtn = document.getElementById('tabLinkedInBtn');
        const resumeTabContent = document.getElementById('resumeTabContent');
        const linkedinTabContent = document.getElementById('linkedinTabContent');
        const linkedinUrlInput = document.getElementById('linkedinUrlInput');
        const linkedinTextInput = document.getElementById('linkedinTextInput');
        const auditLinkedinBtn = document.getElementById('auditLinkedinBtn');
        const linkedinLoading = document.getElementById('linkedinLoading');
        const linkedinReportCard = document.getElementById('linkedinReportCard');
        const downloadLinkedinPdfBtn = document.getElementById('downloadLinkedinPdfBtn');
        const loadDemoLinkedinBtn = document.getElementById('loadDemoLinkedinBtn');
        
        let parsedResumeText = localStorage.getItem('resume_text') || '';
        let githubAnalysis = localStorage.getItem('github_analysis') ? JSON.parse(localStorage.getItem('github_analysis')) : null;
        let linkedinAnalysis = localStorage.getItem('linkedin_analysis') ? JSON.parse(localStorage.getItem('linkedin_analysis')) : null;

        // Initialize UI states from localStorage
        if (parsedResumeText && !linkedinAnalysis) {
            updateDropzoneSuccess('Resume Loaded', 'PDF text extracted successfully.');
        }
        if (githubAnalysis) {
            githubInput.value = `https://github.com/${githubAnalysis.owner}/${githubAnalysis.repo}`;
            renderMetrics();
        }
        if (linkedinAnalysis) {
            linkedinUrlInput.value = localStorage.getItem('linkedin_url') || '';
            linkedinTextInput.value = parsedResumeText;
            renderLinkedinReport(linkedinAnalysis);
        }

        // Dropzone click triggers file input
        dropzone.addEventListener('click', (e) => {
            if (e.target !== browseBtn) {
                fileInput.click();
            }
        });
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // Drag & drop handlers
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('active'), false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('active'), false);
        });
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        }, false);

        async function handleFile(file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }
            
            // Show processing visual feedback
            const h3 = dropzone.querySelector('h3');
            const p = dropzone.querySelector('p');
            const icon = dropzone.querySelector('.material-symbols-outlined');
            h3.textContent = file.name;
            p.textContent = 'Extracting text content...';
            icon.textContent = 'autorenew';
            icon.classList.add('animate-spin', 'text-primary');

            try {
                const text = await extractTextFromPDF(file);
                parsedResumeText = text;
                localStorage.setItem('resume_text', text);
                
                // Set initial candidate name and profile info based on regex
                const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
                const nameMatch = text.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
                const candidateName = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : 'Rahul';
                
                const candidateProfile = {
                    name: candidateName,
                    email: emailMatch ? emailMatch[1] : 'rahul@university.edu',
                    education: text.match(/(Bachelor|Master|B\.S\.|B\.Tech|M\.S\.|M\.Tech)/i) ? ["B.Tech Computer Science & Engineering"] : [],
                    skills: extractSkillsFromText(text),
                    projects: [],
                    experience: [],
                    certifications: []
                };
                localStorage.setItem('candidate_profile', JSON.stringify(candidateProfile));

                // Shift state
                let currentState = parseInt(localStorage.getItem('fsm_state') || '0');
                if (currentState < 1) {
                    localStorage.setItem('fsm_state', '1');
                }
                
                updateDropzoneSuccess('Analysis Complete', 'Ready for review.');
                checkAndCompleteIngestion();
            } catch (err) {
                console.error(err);
                h3.textContent = 'Parsing Failed';
                p.textContent = 'Could not extract PDF text.';
                icon.textContent = 'error';
                icon.classList.remove('animate-spin');
            }
        }

        async function extractTextFromPDF(file) {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onload = async function() {
                    try {
                        const typedarray = new Uint8Array(this.result);
                        const pdf = await pdfjsLib.getDocument(typedarray).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            fullText += pageText + '\n';
                        }
                        resolve(fullText);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }

        function extractSkillsFromText(text) {
            const skillKeywords = ["python", "javascript", "react", "next.js", "node.js", "docker", "kubernetes", "redis", "mongodb", "postgresql", "mysql", "aws", "gcp", "azure", "fastapi", "flask", "django", "html", "css", "tailwind", "git", "ci/cd", "rest api", "graphql", "java", "c++", "typescript"];
            const foundSkills = [];
            const lowerText = text.toLowerCase();
            skillKeywords.forEach(skill => {
                if (lowerText.includes(skill)) {
                    foundSkills.push(skill.toUpperCase());
                }
            });
            return foundSkills;
        }

        function updateDropzoneSuccess(title, subtitle) {
            const h3 = dropzone.querySelector('h3');
            const p = dropzone.querySelector('p');
            const icon = dropzone.querySelector('.material-symbols-outlined');
            h3.textContent = title;
            p.textContent = subtitle;
            icon.textContent = 'check_circle';
            icon.classList.remove('animate-spin');
            icon.classList.add('text-green-400');
        }

        // GitHub Verification logic
        verifyGithubBtn.addEventListener('click', async () => {
            const urlInput = githubInput.value.trim();
            if (!urlInput) {
                alert('Please enter a GitHub repository URL.');
                return;
            }

            const pattern = /github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/;
            const match = urlInput.match(pattern);
            if (!match) {
                alert('Invalid GitHub URL format. Use: https://github.com/owner/repository');
                return;
            }

            const owner = match[1];
            const repo = match[2];

            verifyGithubBtn.textContent = 'Verifying...';
            verifyGithubBtn.disabled = true;

            try {
                // Fetch public repo data
                const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                if (!repoRes.ok) throw new Error('Repository not found or rate limited.');
                const repoData = await repoRes.json();

                // Fetch commits
                let commits = [];
                try {
                    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`);
                    if (commitsRes.ok) {
                        commits = await commitsRes.json();
                    }
                } catch(e) {}

                // Build analysis payload
                const fileTree = ["main.py", "app.py", "Dockerfile", "requirements.txt"]; // Mock contents or default tree
                const techStack = [repoData.language || 'Python'];
                
                // Determine verified skills based on files and language
                const verifiedSkills = [repoData.language].filter(Boolean);
                if (repoData.description && repoData.description.toLowerCase().includes('fastapi')) verifiedSkills.push('FastAPI');
                
                githubAnalysis = {
                    owner: owner,
                    repo: repo,
                    name: repoData.name,
                    description: repoData.description || 'Public GitHub repository',
                    language: repoData.language || 'Python',
                    stars: repoData.stargazers_count,
                    repo_score: 50 + Math.min(repoData.stargazers_count, 20) + Math.min(commits.length * 3, 30),
                    tech_stack: techStack,
                    file_tree: fileTree,
                    repositories: [repoData.name],
                    verified_skills: verifiedSkills,
                    commit_history: commits.map(c => ({
                        sha: c.sha.substring(0, 7),
                        message: c.commit.message,
                        date: c.commit.author.date
                    }))
                };

                localStorage.setItem('github_analysis', JSON.stringify(githubAnalysis));
                
                // Shift state to 2 (Data Bound)
                localStorage.setItem('fsm_state', '2');
                
                renderMetrics();
                checkAndCompleteIngestion();
            } catch (err) {
                console.error(err);
                alert('Failed to verify repository. Running in offline fallback mode.');
                // Offline fallback payload
                githubAnalysis = {
                    owner: owner,
                    repo: repo,
                    name: repo,
                    description: 'Local Offline Repository',
                    language: 'Python',
                    stars: 8,
                    repo_score: 75,
                    tech_stack: ['Python', 'FastAPI'],
                    file_tree: ["main.py", "app.py", "Dockerfile", "requirements.txt"],
                    repositories: [repo],
                    verified_skills: ['Python', 'FastAPI'],
                    commit_history: [
                        { sha: 'a1b2c3d', message: 'feat: initialize Docker setup and API server', date: new Date().toISOString() }
                    ]
                };
                localStorage.setItem('github_analysis', JSON.stringify(githubAnalysis));
                localStorage.setItem('fsm_state', '2');
                renderMetrics();
                checkAndCompleteIngestion();
            } finally {
                verifyGithubBtn.textContent = 'Verify';
                verifyGithubBtn.disabled = false;
            }
        });

        function renderMetrics() {
            if (!githubAnalysis) return;
            document.getElementById('metricStack').textContent = githubAnalysis.language || 'Python';
            document.getElementById('metricCommits').textContent = githubAnalysis.commit_history ? githubAnalysis.commit_history.length : '10+';
            document.getElementById('metricScore').textContent = `${githubAnalysis.repo_score}/100`;
            document.getElementById('verifiedMetricsCard').classList.remove('hidden');
        }

        function checkAndCompleteIngestion() {
            if ((parsedResumeText && githubAnalysis) || linkedinAnalysis) {
                // Ensure state is at least 2
                localStorage.setItem('fsm_state', '2');
            }
        }

        // Tab Switching Event Listeners
        tabResumeBtn.addEventListener('click', () => {
            tabResumeBtn.classList.remove('text-on-surface-variant');
            tabResumeBtn.classList.add('text-primary', 'border-b-2', 'border-primary');
            tabLinkedInBtn.classList.remove('text-primary', 'border-b-2', 'border-primary');
            tabLinkedInBtn.classList.add('text-on-surface-variant');
            
            resumeTabContent.classList.remove('hidden');
            linkedinTabContent.classList.add('hidden');
        });

        tabLinkedInBtn.addEventListener('click', () => {
            tabLinkedInBtn.classList.remove('text-on-surface-variant');
            tabLinkedInBtn.classList.add('text-primary', 'border-b-2', 'border-primary');
            tabResumeBtn.classList.remove('text-primary', 'border-b-2', 'border-primary');
            tabResumeBtn.classList.add('text-on-surface-variant');
            
            linkedinTabContent.classList.remove('hidden');
            resumeTabContent.classList.add('hidden');
        });

        // Load Demo Data Listener
        loadDemoLinkedinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            linkedinUrlInput.value = "https://www.linkedin.com/in/rahul-software-engineer";
            linkedinTextInput.value = `Rahul\nSoftware Engineering Student\nSkills: Python, JavaScript, React, Next.js, Node.js, FastAPI, SQL, Git, Docker, REST APIs\n\nAbout:\nPassionate software engineer focused on building highly scalable, responsive web architectures and clean APIs. Enthusiastic about clean code, automated pipelines, and cloud containers.\n\nExperience:\n- Software Engineering Intern at TechVanguard (Jan 2026 - Present): Developed REST APIs using FastAPI and Python, improving query response latency by 35% through Redis caching configurations. Structured CI/CD builds with GitHub Actions.\n- Full-Stack Developer (Academic Projects): Built a collaborative team planner tool with real-time sync, containerized using Docker, and deployed via AWS ECS.`;
        });

        // Audit Profile Listener
        auditLinkedinBtn.addEventListener('click', async () => {
            const url = linkedinUrlInput.value.trim();
            const text = linkedinTextInput.value.trim();
            
            if (!url) {
                alert('Please enter a LinkedIn Profile URL.');
                return;
            }
            
            auditLinkedinBtn.textContent = 'Auditing...';
            auditLinkedinBtn.disabled = true;
            linkedinLoading.classList.remove('hidden');
            linkedinReportCard.classList.add('hidden');
            
            const apiKey = localStorage.getItem('groq_api_key');
            
            try {
                if (apiKey) {
                    const prompt = `
You are LinkedInProfileAuditorAgent, an expert technical recruiter, executive branding specialist, and career coach.
Perform a professional audit on the candidate's LinkedIn profile details, rating their headline, about section, and experience formatting. Identify key technical skills and output a valid JSON response matching the requested schema structure.

LINKEDIN PROFILE URL:
${url}

COPIED PROFILE DETAILS:
${text || 'No extra profile text provided. Perform audit using the URL details or standard default engineer structure.'}

Your response must be a valid, parseable JSON object matching this schema:
{
  "headline_score": number (0 to 100),
  "headline_feedback": "string",
  "about_score": number (0 to 100),
  "about_feedback": "string",
  "experience_score": number (0 to 100),
  "experience_feedback": "string",
  "completeness_score": number (0 to 100),
  "overall_score": number (0 to 100),
  "profile_tips": string[],
  "extracted_skills": string[]
}
Output ONLY the raw JSON object. Do not include markdown wraps (like \`\`\`json) or additional text.
`;

                    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'llama-3.1-8b-instant',
                            messages: [
                                { role: 'system', content: 'You are an AI LinkedIn Profile Auditor. Output valid JSON only.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.2,
                            response_format: { type: 'json_object' }
                        })
                    });

                    if (!response.ok) throw new Error('Groq API request failed.');
                    const resJson = await response.json();
                    linkedinAnalysis = JSON.parse(resJson.choices[0].message.content);
                } else {
                    // Offline fallback
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    linkedinAnalysis = getMockLinkedinAudit(url, text);
                }

                // Save results
                localStorage.setItem('linkedin_analysis', JSON.stringify(linkedinAnalysis));
                localStorage.setItem('linkedin_url', url);
                
                parsedResumeText = text || `LinkedIn profile details for ${url}`;
                localStorage.setItem('resume_text', parsedResumeText);
                
                // Sync Candidate profile
                const candidateProfile = localStorage.getItem('candidate_profile') ? JSON.parse(localStorage.getItem('candidate_profile')) : {
                    name: 'Rahul',
                    email: 'rahul@university.edu',
                    education: ["B.Tech Computer Science & Engineering"],
                    skills: [],
                    projects: [],
                    experience: [],
                    certifications: []
                };
                
                // Parse out and merge extracted skills
                if (linkedinAnalysis.extracted_skills) {
                    linkedinAnalysis.extracted_skills.forEach(skill => {
                        const cleanSkill = skill.toUpperCase().trim();
                        if (!candidateProfile.skills.includes(cleanSkill)) {
                            candidateProfile.skills.push(cleanSkill);
                        }
                    });
                }
                // Fallback basic skills if empty
                if (candidateProfile.skills.length === 0) {
                    candidateProfile.skills = extractSkillsFromText(parsedResumeText);
                }
                localStorage.setItem('candidate_profile', JSON.stringify(candidateProfile));

                // Upgrade state
                let currentState = parseInt(localStorage.getItem('fsm_state') || '0');
                if (currentState < 2) {
                    localStorage.setItem('fsm_state', '2');
                }
                
                renderLinkedinReport(linkedinAnalysis);
            } catch (err) {
                console.error(err);
                alert('Audit execution failed. Loading local simulated audit.');
                linkedinAnalysis = getMockLinkedinAudit(url, text);
                localStorage.setItem('linkedin_analysis', JSON.stringify(linkedinAnalysis));
                localStorage.setItem('linkedin_url', url);
                renderLinkedinReport(linkedinAnalysis);
            } finally {
                linkedinLoading.classList.add('hidden');
                auditLinkedinBtn.textContent = 'Audit LinkedIn Profile';
                auditLinkedinBtn.disabled = false;
            }
        });

        function renderLinkedinReport(analysis) {
            document.getElementById('scoreHeadline').textContent = `${analysis.headline_score}/100`;
            document.getElementById('scoreAbout').textContent = `${analysis.about_score}/100`;
            document.getElementById('scoreExperience').textContent = `${analysis.experience_score}/100`;
            document.getElementById('scoreCompleteness').textContent = `${analysis.completeness_score}/100`;
            document.getElementById('linkedinOverallBadge').textContent = `Overall Score: ${analysis.overall_score}%`;
            
            document.getElementById('feedbackHeadline').textContent = analysis.headline_feedback;
            document.getElementById('feedbackAbout').textContent = analysis.about_feedback;
            document.getElementById('feedbackExperience').textContent = analysis.experience_feedback;
            
            const tipsList = document.getElementById('linkedinTipsList');
            tipsList.innerHTML = '';
            analysis.profile_tips.forEach(tip => {
                const li = document.createElement('li');
                li.className = 'leading-relaxed text-on-surface-variant/90';
                li.textContent = tip;
                tipsList.appendChild(li);
            });
            
            linkedinReportCard.classList.remove('hidden');
        }

        // Mock generator for offline audits
        function getMockLinkedinAudit(url, text) {
            const lowerText = text ? text.toLowerCase() : "";
            const foundSkills = extractSkillsFromText(text || "Python, React, FastAPI");
            
            const skillsList = foundSkills.length > 0 ? foundSkills : ["PYTHON", "JAVASCRIPT", "DOCKER"];
            
            return {
                headline_score: 83,
                headline_feedback: "Your headline is concise, but it misses primary technical sub-disciplines. Expanding it to include 'Full-Stack Developer | Python, React, FastAPI' would improve organic search optimization for recruiters looking for specific stacks.",
                about_score: 74,
                about_feedback: "The summary has a clear technical tone, but it lacks story flow. Consider structuring your About section using a three-tier method: 1. Career mission, 2. Key validated tech stacks, 3. Contact call-to-action.",
                experience_score: 79,
                experience_feedback: "Your roles showcase solid engineering projects. However, they lack strong impact metrics. Use action-verbs and metric outcomes (e.g. 'Improved cache performance by 35% using Redis caching configurations') to reinforce credibility.",
                completeness_score: 90,
                overall_score: 81,
                profile_tips: [
                    "Embed a direct link to your personal developer portfolio or GitHub page in your profile Featured tab.",
                    "Define B.Tech engineering projects with clear action statements and structural files mentioned.",
                    "Ask for peer endorsements to validate technical ownership of skills like " + skillsList.slice(0, 3).join(', ') + ".",
                    "Add explicit skill tags to individual work history descriptions to improve job matching algorithms."
                ],
                extracted_skills: skillsList
            };
        }

        // jsPDF Download handler
        downloadLinkedinPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const analysis = JSON.parse(localStorage.getItem('linkedin_analysis'));
            if (!analysis) return;
            
            const candidateProfile = localStorage.getItem('candidate_profile') ? JSON.parse(localStorage.getItem('candidate_profile')) : { name: 'LinkedIn Candidate' };

            // Headings
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(22);
            doc.text("CareerLaunch AI - LinkedIn Profile Audit", 20, 25);
            
            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()} | Candidate: ${candidateProfile.name}`, 20, 32);
            
            // Draw horizontal divider
            doc.setDrawColor(200);
            doc.line(20, 35, 190, 35);

            // Summary Info
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(0);
            doc.text("1. Overall Profile Evaluation Summary", 20, 45);

            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.text(`Overall Profile Score: ${analysis.overall_score}/100`, 25, 53);
            doc.text(`Headline Clarity Score: ${analysis.headline_score}/100`, 25, 59);
            doc.text(`About Section Score: ${analysis.about_score}/100`, 25, 65);
            doc.text(`Experience Bullets Score: ${analysis.experience_score}/100`, 25, 71);
            doc.text(`Completeness Score: ${analysis.completeness_score}/100`, 25, 77);

            // Feedbacks
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.text("2. Section Critique", 20, 90);

            let yPosition = 98;
            
            doc.setFontSize(10);
            doc.setFont("Helvetica", "bold");
            doc.text("Headline Feedback:", 20, yPosition);
            yPosition += 5;
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(80);
            const headlineText = doc.splitTextToSize(analysis.headline_feedback, 165);
            doc.text(headlineText, 25, yPosition);
            yPosition += (headlineText.length * 4.5) + 6;
            doc.setTextColor(0);

            doc.setFont("Helvetica", "bold");
            doc.text("About Section Feedback:", 20, yPosition);
            yPosition += 5;
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(80);
            const aboutText = doc.splitTextToSize(analysis.about_feedback, 165);
            doc.text(aboutText, 25, yPosition);
            yPosition += (aboutText.length * 4.5) + 6;
            doc.setTextColor(0);

            if (yPosition > 230) {
                doc.addPage();
                yPosition = 25;
            }

            doc.setFont("Helvetica", "bold");
            doc.text("Experience Bullet Points Feedback:", 20, yPosition);
            yPosition += 5;
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(80);
            const expText = doc.splitTextToSize(analysis.experience_feedback, 165);
            doc.text(expText, 25, yPosition);
            yPosition += (expText.length * 4.5) + 8;
            doc.setTextColor(0);

            if (yPosition > 200) {
                doc.addPage();
                yPosition = 25;
            }

            // Recommendations Checklist
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.text("3. Actionable Optimization Checklist", 20, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(50);
            
            analysis.profile_tips.forEach((tip, idx) => {
                const tipText = doc.splitTextToSize(`[ ] ${tip}`, 165);
                doc.text(tipText, 25, yPosition);
                yPosition += (tipText.length * 4.5) + 4;
            });

            // Save PDF
            doc.save(`CareerLaunch_LinkedIn_Audit_${candidateProfile.name}.pdf`);
        });
        
        // Load initial FSM check
        checkAndCompleteIngestion();
    