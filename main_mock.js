
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            window.location.href = 'command-palette.html';
        }
    });

    let interview_memory = [];
    let currentQuestionData = null;
    let recognition = null;
    let isRecording = false;

    document.addEventListener('DOMContentLoaded', () => {
        const fsmState = localStorage.getItem('fsm_state');
        const gateWarning = document.getElementById('gate-warning-container');
        const setupView = document.getElementById('setup-view');
        const interviewContainer = document.getElementById('interview-container');

        // State Gating
        if (!fsmState || parseInt(fsmState, 10) < 3) {
            gateWarning.classList.remove('hidden');
            return;
        }

        // Show Setup View
        setupView.classList.remove('hidden');
        loadSetupData();
        initVoice();

        // Bind Setup Action
        document.getElementById('start-interview-btn').addEventListener('click', startInterviewSession);
        
        // Bind Interview Actions
        document.getElementById('submit-btn').addEventListener('click', submitUserResponse);
        document.getElementById('skip-btn').addEventListener('click', skipActiveQuestion);
        document.getElementById('finish-btn').addEventListener('click', downloadPDFReport);
    });

    function loadSetupData() {
        const groqKeyInput = document.getElementById('groq-key-input');
        const savedKey = localStorage.getItem('groq_api_key');
        if (savedKey) {
            groqKeyInput.value = savedKey;
        }

        const jobAnalysisStr = localStorage.getItem('job_analysis');
        if (jobAnalysisStr) {
            try {
                const jobAnalysis = JSON.parse(jobAnalysisStr);
                const missingSkills = jobAnalysis.missing_skills || [];
                if (missingSkills.length > 0) {
                    const box = document.getElementById('missing-skills-box');
                    const list = document.getElementById('missing-skills-list');
                    list.innerHTML = '';
                    missingSkills.forEach(skill => {
                        const badge = document.createElement('span');
                        badge.className = 'bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-medium';
                        badge.textContent = skill;
                        list.appendChild(badge);
                    });
                    box.classList.remove('hidden');
                }
            } catch (e) {
                console.error("Failed to parse job_analysis from localStorage:", e);
            }
        }
    }

    async function startInterviewSession() {
        const groqKeyInput = document.getElementById('groq-key-input');
        const apiKey = groqKeyInput.value.trim();
        if (!apiKey) {
            alert("Please provide a Groq API Key to power the Interview Coach.");
            return;
        }
        localStorage.setItem('groq_api_key', apiKey);

        const setupView = document.getElementById('setup-view');
        const interviewContainer = document.getElementById('interview-container');
        const loadingOverlay = document.getElementById('interview-loading');
        const loadingText = document.getElementById('loading-text');

        const personality = document.getElementById('personality-select').value;
        const difficulty = document.getElementById('difficulty-select').value;

        // Set badges
        document.getElementById('personality-badge').textContent = personality;
        document.getElementById('difficulty-badge').textContent = difficulty;

        // Load target role if exists
        let targetRole = "Senior Product Designer · TechCorp Inc.";
        const jobAnalysisStr = localStorage.getItem('job_analysis');
        if (jobAnalysisStr) {
            try {
                const jobAnalysis = JSON.parse(jobAnalysisStr);
                // Try to infer a title or just stick with standard
            } catch(e){}
        }
        document.getElementById('interview-subtitle').textContent = targetRole;

        // Transition views
        setupView.classList.add('hidden');
        interviewContainer.classList.remove('hidden');
        loadingOverlay.classList.remove('hidden');
        loadingText.textContent = "AI Agent preparing first question...";

        // Fetch first question
        try {
            const jobAnalysis = JSON.parse(localStorage.getItem('job_analysis') || '{}');
            const missingSkills = jobAnalysis.missing_skills || [];

            const systemPrompt = `You are a professional Interview Coach acting as a ${personality}.
Your target candidate is interviewing for the role of ${targetRole} at a difficulty level of ${difficulty}.
Based on their profile, they are missing or weak in these key skills: ${missingSkills.join(', ')}.

Your goal is to conduct a highly realistic, interactive mock interview. You must prioritize generating questions that specifically target the candidate's missing skills to evaluate if they can handle them or explain how they address those gaps.
Generate ONLY the first interview question. The question should be challenging, behavioral or situational, and highly relevant to the role and the missing skills.

Respond ONLY with a JSON object in this format:
{
  "question": "The interview question",
  "focus": "The core skill or competency being tested",
  "duration": "Suggested duration (e.g. 2:00 or 2:30)"
}
Do not write any other text. No explanation. No markdown wrapper. Only valid JSON.`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Generate the first question to initiate the mock interview session.' }
                    ],
                    temperature: 0.7,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            let contentText = data.choices[0].message.content.trim();
            if (contentText.startsWith('```json')) contentText = contentText.substring(7);
            if (contentText.endsWith('```')) contentText = contentText.substring(0, contentText.length - 3);
            contentText = contentText.trim();

            currentQuestionData = JSON.parse(contentText);
            renderAIQuestion(currentQuestionData.question, currentQuestionData.focus, currentQuestionData.duration);
        } catch (error) {
            console.error(error);
            alert(`Failed to load first question: ${error.message}. Please check your API key and try again.`);
            // Go back to setup
            setupView.classList.remove('hidden');
            interviewContainer.classList.add('hidden');
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function renderAIQuestion(question, focus, duration) {
        const chatHistory = document.getElementById('chat-history');
        const questionHtml = `
            <div class="flex gap-stack-md transition-all duration-500 transform translate-y-4 opacity-0 scale-95" style="animation: fadeInUp 0.4s forwards;">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10">
                    <span class="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                </div>
                <div class="bg-surface-container-low rounded-xl rounded-tl-none p-5 border border-white/5 relative group flex-grow">
                    <div class="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-blue-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <p class="font-body-lg text-body-lg text-primary mb-4 leading-relaxed">${question}</p>
                    <div class="flex items-center gap-4 text-on-surface-variant/60 font-label-caps text-label-caps">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">psychology</span> ${focus}</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">timer</span> ${duration} Target</span>
                    </div>
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', questionHtml);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function renderUserAnswer(answer) {
        const chatHistory = document.getElementById('chat-history');
        const userAvatar = document.getElementById('user-avatar').src;
        const answerHtml = `
            <div class="flex gap-stack-md flex-row-reverse transition-all duration-500 transform translate-y-4 opacity-0 scale-95" style="animation: fadeInUp 0.4s forwards;">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-white/10">
                    <img alt="User Profile" class="w-full h-full object-cover" src="${userAvatar}"/>
                </div>
                <div class="bg-surface-container-low rounded-xl rounded-tr-none p-5 border border-white/5 relative group flex-grow">
                    <p class="font-body-md text-body-md text-primary leading-relaxed">${answer}</p>
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', answerHtml);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function renderEvaluationScorecard(score, strengths, growthAreas) {
        const chatHistory = document.getElementById('chat-history');
        
        let strengthsLi = strengths.map(s => `
            <li class="flex gap-3 text-body-md text-on-surface">
                <span class="material-symbols-outlined text-green-400 text-[18px] mt-0.5">add</span>
                <span>${s}</span>
            </li>
        `).join('');

        let growthLi = growthAreas.map(g => `
            <li class="flex gap-3 text-body-md text-on-surface">
                <span class="material-symbols-outlined text-orange-400 text-[18px] mt-0.5">arrow_upward</span>
                <span>${g}</span>
            </li>
        `).join('');

        const scoreColorClass = score >= 7 ? 'text-green-400' : 'text-orange-400';

        const scorecardHtml = `
            <div class="bg-[#111214] rounded-2xl border border-white/5 p-panel-padding relative overflow-hidden transition-all duration-500 transform translate-y-4 opacity-0 scale-95 ml-12" style="animation: fadeInUp 0.4s forwards;">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full"></div>
                <div class="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                    <h3 class="font-headline-sm text-headline-sm text-primary flex items-center gap-3">
                        <span class="material-symbols-outlined text-green-400">check_circle</span>
                        Performance Evaluation
                    </h3>
                    <div class="text-right">
                        <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Score</span>
                        <span class="font-headline-sm text-headline-sm ${scoreColorClass}">${score}/10</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                    <div class="space-y-4">
                        <h4 class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Strengths</h4>
                        <ul class="space-y-3">
                            ${strengthsLi}
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h4 class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Growth Areas</h4>
                        <ul class="space-y-3">
                            ${growthLi}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        chatHistory.insertAdjacentHTML('beforeend', scorecardHtml);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function submitUserResponse() {
        const userResponseInput = document.getElementById('user-response');
        const responseText = userResponseInput.value.trim();
        if (!responseText) {
            alert("Please type or speak your response before submitting.");
            return;
        }

        const apiKey = localStorage.getItem('groq_api_key');
        const personality = document.getElementById('personality-badge').textContent;
        const difficulty = document.getElementById('difficulty-badge').textContent;
        const targetRole = document.getElementById('interview-subtitle').textContent;
        
        const loadingOverlay = document.getElementById('interview-loading');
        const loadingText = document.getElementById('loading-text');

        // Render response immediately
        renderUserAnswer(responseText);
        userResponseInput.value = '';

        loadingOverlay.classList.remove('hidden');
        loadingText.textContent = "AI Coach evaluating answer...";

        try {
            const jobAnalysis = JSON.parse(localStorage.getItem('job_analysis') || '{}');
            const missingSkills = jobAnalysis.missing_skills || [];

            // Compile conversational context
            const contextHistory = interview_memory.map((m, idx) => `
Question ${idx+1}: ${m.question}
Candidate Answer ${idx+1}: ${m.answer}
Score ${idx+1}/10. Feedback: ${m.strengths.join(', ')} | ${m.growth_areas.join(', ')}
`).join('\n');

            const evalSystemPrompt = `You are an expert Interview Coach acting as a ${personality}.
Evaluate the candidate's response to the last question for a ${targetRole} role at ${difficulty} difficulty.

Last Question: "${currentQuestionData.question}"
Candidate Response: "${responseText}"

Evaluate the answer:
1. Score: Rate the answer out of 10. Be realistic, critical, and constructive.
2. Feedback: Formulate feedback using the STAR method (Situation, Task, Action, Result). List exactly 2 Strengths and exactly 2 Growth Areas.
3. Adaptive Next Question: Generate the NEXT question.
   - Adjust difficulty dynamically: if the candidate struggled, ask a slightly more guided or introductory question; if they excelled, challenge them with a deeper scenario.
   - Prioritize evaluating remaining missing skills if any: ${missingSkills.join(', ')}.

Respond ONLY with a JSON object in this format:
{
  "score": 7,
  "strengths": ["Strength 1 text", "Strength 2 text"],
  "growth_areas": ["Growth area 1 text", "Growth area 2 text"],
  "next_question": "The next interview question text...",
  "next_question_focus": "The focus of the next question",
  "next_question_duration": "The target duration (e.g. 2:30)"
}
Do not write any other text. No explanation. No markdown wrapper. Only valid JSON.`;

            const userPrompt = `Conversation History so far:
${contextHistory}

Evaluate the latest response.`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: evalSystemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            let contentText = data.choices[0].message.content.trim();
            if (contentText.startsWith('```json')) contentText = contentText.substring(7);
            if (contentText.endsWith('```')) contentText = contentText.substring(0, contentText.length - 3);
            contentText = contentText.trim();

            const evalResult = JSON.parse(contentText);

            // Record to memory
            interview_memory.push({
                question: currentQuestionData.question,
                answer: responseText,
                score: evalResult.score,
                strengths: evalResult.strengths,
                growth_areas: evalResult.growth_areas
            });

            // Render evaluation scorecard
            renderEvaluationScorecard(evalResult.score, evalResult.strengths, evalResult.growth_areas);

            // Render next question
            currentQuestionData = {
                question: evalResult.next_question,
                focus: evalResult.next_question_focus,
                duration: evalResult.next_question_duration
            };

            setTimeout(() => {
                renderAIQuestion(currentQuestionData.question, currentQuestionData.focus, currentQuestionData.duration);
            }, 1000);

        } catch (error) {
            console.error(error);
            alert(`Evaluation failed: ${error.message}`);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    async function skipActiveQuestion() {
        const userResponseInput = document.getElementById('user-response');
        userResponseInput.value = '';

        const apiKey = localStorage.getItem('groq_api_key');
        const personality = document.getElementById('personality-badge').textContent;
        const difficulty = document.getElementById('difficulty-badge').textContent;
        const targetRole = document.getElementById('interview-subtitle').textContent;
        
        const loadingOverlay = document.getElementById('interview-loading');
        const loadingText = document.getElementById('loading-text');

        loadingOverlay.classList.remove('hidden');
        loadingText.textContent = "AI Coach skipping question and preparing next...";

        try {
            const jobAnalysis = JSON.parse(localStorage.getItem('job_analysis') || '{}');
            const missingSkills = jobAnalysis.missing_skills || [];

            const systemPrompt = `You are a professional Interview Coach acting as a ${personality}.
Your target candidate is interviewing for the role of ${targetRole} at a difficulty level of ${difficulty}.
The candidate decided to skip the last question: "${currentQuestionData.question}".
Please generate a completely new question that targets the candidate's missing skills: ${missingSkills.join(', ')}.

Respond ONLY with a JSON object in this format:
{
  "question": "The interview question",
  "focus": "The core skill or competency being tested",
  "duration": "Suggested duration (e.g. 2:00 or 2:30)"
}
Do not write any other text. No explanation. No markdown wrapper. Only valid JSON.`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: 'Generate a new skipped question replacement.' }
                    ],
                    temperature: 0.7,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            let contentText = data.choices[0].message.content.trim();
            if (contentText.startsWith('```json')) contentText = contentText.substring(7);
            if (contentText.endsWith('```')) contentText = contentText.substring(0, contentText.length - 3);
            contentText = contentText.trim();

            currentQuestionData = JSON.parse(contentText);
            renderAIQuestion(currentQuestionData.question, currentQuestionData.focus, currentQuestionData.duration);
        } catch (error) {
            console.error(error);
            alert(`Failed to skip question: ${error.message}`);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function initVoice() {
        const micBtn = document.getElementById('mic-btn');
        const micIcon = document.getElementById('mic-icon');
        const micStatusText = document.getElementById('mic-status-text');
        const userResponse = document.getElementById('user-response');

        if (!micBtn) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            micBtn.title = "Voice Input not supported in this browser";
            micBtn.style.opacity = "0.5";
            micBtn.addEventListener('click', () => {
                alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge for voice inputs.");
            });
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let baseText = "";

        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add('bg-red-500/20', 'border', 'border-red-500/50');
            micBtn.classList.remove('bg-white/10');
            micIcon.textContent = 'stop';
            micIcon.classList.add('text-red-500');
            micStatusText.classList.remove('hidden');
            baseText = userResponse.value;
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            userResponse.value = baseText + (baseText ? ' ' : '') + finalTranscript + interimTranscript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
        };

        micBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (err) {
                    console.error("Failed to start speech recognition:", err);
                }
            }
        });

        function stopRecording() {
            isRecording = false;
            micBtn.classList.remove('bg-red-500/20', 'border', 'border-red-500/50');
            micBtn.classList.add('bg-white/10');
            micIcon.textContent = 'mic';
            micIcon.classList.remove('text-red-500');
            micStatusText.classList.add('hidden');
        }
    }

    function downloadPDFReport() {
        if (interview_memory.length === 0) {
            alert("No interview responses recorded yet. Answer at least one question to download a scorecard.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Color Palette
        const primaryColor = [20, 19, 19];
        const accentColor = [66, 133, 244];
        const grayColor = [100, 116, 139];
        const successColor = [16, 185, 129];
        const warningColor = [249, 115, 22];

        let y = 20;

        function addText(text, fontSize, style = 'normal', color = [0, 0, 0], spacing = 8) {
            doc.setFontSize(fontSize);
            doc.setFont('Helvetica', style);
            doc.setTextColor(color[0], color[1], color[2]);
            
            const lines = doc.splitTextToSize(text, 170);
            for (let line of lines) {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 20, y);
                y += spacing;
            }
        }

        // Title
        addText("CareerLaunch AI - Interview Scorecard", 22, 'bold', accentColor, 12);
        
        const dateStr = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        const personality = document.getElementById('personality-badge').textContent;
        const difficulty = document.getElementById('difficulty-badge').textContent;
        const targetRole = document.getElementById('interview-subtitle').textContent;

        addText(`Session Date: ${dateStr}`, 10, 'normal', grayColor, 6);
        addText(`Interviewer Personality: ${personality}`, 10, 'normal', primaryColor, 6);
        addText(`Difficulty Level: ${difficulty}`, 10, 'normal', primaryColor, 6);
        addText(`Target Role: ${targetRole}`, 10, 'normal', primaryColor, 12);

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(20, y, 190, y);
        y += 10;

        // Overall Metrics
        let totalScore = 0;
        interview_memory.forEach(m => totalScore += m.score);
        const avgScore = (totalScore / interview_memory.length).toFixed(1);

        addText("Performance Summary", 16, 'bold', primaryColor, 8);
        addText(`Total Questions Answered: ${interview_memory.length}`, 11, 'normal', primaryColor, 6);
        addText(`Average Score: ${avgScore} / 10`, 12, 'bold', avgScore >= 7 ? successColor : warningColor, 14);

        // Divider Line
        doc.line(20, y, 190, y);
        y += 10;

        // Breakdown Section
        addText("Question & Answer Breakdown", 16, 'bold', primaryColor, 12);

        interview_memory.forEach((m, idx) => {
            // Check spacing before adding a new block
            if (y > 240) {
                doc.addPage();
                y = 20;
            }

            addText(`Q${idx + 1}: ${m.question}`, 12, 'bold', accentColor, 8);
            
            addText(`Your Answer:`, 10, 'bold', grayColor, 6);
            addText(m.answer, 10, 'normal', primaryColor, 8);
            
            addText(`Score: ${m.score}/10`, 10, 'bold', m.score >= 7 ? successColor : warningColor, 8);
            
            addText(`Strengths:`, 10, 'bold', successColor, 6);
            m.strengths.forEach(s => {
                addText(`• ${s}`, 9, 'normal', primaryColor, 6);
            });
            y += 2;
            
            addText(`Growth Areas:`, 10, 'bold', warningColor, 6);
            m.growth_areas.forEach(g => {
                addText(`• ${g}`, 9, 'normal', primaryColor, 6);
            });
            
            y += 8;

            if (idx < interview_memory.length - 1) {
                if (y > 260) {
                    doc.addPage();
                    y = 20;
                } else {
                    doc.setDrawColor(241, 245, 249);
                    doc.line(20, y, 190, y);
                    y += 10;
                }
            }
        });

        // Trigger Download
        doc.save(`CareerLaunch_Interview_Scorecard_${new Date().getTime()}.pdf`);
    }
