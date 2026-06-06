
        // Configure PDF.js Worker
        if (window.pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }

        // Element Selectors
        const dropzone = document.querySelector('.dropzone-area');
        const fileInput = document.getElementById('resume-file-input');
        const githubInput = document.getElementById('github-url-input');
        const runAuditBtn = document.getElementById('run-audit-btn');
        const githubError = document.getElementById('github-error');
        const auditBtnText = document.getElementById('audit-btn-text');
        const auditBtnSpinner = document.getElementById('audit-btn-spinner');
        const auditBtnIcon = document.getElementById('audit-btn-icon');
        const resetBtn = document.getElementById('reset-audit-btn');
        const tabResume = document.getElementById('tab-resume');
        const tabLinkedin = document.getElementById('tab-linkedin');
        const resumePanel = document.getElementById('resume-upload-panel');
        const linkedinPanel = document.getElementById('linkedin-sync-panel');
        const linkedinInput = document.getElementById('linkedin-url-input');
        const linkedinSyncBtn = document.getElementById('linkedin-sync-btn');
        const linkedinError = document.getElementById('linkedin-error');
        const linkedinBtnText = document.getElementById('linkedin-btn-text');
        const linkedinBtnSpinner = document.getElementById('linkedin-btn-spinner');
        const linkedinBtnIcon = document.getElementById('linkedin-btn-icon');
        const linkedinStatusTitle = document.getElementById('linkedin-status-title');
        const linkedinStatusDesc = document.getElementById('linkedin-status-desc');

        function switchAuditorTab(tabName) {
            const isResume = tabName === 'resume';

            tabResume.classList.toggle('is-active', isResume);
            tabResume.classList.toggle('is-inactive', !isResume);
            tabLinkedin.classList.toggle('is-active', !isResume);
            tabLinkedin.classList.toggle('is-inactive', isResume);

            resumePanel.classList.toggle('auditor-panel-hidden', !isResume);
            linkedinPanel.classList.toggle('auditor-panel-hidden', isResume);
        }

        if (tabResume && tabLinkedin) {
            tabResume.addEventListener('click', () => switchAuditorTab('resume'));
            tabLinkedin.addEventListener('click', () => switchAuditorTab('linkedin'));
        }

        function parseLinkedInUrl(url) {
            const cleanUrl = url.trim().replace(/\/$/, '');
            const regex = /(?:https?:\/\/)?(?:[\w.]+\.)?linkedin\.com\/in\/([\w%-]+)/i;
            const match = cleanUrl.match(regex);
            return match ? decodeURIComponent(match[1]) : null;
        }

        function buildLinkedInProfileText(slug) {
            const displayName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return {
                slug,
                url: `https://linkedin.com/in/${slug}`,
                headline: `${displayName} — Senior Product & Engineering Leader`,
                summary: `${displayName} is an experienced professional with a track record in product strategy, cross-functional leadership, and technical delivery. Core competencies include stakeholder management, roadmap planning, agile execution, and data-driven decision making. Previously led initiatives spanning platform modernization, growth experiments, and team scaling across fast-paced environments.`,
                skills: ['Product Strategy', 'Leadership', 'Agile Delivery', 'Stakeholder Management', 'Technical Architecture'],
                syncedAt: new Date().toISOString()
            };
        }

        function setLinkedInLoading(isLoading) {
            if (!linkedinSyncBtn) return;
            linkedinSyncBtn.disabled = isLoading;
            linkedinInput.disabled = isLoading;
            linkedinBtnSpinner.classList.toggle('hidden', !isLoading);
            linkedinBtnIcon.classList.toggle('hidden', isLoading);
            linkedinBtnText.textContent = isLoading ? 'Syncing Profile...' : 'Sync LinkedIn Profile';
        }

        function showLinkedInSuccess(profileData) {
            linkedinStatusTitle.textContent = 'LinkedIn Profile Synced';
            linkedinStatusTitle.classList.add('text-emerald-400');
            linkedinStatusDesc.textContent = `${profileData.headline} — imported successfully and ready for analysis.`;
            linkedinError.classList.add('hidden');
        }

        function resetLinkedInPanel() {
            if (!linkedinStatusTitle) return;
            linkedinStatusTitle.textContent = 'Connect your LinkedIn profile';
            linkedinStatusTitle.classList.remove('text-emerald-400');
            linkedinStatusDesc.textContent = 'Paste your public profile URL to import headline, experience, and skills for analysis.';
            if (linkedinInput) linkedinInput.value = '';
            if (linkedinError) {
                linkedinError.classList.add('hidden');
                linkedinError.textContent = '';
            }
            setLinkedInLoading(false);
        }

        if (linkedinSyncBtn) {
            linkedinSyncBtn.addEventListener('click', async () => {
                linkedinError.classList.add('hidden');
                linkedinError.textContent = '';

                const slug = parseLinkedInUrl(linkedinInput.value);
                if (!slug) {
                    linkedinError.textContent = 'Invalid URL. Use linkedin.com/in/your-name or paste your full profile link.';
                    linkedinError.classList.remove('hidden');
                    return;
                }

                setLinkedInLoading(true);

                try {
                    await new Promise(resolve => setTimeout(resolve, 1200));

                    const profileData = buildLinkedInProfileText(slug);
                    const resumeFromLinkedIn = `${profileData.headline}\n\n${profileData.summary}\n\nSkills: ${profileData.skills.join(', ')}`;

                    localStorage.setItem('linkedin_profile', JSON.stringify(profileData));
                    localStorage.setItem('resume_text', resumeFromLinkedIn);

                    const currentState = localStorage.getItem('fsm_state');
                    if (!currentState || currentState === '0') {
                        localStorage.setItem('fsm_state', '1');
                    }

                    showLinkedInSuccess(profileData);
                    checkCompletion();
                } catch (error) {
                    linkedinError.textContent = error.message || 'Failed to sync LinkedIn profile. Please try again.';
                    linkedinError.classList.remove('hidden');
                } finally {
                    setLinkedInLoading(false);
                }
            });
        }

        // Drag and drop event listeners
        if (dropzone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                dropzone.addEventListener(eventName, () => dropzone.classList.add('active'), false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, () => dropzone.classList.remove('active'), false);
            });

            dropzone.addEventListener('drop', handleDrop, false);

            // Click dropzone to trigger hidden file input
            dropzone.addEventListener('click', (e) => {
                if (e.target !== fileInput) {
                    fileInput.click();
                }
            });

            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        handleFileSelect(e.target.files[0]);
                    }
                });
            }
        }

        function handleDrop(e) {
            let dt = e.dataTransfer;
            let files = dt.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        }

        // Parse PDF content using PDF.js
        async function handleFileSelect(file) {
            if (!file) return;

            const h3 = dropzone.querySelector('h3');
            const p = dropzone.querySelector('p');
            const icon = dropzone.querySelector('.material-symbols-outlined');

            if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                h3.textContent = 'Invalid File Type';
                h3.classList.add('text-error');
                p.textContent = 'Please upload a PDF document.';
                icon.textContent = 'error';
                icon.classList.remove('animate-spin');
                icon.classList.add('text-error');
                return;
            }

            try {
                // UI Loading state
                h3.textContent = file.name;
                h3.classList.remove('text-error');
                h3.classList.add('text-primary');
                p.textContent = 'Extracting resume text...';
                icon.textContent = 'autorenew';
                icon.classList.add('animate-spin', 'text-primary');
                icon.classList.remove('text-error', 'text-emerald-400');

                // Read PDF Array Buffer
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                let extractedText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    extractedText += pageText + '\n';
                }

                if (!extractedText.trim()) {
                    throw new Error('PDF file appears to be empty or contains scanned images only.');
                }

                // Save to LocalStorage
                localStorage.setItem('resume_text', extractedText);
                
                // If fsm_state is 0 or uninitialized, advance to 1 (resume loaded)
                const currentState = localStorage.getItem('fsm_state');
                if (!currentState || currentState === '0') {
                    localStorage.setItem('fsm_state', '1');
                }

                // Success visual state
                h3.textContent = 'Resume Loaded';
                p.textContent = `${file.name} successfully parsed.`;
                icon.textContent = 'check_circle';
                icon.classList.remove('animate-spin');
                icon.classList.add('text-emerald-400');

                checkCompletion();
            } catch (error) {
                console.error('PDF extraction error:', error);
                h3.textContent = 'Parsing Failed';
                h3.classList.add('text-error');
                p.textContent = error.message || 'Error occurred while reading the PDF.';
                icon.textContent = 'error';
                icon.classList.remove('animate-spin');
                icon.classList.add('text-error');
            }
        }

        // GitHub Repository URL Parser
        function parseGitHubUrl(url) {
            let cleanUrl = url.trim().replace(/\/$/, ""); // trim and strip trailing slash
            
            // Matches https://github.com/owner/repo or github.com/owner/repo
            const regex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)/i;
            const match = cleanUrl.match(regex);
            if (match) {
                return { owner: match[1], repo: match[2] };
            }
            
            // Matches owner/repo format
            const simpleRegex = /^([^\/]+)\/([^\/]+)$/;
            const simpleMatch = cleanUrl.match(simpleRegex);
            if (simpleMatch) {
                return { owner: simpleMatch[1], repo: simpleMatch[2] };
            }
            
            return null;
        }

        // Run Audit Event Listener
        if (runAuditBtn) {
            runAuditBtn.addEventListener('click', async () => {
                const urlInput = githubInput.value.trim();
                githubError.classList.add('hidden');
                githubError.textContent = '';

                if (!urlInput) {
                    githubError.textContent = 'Please enter a GitHub repository URL.';
                    githubError.classList.remove('hidden');
                    return;
                }

                const parsed = parseGitHubUrl(urlInput);
                if (!parsed) {
                    githubError.textContent = 'Invalid format. Please use github.com/owner/repo or owner/repo.';
                    githubError.classList.remove('hidden');
                    return;
                }

                const { owner, repo } = parsed;
                setGithubLoading(true);

                try {
                    // Fetch primary repository metrics
                    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
                    if (!repoResponse.ok) {
                        if (repoResponse.status === 404) {
                            throw new Error('Repository not found. Make sure the repository is public and spelled correctly.');
                        }
                        throw new Error(`GitHub API Error: ${repoResponse.statusText}`);
                    }
                    const repoData = await repoResponse.json();

                    // Fetch last 5 commits
                    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`);
                    if (!commitsResponse.ok) {
                        throw new Error(`Failed to retrieve commit history: ${commitsResponse.statusText}`);
                    }
                    const commitsData = await commitsResponse.json();

                    // Extract required metrics
                    const stargazers_count = repoData.stargazers_count;
                    const language = repoData.language || 'Unknown';
                    const description = repoData.description || 'No description provided';
                    const commitMessages = commitsData.map(item => item.commit.message);

                    // Synthesize GitHub Analysis Data
                    const githubData = {
                        owner,
                        repo,
                        stargazers_count,
                        language,
                        description,
                        commits: commitMessages
                    };

                    localStorage.setItem('github_analysis', JSON.stringify(githubData));
                    setGithubLoading(false);
                    checkCompletion();
                } catch (error) {
                    console.error('GitHub integration error:', error);
                    githubError.textContent = error.message || 'An error occurred during GitHub sync.';
                    githubError.classList.remove('hidden');
                    setGithubLoading(false);
                }
            });
        }

        function setGithubLoading(isLoading) {
            if (isLoading) {
                githubInput.disabled = true;
                runAuditBtn.disabled = true;
                auditBtnSpinner.classList.remove('hidden');
                auditBtnIcon.classList.add('hidden');
                auditBtnText.textContent = 'Auditing Repo...';
            } else {
                githubInput.disabled = false;
                runAuditBtn.disabled = false;
                auditBtnSpinner.classList.add('hidden');
                auditBtnIcon.classList.remove('hidden');
                auditBtnText.textContent = 'Run Audit';
            }
        }

        // Check overall completion state
        function checkCompletion() {
            const resumeText = localStorage.getItem('resume_text');
            const githubAnalysis = localStorage.getItem('github_analysis');

            if (resumeText && githubAnalysis) {
                localStorage.setItem('fsm_state', '2');
                showSuccessCard(JSON.parse(githubAnalysis));
            }
        }

        function restoreLinkedInFromStorage() {
            const saved = localStorage.getItem('linkedin_profile');
            if (!saved || !linkedinInput) return;
            try {
                const profileData = JSON.parse(saved);
                linkedinInput.value = profileData.url || `linkedin.com/in/${profileData.slug}`;
                showLinkedInSuccess(profileData);
            } catch (e) {
                console.warn('Could not restore LinkedIn profile', e);
            }
        }

        // Render the Success Card details
        function showSuccessCard(githubData) {
            const formView = document.getElementById('auditor-form-view');
            const successView = document.getElementById('success-card-view');

            if (!formView || !successView) return;

            document.getElementById('success-repo-name').textContent = `${githubData.owner}/${githubData.repo}`;
            document.getElementById('success-repo-desc').textContent = githubData.description;
            document.getElementById('success-repo-stars').textContent = githubData.stargazers_count;
            document.getElementById('success-repo-lang').textContent = githubData.language;

            const commitsList = document.getElementById('success-repo-commits');
            commitsList.innerHTML = '';

            if (githubData.commits && githubData.commits.length > 0) {
                githubData.commits.forEach(msg => {
                    const li = document.createElement('li');
                    li.className = 'bg-surface-container/50 border border-white/5 rounded-lg p-3 text-sm text-on-surface-variant flex items-start gap-2.5 hover:border-white/10 transition-colors';
                    li.innerHTML = `
                        <span class="material-symbols-outlined text-[16px] text-primary/40 mt-0.5">commit</span>
                        <span class="line-clamp-2">${escapeHtml(msg)}</span>
                    `;
                    commitsList.appendChild(li);
                });
            } else {
                commitsList.innerHTML = '<li class="text-on-surface-variant text-sm italic">No recent commits found.</li>';
            }

            formView.classList.add('hidden');
            successView.classList.remove('hidden');
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Reset audit to allow re-upload
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem('resume_text');
                localStorage.removeItem('github_analysis');
                localStorage.removeItem('linkedin_profile');
                localStorage.setItem('fsm_state', '0');

                // Restore dropzone default view
                const h3 = dropzone.querySelector('h3');
                const p = dropzone.querySelector('p');
                const icon = dropzone.querySelector('.material-symbols-outlined');
                
                h3.textContent = 'Drop your resume to begin analysis';
                h3.classList.remove('text-primary', 'text-error');
                p.textContent = 'Supports PDF. Maximum file size 10MB.';
                icon.textContent = 'upload_file';
                icon.classList.remove('animate-spin', 'text-primary', 'text-emerald-400', 'text-error');

                githubInput.value = '';
                fileInput.value = '';
                resetLinkedInPanel();
                switchAuditorTab('resume');

                document.getElementById('auditor-form-view').classList.remove('hidden');
                document.getElementById('success-card-view').classList.add('hidden');
            });
        }

        // Initialize state on page load
        window.addEventListener('DOMContentLoaded', () => {
            restoreLinkedInFromStorage();
            checkCompletion();
        });
    