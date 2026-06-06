/**
 * CareerLaunch AI — Client-Side Authentication Service
 * Implements beautiful glassmorphic Sign-In and Sign-Up modals,
 * manages login session state, and synchronizes the UI across the application.
 */

(function () {
    // Check if script is already loaded
    if (window.CareerLaunchAuth) return;

    // Configuration & State
    const AUTH_KEY = 'is_logged_in';
    const USER_KEY = 'user_email';
    const PROFILE_KEY = 'candidate_profile';
    const DEFAULT_USER = {
        name: 'Alex Mercer',
        email: 'leader@careerlaunch.ai',
        role: 'Senior Product Leader',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7nzzhp0naTkdPX7LmcrkWR7-Azryy97OZIBC6D2zsYv7drOhtePdafwgXfD_AdCa9z1Aub6ZOh-G1Pf93cwhEn88q6eDGZ3kXEychktXDXqZIQfGHtDVnFY6Zq52uZ9HXCovP4SUOdWHuBZLmWWlNDc-bhbwVMVBVvYiXXPgyiZEX2GUCcRwL5z1XisGP-w5ZbwnafL0wKstYv5_50u2O8Gk1DBLnv7L15b-IvqAqo1fZ0U1anqdyCuTRikEjHYpihRhso6cVSE2O'
    };

    // Inject Styles for the Modal
    const style = document.createElement('style');
    style.textContent = `
        .auth-modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(6, 6, 7, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }
        .auth-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .auth-modal-card {
            background-color: #111214;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            width: 100%;
            max-width: 420px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            position: relative;
            transform: scale(0.95) translateY(10px);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .auth-modal-overlay.active .auth-modal-card {
            transform: scale(1) translateY(0);
        }
        .auth-modal-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
        }
        .auth-input {
            background-color: #0A0A0B;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #e5e2e1;
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        .auth-input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
        }
        .auth-btn-primary {
            background-color: #ffffff;
            color: #141313;
            font-weight: 700;
            width: 100%;
            padding: 14px;
            border-radius: 9999px;
            font-size: 13px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .auth-btn-primary:hover {
            background-color: #f0f0f0;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
        .auth-btn-secondary {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: 600;
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .auth-btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }
        .auth-link {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 12px;
            transition: color 0.2s ease;
        }
        .auth-link:hover {
            color: #ffffff;
        }
        .auth-close {
            position: absolute;
            top: 20px;
            right: 20px;
            color: rgba(255, 255, 255, 0.4);
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .auth-close:hover {
            color: #ffffff;
        }
        .auth-glow-amber {
            position: absolute;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(251, 188, 5, 0.08) 0%, rgba(0,0,0,0) 70%);
            top: -50px;
            right: -50px;
            pointer-events: none;
        }
        .auth-glow-blue {
            position: absolute;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(66, 133, 244, 0.08) 0%, rgba(0,0,0,0) 70%);
            bottom: -50px;
            left: -50px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    // Modal Manager
    class AuthModal {
        constructor() {
            this.overlay = null;
            this.isSignUp = false;
        }

        create() {
            if (this.overlay) return;

            this.overlay = document.createElement('div');
            this.overlay.className = 'auth-modal-overlay';
            this.overlay.innerHTML = `
                <div class="auth-modal-card">
                    <button class="auth-close" id="auth-modal-close">&times;</button>
                    <div class="auth-glow-amber"></div>
                    <div class="auth-glow-blue"></div>
                    
                    <div class="text-center mb-8">
                        <h2 class="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2" id="auth-modal-title">
                            <span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
                            Sign In to CareerLaunch AI
                        </h2>
                        <p class="text-xs text-zinc-400 mt-2" id="auth-modal-subtitle">Enter your details to access your dashboard</p>
                    </div>

                    <form id="auth-modal-form" class="space-y-5">
                        <div class="space-y-1.5" id="auth-name-field" style="display: none;">
                            <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <input type="text" id="auth-name" class="auth-input" placeholder="Alex Mercer" autocomplete="name">
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <input type="email" id="auth-email" class="auth-input" placeholder="leader@careerlaunch.ai" required autocomplete="email">
                        </div>
                        <div class="space-y-1.5">
                            <label class="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                            <input type="password" id="auth-password" class="auth-input" placeholder="••••••••••••" required autocomplete="current-password">
                        </div>
                        
                        <button type="submit" class="auth-btn-primary mt-6" id="auth-submit-btn">Sign In</button>
                        
                        <div class="text-center pt-2">
                            <button type="button" class="auth-btn-secondary" id="auth-demo-btn">Sign In with Demo Account</button>
                        </div>

                        <div class="text-center mt-6 pt-4 border-t border-white/5">
                            <a href="#" class="auth-link" id="auth-switch-view">Don't have an account? Sign Up</a>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(this.overlay);

            // Bind events
            document.getElementById('auth-modal-close').addEventListener('click', () => this.close());
            document.getElementById('auth-modal-form').addEventListener('submit', (e) => this.handleSubmit(e));
            document.getElementById('auth-demo-btn').addEventListener('click', () => this.handleDemoLogin());
            document.getElementById('auth-switch-view').addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleView();
            });

            // Close on overlay click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });
        }

        open(isSignUp = false) {
            this.create();
            this.isSignUp = isSignUp;
            this.updateView();
            
            // Trigger browser reflow before class addition
            this.overlay.offsetHeight;
            this.overlay.classList.add('active');
            
            // Focus on input
            setTimeout(() => {
                const emailInput = document.getElementById('auth-email');
                if (emailInput) emailInput.focus();
            }, 100);
        }

        close() {
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }
        }

        toggleView() {
            this.isSignUp = !this.isSignUp;
            this.updateView();
        }

        updateView() {
            const title = document.getElementById('auth-modal-title');
            const subtitle = document.getElementById('auth-modal-subtitle');
            const nameField = document.getElementById('auth-name-field');
            const submitBtn = document.getElementById('auth-submit-btn');
            const switchLink = document.getElementById('auth-switch-view');
            const demoBtn = document.getElementById('auth-demo-btn');

            if (!title) return;

            if (this.isSignUp) {
                title.innerHTML = `<span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">rocket_launch</span> Create Account`;
                subtitle.textContent = 'Join CareerLaunch AI for executive analysis';
                nameField.style.display = 'block';
                submitBtn.textContent = 'Sign Up';
                switchLink.textContent = 'Already have an account? Sign In';
                demoBtn.parentElement.style.display = 'none';
            } else {
                title.innerHTML = `<span class="material-symbols-outlined text-white" style="font-variation-settings: 'FILL' 1;">rocket_launch</span> Sign In to CareerLaunch AI`;
                subtitle.textContent = 'Enter your details to access your dashboard';
                nameField.style.display = 'none';
                submitBtn.textContent = 'Sign In';
                switchLink.textContent = "Don't have an account? Sign Up";
                demoBtn.parentElement.style.display = 'block';
            }
        }

        handleSubmit(e) {
            e.preventDefault();
            const emailInput = document.getElementById('auth-email');
            const nameInput = document.getElementById('auth-name');
            
            const email = emailInput ? emailInput.value.trim() : DEFAULT_USER.email;
            let name = DEFAULT_USER.name;

            if (this.isSignUp && nameInput && nameInput.value.trim()) {
                name = nameInput.value.trim();
            } else if (email) {
                // Generate name from email
                const parts = email.split('@')[0].split(/[._-]/);
                name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            }

            const profile = {
                name: name,
                email: email,
                role: this.isSignUp ? 'Executive Candidate' : DEFAULT_USER.role,
                avatar: DEFAULT_USER.avatar
            };

            this.login(profile);
        }

        handleDemoLogin() {
            this.login(DEFAULT_USER);
        }

        login(profile) {
            localStorage.setItem(AUTH_KEY, 'true');
            localStorage.setItem(USER_KEY, profile.email);
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

            // Set FSM state to 1 on initial signup/login if it doesn't exist
            const fsmState = localStorage.getItem('fsm_state');
            if (!fsmState || parseInt(fsmState, 10) === 0) {
                localStorage.setItem('fsm_state', '1');
            }

            this.close();
            
            // Notify UI & reload/refresh
            window.dispatchEvent(new Event('authChange'));
            
            // Reload page to ensure all state checks pass and elements re-render
            window.location.reload();
        }
    }

    const authModal = new AuthModal();

    // Authentication Actions
    function performLogout(e) {
        if (e) e.preventDefault();
        
        // Keys to clean
        const keysToRemove = [
            AUTH_KEY, USER_KEY, PROFILE_KEY, 
            'resume_text', 'github_analysis', 'linkedin_profile', 
            'linkedin_analysis', 'fsm_state', 'job_analysis', 'groq_api_key'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to entry page
        window.location.href = 'profile-auditor.html';
    }

    function checkAuth() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    }

    function getProfile() {
        const profileStr = localStorage.getItem(PROFILE_KEY);
        if (profileStr) {
            try {
                return JSON.parse(profileStr);
            } catch (e) {
                return DEFAULT_USER;
            }
        }
        return null;
    }

    // Dynamic UI Synchronization
    function updateAuthUI() {
        const loggedIn = checkAuth();
        const profile = getProfile();

        // 1. Target TopNavBar elements (in profile-auditor.html and mock-interview.html)
        // Find action containers (divs that contain Sign In and Sign Up)
        const topNavActions = document.querySelectorAll('nav .flex.items-center.gap-4, nav .hidden.md\\:flex.items-center.gap-4');
        topNavActions.forEach(container => {
            // Check if this container is indeed the auth container (contains "Sign In" or "Sign Up" or avatar)
            const hasSignIn = container.textContent.includes('Sign In');
            const hasSignUp = container.textContent.includes('Sign Up');
            const hasProfile = container.querySelector('.auth-profile-pill') || container.querySelector('[id*="logout"]');
            
            if (hasSignIn || hasSignUp || hasProfile) {
                if (loggedIn && profile) {
                    // Replace with beautiful profile pill + sign out button
                    container.innerHTML = `
                        <div class="flex items-center gap-3 auth-profile-pill">
                            <div class="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
                                <img src="${profile.avatar}" alt="Avatar" class="w-full h-full object-cover">
                            </div>
                            <span class="hidden lg:inline text-xs text-on-surface-variant font-medium font-label-caps uppercase tracking-wider">${profile.name}</span>
                            <button id="auth-signout-btn" class="text-xs text-on-surface-variant hover:text-error hover:bg-error/10 border border-white/10 hover:border-error/20 px-3.5 py-1.5 rounded-full transition-all duration-300 font-label-caps uppercase tracking-wider">Sign Out</button>
                        </div>
                    `;
                    
                    const signoutBtn = container.querySelector('#auth-signout-btn');
                    if (signoutBtn) {
                        signoutBtn.addEventListener('click', performLogout);
                    }
                } else {
                    // Show Sign In and Sign Up buttons
                    container.innerHTML = `
                        <button id="auth-signin-trigger" class="text-on-surface-variant hover:text-primary transition-colors font-label-caps hover:bg-white/5 transition-all duration-300 px-4 py-2 rounded-md">Sign In</button>
                        <button id="auth-signup-trigger" class="bg-primary text-surface font-label-caps uppercase tracking-[0.18em] text-[12px] font-bold py-3 px-6 rounded-full hover:bg-white/90 transition-all scale-95 active:scale-90 flex items-center gap-2">
                            Sign Up
                            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    `;
                    
                    container.querySelector('#auth-signin-trigger').addEventListener('click', () => authModal.open(false));
                    container.querySelector('#auth-signup-trigger').addEventListener('click', () => authModal.open(true));
                }
            }
        });

        // 2. Sidebar Navigation adjustments (insights.html and team-planner.html)
        const sidebarLogoutBtns = document.querySelectorAll('.sidebar-logout, [id="sidebar-logout"]');
        sidebarLogoutBtns.forEach(btn => {
            // Re-bind click event to performLogout
            btn.addEventListener('click', performLogout);
            
            if (!loggedIn) {
                // Change Logout to Sign In in the sidebar
                btn.classList.remove('hover:text-error', 'hover:bg-error/10');
                btn.classList.add('hover:text-primary', 'hover:bg-primary/10');
                
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'login';
                
                const label = btn.querySelector('span:not(.material-symbols-outlined)');
                if (label) label.textContent = 'Sign In';
                
                // Remove href redirection and override with login open
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    authModal.open(false);
                });
            } else {
                // Ensure it looks like Logout
                btn.classList.remove('hover:text-primary', 'hover:bg-primary/10');
                btn.classList.add('hover:text-error', 'hover:bg-error/10');
                
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) icon.textContent = 'logout';
                
                const label = btn.querySelector('span:not(.material-symbols-outlined)');
                if (label) label.textContent = 'Logout';
            }
        });
        
        // 3. Update topnav avatar and greeting in Insights page header if exists
        const insightsAvatar = document.querySelector('.nav-top img[alt="User profile"]');
        const insightsGetStarted = document.querySelector('.nav-top button');
        
        if (insightsAvatar && profile) {
            insightsAvatar.src = profile.avatar;
        }
        
        if (insightsGetStarted) {
            if (loggedIn) {
                insightsGetStarted.style.display = 'none';
            } else {
                insightsGetStarted.style.display = 'block';
                insightsGetStarted.textContent = 'Sign In';
                insightsGetStarted.addEventListener('click', () => authModal.open(false));
            }
        }
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        updateAuthUI();
        
        // Listen for internal state changes
        window.addEventListener('authChange', updateAuthUI);
    });

    // Expose API globally
    window.CareerLaunchAuth = {
        openLogin: (isSignUp = false) => authModal.open(isSignUp),
        logout: performLogout,
        isLoggedIn: checkAuth,
        getProfile: getProfile
    };
})();
