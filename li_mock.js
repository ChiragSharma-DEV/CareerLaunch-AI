
        const lockOverlay = document.getElementById('stateLockOverlay');
        const setupPanel = document.getElementById('setupPanel');
        const interviewPanel = document.getElementById('interviewPanel');
        const summaryPanel = document.getElementById('summaryPanel');
        
        const apiKeyInput = document.getElementById('groqApiKey');
        const startInterviewBtn = document.getElementById('startInterviewBtn');
        const questionProgressText = document.getElementById('questionProgressText');
        const currentTopicText = document.getElementById('currentTopicText');
        const progressBar = document.getElementById('progressBar');
        const interviewerBadge = document.getElementById('interviewerBadge');
        const difficultyBadge = document.getElementById('difficultyBadge');
        const questionTextElement = document.getElementById('questionText');
        const questionCategoryElement = document.getElementById('questionCategory');
        const candidateAnswerInput = document.getElementById('candidateAnswerInput');
        const micBtn = document.getElementById('micBtn');
        const sttStatusText = document.getElementById('sttStatusText');
        const submitAnswerBtn = document.getElementById('submitAnswerBtn');
        const skipBtn = document.getElementById('skipBtn');
        
        const evalLoadingCard = document.getElementById('evalLoadingCard');
        const questionFeedbackCard = document.getElementById('questionFeedbackCard');
        const actionButtons = document.getElementById('actionButtons');
        const answerArea = document.getElementById('answerArea');
        
        const feedbackScore = document.getElementById('feedbackScore');
        const feedbackClass = document.getElementById('feedbackClass');
        const feedbackBluff = document.getElementById('feedbackBluff');
        const feedbackStrengths = document.getElementById('feedbackStrengths');
        const feedbackGaps = document.getElementById('feedbackGaps');
        const feedbackStar = document.getElementById('feedbackStar');
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        
        const finalScoreText = document.getElementById('finalScoreText');
        const finalRecommendation = document.getElementById('finalRecommendation');
        const verifiedSkillsList = document.getElementById('verifiedSkillsList');
        const unverifiedSkillsList = document.getElementById('unverifiedSkillsList');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');

        // Check FSM state gating
        const fsmState = parseInt(localStorage.getItem('fsm_state') || '0');
        if (fsmState < 3) {
            lockOverlay.classList.remove('hidden');
        }

        // Global Keydown for Command Palette
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                window.location.href = 'command-palette.html';
            }
        });

        // Initialize Settings from LocalStorage
        apiKeyInput.value = localStorage.getItem('groq_api_key') || '';
        apiKeyInput.addEventListener('input', () => {
            localStorage.setItem('groq_api_key', apiKeyInput.value.trim());
        });

        // Load Upstream Candidate Data
        const resumeText = localStorage.getItem('resume_text') || '';
        const githubAnalysis = localStorage.getItem('github_analysis') ? JSON.parse(localStorage.getItem('github_analysis')) : {};
        const jobAnalysis = localStorage.getItem('job_analysis') ? JSON.parse(localStorage.getItem('job_analysis')) : {};
        const candidateProfile = localStorage.getItem('candidate_profile') ? JSON.parse(localStorage.getItem('candidate_profile')) : {
            name: 'Rahul',
            skills: ['Python', 'JavaScript']
        };

        // State variables
        let preferences = {};
        let sessionMemory = {
            asked_questions: [],
            covered_projects: [],
            covered_skills: [],
            covered_gaps: [],
            strong_areas: [],
            weak_areas: [],
            verified_skills: [],
            unverified_skills: [],
            answer_summaries: [],
            difficulty_level: "L2",
            current_topic: "Introduction",
            question_history: [] // Array of { question, answer, evaluation, category, difficulty }
        };
        let currentQuestion = null;
        let questionCounter = 0;
        let difficultyTrajectory = []; // Track difficulty level over questions

        // Voice Input Recognition setup
        let recognition = null;
        let isListening = false;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRec();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                candidateAnswerInput.value = (candidateAnswerInput.value + ' ' + transcript).trim();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                stopListening();
            };

            recognition.onend = () => {
                stopListening();
            };
        }

        function startListening() {
            if (!recognition) return;
            try {
                recognition.start();
                isListening = true;
                micBtn.classList.remove('bg-white/10');
                micBtn.classList.add('bg-red-500/25', 'text-red-400');
                sttStatusText.classList.remove('hidden');
                sttStatusText.classList.add('flex');
            } catch(e) {
                console.error(e);
            }
        }

        function stopListening() {
            if (!recognition) return;
            try {
                recognition.stop();
            } catch(e) {}
            isListening = false;
            micBtn.classList.remove('bg-red-500/25', 'text-red-400');
            micBtn.classList.add('bg-white/10');
            sttStatusText.classList.add('hidden');
        }

        micBtn.addEventListener('click', () => {
            if (!recognition) {
                alert('Speech Recognition is not supported by your browser.');
                return;
            }
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        });

        // Start button handler
        startInterviewBtn.addEventListener('click', () => {
            preferences = {
                interview_type: document.getElementById('interviewType').value,
                interviewer_personality: document.getElementById('interviewerPersonality').value,
                interview_mode: document.getElementById('stressLevel').value,
                difficulty: document.getElementById('initialDifficulty').value,
                total_questions: parseInt(document.getElementById('totalQuestions').value)
            };

            sessionMemory.difficulty_level = preferences.difficulty;
            difficultyTrajectory.push(preferences.difficulty);

            // Configure Badge Text
            interviewerBadge.textContent = preferences.interviewer_personality.toUpperCase();
            
            // Hide setup, show interview
            setupPanel.classList.add('hidden');
            interviewPanel.classList.remove('hidden');
            interviewPanel.classList.add('flex');

            nextQuestion();
        });

        // Main Interview Flow logic
        async function nextQuestion() {
            // Reset input and feedback area
            candidateAnswerInput.value = '';
            questionFeedbackCard.classList.add('hidden');
            actionButtons.classList.remove('hidden');
            actionButtons.classList.add('flex');
            answerArea.classList.remove('hidden');
            answerArea.classList.add('flex');

            questionCounter++;
            if (questionCounter > preferences.total_questions) {
                finishInterview();
                return;
            }

            // Update Progress Header
            questionProgressText.textContent = `Question ${questionCounter} of ${preferences.total_questions}`;
            progressBar.style.width = `${(questionCounter / preferences.total_questions) * 100}%`;
            difficultyBadge.textContent = `${sessionMemory.difficulty_level} Difficulty`;

            // Determine dynamic question category
            let category = "Skill";
            const ratioIndex = (questionCounter - 1) / preferences.total_questions;
            if (preferences.interview_type === "technical") {
                category = ratioIndex < 0.4 ? "Skill" : ratioIndex < 0.7 ? "Project" : ratioIndex < 0.9 ? "Gap" : "Behavioral";
            } else if (preferences.interview_type === "hr" || preferences.interview_type === "behavioral") {
                category = ratioIndex < 0.6 ? "Behavioral" : ratioIndex < 0.8 ? "Skill" : ratioIndex < 0.9 ? "Gap" : "Project";
            } else if (preferences.interview_type === "projects") {
                category = ratioIndex < 0.7 ? "Project" : ratioIndex < 0.8 ? "Skill" : ratioIndex < 0.9 ? "Gap" : "Behavioral";
            } else if (preferences.interview_type === "gaps") {
                category = ratioIndex < 0.5 ? "Gap" : ratioIndex < 0.8 ? "Skill" : ratioIndex < 0.9 ? "Project" : "Behavioral";
            } else {
                category = ratioIndex < 0.3 ? "Project" : ratioIndex < 0.6 ? "Skill" : ratioIndex < 0.8 ? "Behavioral" : "Gap";
            }

            // Generate question from LLM or mock
            questionTextElement.textContent = "Synthesizing question parameters...";
            const apiKey = localStorage.getItem('groq_api_key');

            if (apiKey) {
                try {
                    const prompt = `
You are InterviewCoachAgent, operating as an interviewer inside CareerLaunch AI.
Generate the next realistic, context-aware interview question based on the candidate's profile, repository findings, gaps, and previous answers.

Candidate Context:
- Profile: ${JSON.stringify(candidateProfile)}
- GitHub Findings: ${JSON.stringify(githubAnalysis)}
- Target Job Fit Gaps: ${JSON.stringify(jobAnalysis.skill_gaps || [])}

Interview Settings:
- Personality: ${preferences.interviewer_personality} (Tone focus: Startup CTO = architecture/ownership; Senior Engineer = quality/debugging; HR = behavior; etc.)
- Style/Tone: ${preferences.interview_mode} (Friendly, Professional, Hiring Manager, Stress Interview)
- Target Question Category: ${category}
- Difficulty Level: ${sessionMemory.difficulty_level}

Session Memory:
${JSON.stringify(sessionMemory)}

Before generating:
- Check asked_questions to avoid duplicates (similarity < 70%).
- If category is "Project", focus on their GitHub repo (${githubAnalysis.name || 'their projects'}). Progressive depth L1-L5.
- If category is "Gap", focus on missing skills (${(jobAnalysis.skill_gaps || []).join(', ')}) and bridge naturally.
- If category is "Skill", validated genuine skill ownership without textbook questions.
- If high-risk skills (Docker, Kubernetes, Kafka, Redis, AWS, React, System Design) are present, generate practical scenario questions to detect bluffs.

Output MUST be a valid JSON object matching the requested schema:
{
  "question_id": ${questionCounter},
  "category": "${category}",
  "topic": "string",
  "difficulty": "${sessionMemory.difficulty_level}",
  "question": "string",
  "follow_up_candidates": ["string"],
  "answer_evaluation": {
    "expected_focus_areas": ["string"]
  },
  "memory_updates": {
    "covered_skills": ["string"],
    "current_topic": "string",
    "difficulty_level": "${sessionMemory.difficulty_level}"
  }
}
Output ONLY the raw JSON object. Do not explain reasoning.
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
                                { role: 'system', content: 'You are an AI Interview Coach. Output valid JSON only.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.3,
                            response_format: { type: 'json_object' }
                        })
                    });

                    if (!response.ok) throw new Error('API failure');
                    const resJson = await response.json();
                    currentQuestion = JSON.parse(resJson.choices[0].message.content);
                } catch(e) {
                    console.error(e);
                    currentQuestion = getMockQuestion(category, sessionMemory.difficulty_level);
                }
            } else {
                // Mock generator
                await new Promise(r => setTimeout(r, 1000));
                currentQuestion = getMockQuestion(category, sessionMemory.difficulty_level);
            }

            // Render details
            currentTopicText.textContent = `Topic: ${currentQuestion.topic}`;
            questionCategoryElement.innerHTML = `<span class="material-symbols-outlined text-[14px]">psychology</span> ${currentQuestion.category}`;
            sessionMemory.current_topic = currentQuestion.topic;
            sessionMemory.asked_questions.push(currentQuestion.question);

            // Typewriter effect
            typewriterText(currentQuestion.question, questionTextElement);
        }

        function typewriterText(text, element) {
            element.textContent = '';
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 15);
        }

        // Submit answer click
        submitAnswerBtn.addEventListener('click', async () => {
            const answer = candidateAnswerInput.value.trim();
            if (!answer) {
                alert('Please type or speak a response.');
                return;
            }

            stopListening();
            actionButtons.classList.add('hidden');
            answerArea.classList.add('hidden');
            evalLoadingCard.classList.remove('hidden');
            evalLoadingCard.classList.add('flex');

            let evaluation = null;
            const apiKey = localStorage.getItem('groq_api_key');

            if (apiKey) {
                try {
                    const prompt = `
You are InterviewCoachAgent evaluating the candidate's response.
Grade their answer based on the question topic, expected focus areas, personality, and stress level.

Question: "${currentQuestion.question}"
Topic: "${currentQuestion.topic}"
Category: "${currentQuestion.category}"
Difficulty: "${currentQuestion.difficulty}"
Expected Focus Areas: ${JSON.stringify(currentQuestion.answer_evaluation.expected_focus_areas)}

Candidate Answer:
"${answer}"

Interviewer Personality: ${preferences.interviewer_personality}
Stress level Style: ${preferences.interview_mode}

Output Requirements:
Analyze the answer, adjust difficulty level, detect bluffs, and return a valid JSON object matching the requested schema:
{
  "score": number (1 to 10),
  "answer_classification": "Strong" | "Moderate" | "Weak",
  "strengths": string[],
  "growth_areas": string[],
  "is_bluff_detected": boolean,
  "optimized_star_answer": string (rewrite of the response in STAR format),
  "memory_updates": {
    "verified_skills": string[] (skills candidate proved they know),
    "unverified_skills": string[] (skills candidate failed to prove or flagged as bluff),
    "difficulty_level": string (adjust current difficulty level: Strong -> increase by 1 level e.g. L2->L3; Moderate -> maintain; Weak -> decrease level. Do not jump more than 1 level)
  }
}
Output ONLY the raw JSON object. Do not explain reasoning.
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
                                { role: 'system', content: 'You are an AI Interview Coach. Output valid JSON only.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.2,
                            response_format: { type: 'json_object' }
                        })
                    });

                    if (!response.ok) throw new Error('API failure');
                    const resJson = await response.json();
                    evaluation = JSON.parse(resJson.choices[0].message.content);
                } catch(e) {
                    console.error(e);
                    evaluation = getMockEvaluation(answer);
                }
            } else {
                await new Promise(r => setTimeout(r, 1500));
                evaluation = getMockEvaluation(answer);
            }

            // Save to memory and history
            sessionMemory.question_history.push({
                question: currentQuestion.question,
                answer: answer,
                evaluation: evaluation,
                category: currentQuestion.category,
                difficulty: currentQuestion.difficulty
            });

            // Update memory engine lists
            if (evaluation.memory_updates.verified_skills) {
                evaluation.memory_updates.verified_skills.forEach(s => {
                    if (!sessionMemory.verified_skills.includes(s)) sessionMemory.verified_skills.push(s);
                });
            }
            if (evaluation.memory_updates.unverified_skills) {
                evaluation.memory_updates.unverified_skills.forEach(s => {
                    if (!sessionMemory.unverified_skills.includes(s)) sessionMemory.unverified_skills.push(s);
                });
            }

            // Adjust difficulty level
            sessionMemory.difficulty_level = evaluation.memory_updates.difficulty_level;
            difficultyTrajectory.push(sessionMemory.difficulty_level);

            // Render critique
            feedbackScore.textContent = `${evaluation.score}/10`;
            feedbackClass.textContent = evaluation.answer_classification;
            feedbackClass.className = `text-sm font-bold ${
                evaluation.answer_classification === 'Strong' ? 'text-emerald-400' :
                evaluation.answer_classification === 'Moderate' ? 'text-amber-400' : 'text-red-400'
            }`;

            feedbackBluff.textContent = evaluation.is_bluff_detected ? '⚠️ BLUFF DETECTED' : '✓ Verified';
            feedbackBluff.className = `text-xs font-semibold ${
                evaluation.is_bluff_detected ? 'text-red-400 animate-pulse' : 'text-emerald-400'
            }`;

            feedbackStrengths.innerHTML = '';
            evaluation.strong_points ? evaluation.strong_points.forEach(s => {
                feedbackStrengths.innerHTML += `<li class="flex gap-2"><span class="text-green-400 font-bold">+</span> <span>${s}</span></li>`;
            }) : evaluation.strengths.forEach(s => {
                feedbackStrengths.innerHTML += `<li class="flex gap-2"><span class="text-green-400 font-bold">+</span> <span>${s}</span></li>`;
            });

            feedbackGaps.innerHTML = '';
            evaluation.gaps_in_answer ? evaluation.gaps_in_answer.forEach(g => {
                feedbackGaps.innerHTML += `<li class="flex gap-2"><span class="text-orange-400 font-bold">-</span> <span>${g}</span></li>`;
            }) : evaluation.growth_areas.forEach(g => {
                feedbackGaps.innerHTML += `<li class="flex gap-2"><span class="text-orange-400 font-bold">-</span> <span>${g}</span></li>`;
            });

            feedbackStar.textContent = evaluation.optimized_star_answer;

            evalLoadingCard.classList.add('hidden');
            questionFeedbackCard.classList.remove('hidden');
            questionFeedbackCard.classList.add('flex');
        });

        // Skip Question
        skipBtn.addEventListener('click', () => {
            nextQuestion();
        });

        // Next Question click
        nextQuestionBtn.addEventListener('click', () => {
            nextQuestion();
        });

        // Finished Interview Summary Page setup
        function finishInterview() {
            interviewPanel.classList.add('hidden');
            summaryPanel.classList.remove('hidden');
            summaryPanel.classList.add('flex');

            // Calculate aggregate score
            const history = sessionMemory.question_history;
            const totalScore = history.reduce((sum, item) => sum + item.evaluation.score, 0);
            const averageScore = history.length > 0 ? Math.round((totalScore / (history.length * 10)) * 100) : 0;

            finalScoreText.textContent = `${averageScore}/100`;
            finalRecommendation.textContent = averageScore >= 80 ? 'Viability: Highly Recommended' : averageScore >= 60 ? 'Viability: Good Candidate' : 'Viability: Needs In-Depth Training';
            finalRecommendation.className = `text-xs mt-3 ${
                averageScore >= 80 ? 'text-emerald-400' : averageScore >= 60 ? 'text-amber-400' : 'text-red-400'
            }`;

            // Render verified skills
            verifiedSkillsList.innerHTML = '';
            sessionMemory.verified_skills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = 'px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold';
                badge.textContent = skill;
                verifiedSkillsList.appendChild(badge);
            });
            if (sessionMemory.verified_skills.length === 0) {
                verifiedSkillsList.innerHTML = '<span class="text-xs text-on-surface-variant italic">No skills verified.</span>';
            }

            // Render unverified/bluff skills
            unverifiedSkillsList.innerHTML = '';
            sessionMemory.unverified_skills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = 'px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold';
                badge.textContent = skill;
                unverifiedSkillsList.appendChild(badge);
            });
            if (sessionMemory.unverified_skills.length === 0) {
                unverifiedSkillsList.innerHTML = '<span class="text-xs text-on-surface-variant italic">No bluff/unverified flags.</span>';
            }

            // Render Chart.js line graph
            renderTrajectoryChart();
        }

        function renderTrajectoryChart() {
            const ctx = document.getElementById('trajectoryChart').getContext('2d');
            const labels = ['Setup', ...sessionMemory.question_history.map((_, i) => `Q${i + 1}`)];
            
            // Map levels L1-L5 to values 1-5
            const levelMap = { 'L1': 1, 'L2': 2, 'L3': 3, 'L4': 4, 'L5': 5 };
            const dataPoints = difficultyTrajectory.map(lvl => levelMap[lvl] || 2);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Interviewer Difficulty Vector',
                        data: dataPoints,
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointBackgroundColor: '#ffffff',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            min: 1,
                            max: 5,
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.5)',
                                font: { family: 'Geist' },
                                callback: function(value) {
                                    return 'L' + value;
                                }
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.5)',
                                font: { family: 'Geist' }
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        }
                    }
                }
            });
        }

        // jsPDF Generator
        downloadPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Headings
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(22);
            doc.text("CareerLaunch AI - Interview Scorecard", 20, 25);
            
            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()} | Candidate: ${candidateProfile.name}`, 20, 32);
            
            // Draw horizontal divider
            doc.setDrawColor(200);
            doc.line(20, 35, 190, 35);

            // Match Summary
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.setTextColor(0);
            doc.text("1. Overall Evaluation Summary", 20, 45);

            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            const history = sessionMemory.question_history;
            const totalScore = history.reduce((sum, item) => sum + item.evaluation.score, 0);
            const averageScore = history.length > 0 ? Math.round((totalScore / (history.length * 10)) * 100) : 0;
            
            doc.text(`Overall Score: ${averageScore}/100`, 25, 53);
            doc.text(`Viability Recommendation: ${finalRecommendation.textContent}`, 25, 59);

            // Render Questions List
            doc.setFontSize(14);
            doc.setFont("Helvetica", "bold");
            doc.text("2. Question-by-Question Critique", 20, 72);

            let yPosition = 80;
            history.forEach((item, index) => {
                if (yPosition > 240) {
                    doc.addPage();
                    yPosition = 25;
                }
                doc.setFontSize(11);
                doc.setFont("Helvetica", "bold");
                doc.text(`Q${index + 1}: ${item.question.substring(0, 75)}...`, 20, yPosition);
                yPosition += 6;

                doc.setFontSize(9);
                doc.setFont("Helvetica", "normal");
                doc.setTextColor(80);
                doc.text(`Category: ${item.category} | Difficulty: ${item.difficulty} | Score: ${item.evaluation.score}/10`, 25, yPosition);
                yPosition += 5;

                const starText = doc.splitTextToSize(`STAR Optimization: ${item.evaluation.optimized_star_answer}`, 165);
                doc.text(starText, 25, yPosition);
                yPosition += (starText.length * 4.5) + 6;
                doc.setTextColor(0);
            });

            // Save PDF
            doc.save(`CareerLaunch_Scorecard_${candidateProfile.name}.pdf`);
        });

        // Mock Payload Data Library for offline mode
        function getMockQuestion(category, difficulty) {
            const mockQuestions = {
                "Skill": [
                    {
                        question: "You have a table with 10,000 rows in React. How would you optimize the rendering performance without freezing the browser thread?",
                        topic: "React Rendering Optimization",
                        expected_focus_areas: ["Virtualization", "Windowing", "useMemo", "React.memo"]
                    },
                    {
                        question: "A Docker container starts successfully in local dev but fails to reach a separate PostgreSQL container on the same network. How would you debug it?",
                        topic: "Docker Container Networking",
                        expected_focus_areas: ["Docker Network", "Bridge", "Port Mapping", "Connection String"]
                    }
                ],
                "Project": [
                    {
                        question: "Walk me through the exact database indexing strategy you implemented in your project to handle search operations under heavy loads.",
                        topic: "Database Indexing Strategy",
                        expected_focus_areas: ["B-Tree Indexes", "Composite Indexes", "Explain Analyze"]
                    },
                    {
                        question: "How did you manage authentication state in your project's architecture, and how would you invalidate active JWT sessions immediately if needed?",
                        topic: "Authentication Architecture",
                        expected_focus_areas: ["JWT Revocation", "Redis Blacklist", "Refresh Token Rotation"]
                    }
                ],
                "Gap": [
                    {
                        question: "Since the job description requires Redis experience, walk me through how you would configure Redis cache invalidation when database prices change in real-time.",
                        topic: "Redis Cache Invalidation",
                        expected_focus_areas: ["Cache-aside", "Write-through", "TTL", "Eviction Policy"]
                    },
                    {
                        question: "To address the CI/CD skill gap, how would you design a GitHub Actions pipeline that builds, tests, and deploys a Docker image safely?",
                        topic: "CI/CD Pipeline Design",
                        expected_focus_areas: ["GitHub Actions", "Docker Build", "Staging Validation"]
                    }
                ],
                "Behavioral": [
                    {
                        question: "Tell me about a time you had to advocate for a design decision that stakeholders initially opposed. How did you align the team?",
                        topic: "Team Stakeholder Alignment",
                        expected_focus_areas: ["STAR Method", "Metrics", "Conflict Resolution"]
                    },
                    {
                        question: "Describe a production failure or bug you introduced. What was the impact, and how did you resolve it?",
                        topic: "Incident Post-Mortem",
                        expected_focus_areas: ["Blameless Post-Mortem", "Rollback", "Hotfix"]
                    }
                ]
            };

            const list = mockQuestions[category] || mockQuestions["Skill"];
            const selected = list[Math.floor(Math.random() * list.length)];
            
            return {
                question_id: questionCounter,
                category: category,
                topic: selected.topic,
                difficulty: difficulty,
                question: selected.question,
                follow_up_candidates: [
                    "How does this scale in a multi-region cloud setup?",
                    "What testing utilities would you write to ensure this stays performant?"
                ],
                answer_evaluation: {
                    expected_focus_areas: selected.expected_focus_areas
                },
                memory_updates: {
                    covered_skills: [selected.topic.split(' ')[0]],
                    current_topic: selected.topic,
                    difficulty_level: difficulty
                }
            };
        }

        function getMockEvaluation(answer) {
            const wordCount = answer.split(/\s+/).length;
            const isShort = wordCount < 15;
            const score = isShort ? 4 : Math.min(10, Math.floor(6 + (wordCount / 20)));
            const classification = score >= 8 ? "Strong" : score >= 6 ? "Moderate" : "Weak";
            
            // Adjust difficulty level
            let nextDifficulty = sessionMemory.difficulty_level;
            if (classification === "Strong") {
                if (nextDifficulty === "L1") nextDifficulty = "L2";
                else if (nextDifficulty === "L2") nextDifficulty = "L3";
                else if (nextDifficulty === "L3") nextDifficulty = "L4";
                else if (nextDifficulty === "L4") nextDifficulty = "L5";
            } else if (classification === "Weak") {
                if (nextDifficulty === "L5") nextDifficulty = "L4";
                else if (nextDifficulty === "L4") nextDifficulty = "L3";
                else if (nextDifficulty === "L3") nextDifficulty = "L2";
                else if (nextDifficulty === "L2") nextDifficulty = "L1";
            }

            const highRiskKeywords = ["docker", "kubernetes", "redis", "aws", "react", "next.js", "kafka"];
            const isHighRisk = highRiskKeywords.some(kw => currentQuestion.topic.toLowerCase().includes(kw));
            const isBluff = isHighRisk && isShort;

            const skillName = currentQuestion.topic.split(' ')[0];

            return {
                score: score,
                answer_classification: classification,
                strong_points: isShort ? ["Stated basic intent."] : ["Demonstrated architectural awareness.", "Stated exact implementation libraries used."],
                gaps_in_answer: isShort ? ["Failed to detail the specific algorithms.", "Missing discussion on network borders."] : ["Could elaborate more on automated edge validation metrics."],
                is_bluff_detected: isBluff,
                optimized_star_answer: `SITUATION: When designing our platform core, we needed to implement ${currentQuestion.topic} under a tight demo timeline. TASK: My task was to configure the handler to remain resilient under concurrent threads. ACTION: I structured a virtualized rendering tree, setting memory offsets and cache locks. RESULT: This kept the UI thread free, reducing responsiveness latency by 65%.`,
                memory_updates: {
                    verified_skills: isBluff ? [] : [skillName],
                    unverified_skills: isBluff ? [skillName] : [],
                    difficulty_level: nextDifficulty
                }
            };
        }
    