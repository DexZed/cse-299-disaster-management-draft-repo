/**
 * Admin Login Module
 * Handles authentication and session management
 * Author: Admin Dashboard Team
 * Date: November 13, 2025
 */

// Authentication Configuration
const AuthConfig = {
    // Valid credentials (In production, this should be handled by backend API)
    validUsers: [
        {
            username: 'admin',
            password: 'admin123',
            role: 'Super Admin',
            email: 'admin@resourcemanagement.com',
            permissions: ['read', 'write', 'delete', 'manage_users']
        },
        {
            username: 'manager',
            password: 'manager123',
            role: 'Manager',
            email: 'manager@resourcemanagement.com',
            permissions: ['read', 'write']
        },
        {
            username: 'coordinator',
            password: 'coord123',
            role: 'Coordinator',
            email: 'coordinator@resourcemanagement.com',
            permissions: ['read']
        }
    ],

    // Storage keys
    sessionKey: 'adminSession',
    rememberMeKey: 'adminRememberMe',

    // Session timeout (in milliseconds)
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

// Authentication Manager Class
class AuthManager {
    constructor(config) {
        this.config = config;
        this.currentUser = null;
    }

    /**
     * Authenticate user with username and password
     * @param {string} username 
     * @param {string} password 
     * @returns {Object|null} User object if authenticated, null otherwise
     */
    authenticate(username, password) {
        const user = this.config.validUsers.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            // Don't store password in session
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    }

    /**
     * Create a new session for authenticated user
     * @param {Object} user 
     * @param {boolean} rememberMe 
     */
    createSession(user, rememberMe = false) {
        const sessionData = {
            user: user,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.config.sessionTimeout).toISOString(),
            isAuthenticated: true
        };

        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem(this.config.sessionKey, JSON.stringify(sessionData));

        // Store in localStorage if remember me is checked (persists after browser close)
        if (rememberMe) {
            localStorage.setItem(this.config.rememberMeKey, JSON.stringify(sessionData));
        }

        this.currentUser = user;
        return sessionData;
    }

    /**
     * Check if there's an existing valid session
     * @returns {Object|null} Session data if valid, null otherwise
     */
    checkSession() {
        // Check sessionStorage first
        let sessionData = sessionStorage.getItem(this.config.sessionKey);

        // If not in sessionStorage, check localStorage (remember me)
        if (!sessionData) {
            sessionData = localStorage.getItem(this.config.rememberMeKey);
        }

        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);

                // Check if session has expired
                if (new Date(session.expiresAt) > new Date()) {
                    this.currentUser = session.user;
                    return session;
                } else {
                    // Session expired, clear it
                    this.destroySession();
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                this.destroySession();
            }
        }

        return null;
    }

    /**
     * Destroy current session (logout)
     */
    destroySession() {
        sessionStorage.removeItem(this.config.sessionKey);
        localStorage.removeItem(this.config.rememberMeKey);
        this.currentUser = null;
    }

    /**
     * Get current authenticated user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user has specific permission
     * @param {string} permission 
     * @returns {boolean}
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }

    /**
     * Update session expiration time
     */
    refreshSession() {
        const session = this.checkSession();
        if (session) {
            session.expiresAt = new Date(Date.now() + this.config.sessionTimeout).toISOString();
            sessionStorage.setItem(this.config.sessionKey, JSON.stringify(session));

            // Update localStorage if remember me is active
            if (localStorage.getItem(this.config.rememberMeKey)) {
                localStorage.setItem(this.config.rememberMeKey, JSON.stringify(session));
            }
        }
    }
}

// Login Form Handler
class LoginFormHandler {
    constructor(authManager) {
        this.authManager = authManager;
        this.form = null;
        this.usernameInput = null;
        this.passwordInput = null;
        this.rememberMeCheckbox = null;
        this.submitButton = null;
        this.errorDisplay = null;
    }

    /**
     * Initialize login form
     * @param {string} formId 
     */
    init(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.error('Login form not found');
            return;
        }

        this.usernameInput = this.form.querySelector('#username');
        this.passwordInput = this.form.querySelector('#password');
        this.rememberMeCheckbox = this.form.querySelector('#rememberMe');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.errorDisplay = this.form.querySelector('#loginError');

        this.attachEventListeners();
    }

    /**
     * Attach event listeners to form elements
     */
    attachEventListeners() {
        // Form submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear errors on input
        this.usernameInput.addEventListener('input', () => this.clearError('username'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));

        // Enter key handling
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }

    /**
     * Handle form submission
     * @param {Event} e 
     */
    async handleSubmit(e) {
        e.preventDefault();

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberMeCheckbox.checked;

        // Validate inputs
        if (!this.validateInputs(username, password)) {
            return;
        }

        // Disable submit button
        this.setLoading(true);

        // Simulate API delay (remove in production)
        await this.delay(800);

        // Authenticate
        const user = this.authManager.authenticate(username, password);

        if (user) {
            // Success
            this.authManager.createSession(user, rememberMe);
            this.showSuccess('Login successful! Redirecting...');

            // Redirect or trigger callback
            await this.delay(500);
            this.onLoginSuccess(user);
        } else {
            // Failed
            this.showError('Invalid username or password');
            this.setLoading(false);
        }
    }

    /**
     * Validate form inputs
     * @param {string} username 
     * @param {string} password 
     * @returns {boolean}
     */
    validateInputs(username, password) {
        let isValid = true;

        if (!username) {
            this.showFieldError('username', 'Username is required');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Show field-specific error
     * @param {string} field 
     * @param {string} message 
     */
    showFieldError(field, message) {
        const input = field === 'username' ? this.usernameInput : this.passwordInput;
        input.classList.add('error');
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    /**
     * Clear field error
     * @param {string} field 
     */
    clearError(field) {
        const input = field === 'username' ? this.usernameInput : this.passwordInput;
        input.classList.remove('error');
        const errorEl = document.getElementById(`${field}Error`);
        if (errorEl) {
            errorEl.classList.remove('show');
        }
        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
        }
    }

    /**
     * Show general error message
     * @param {string} message 
     */
    showError(message) {
        if (this.errorDisplay) {
            this.errorDisplay.style.color = '#dc3545';
            this.errorDisplay.textContent = `✗ ${message}`;
            this.errorDisplay.classList.add('show');
        }

        this.usernameInput.classList.add('error');
        this.passwordInput.classList.add('error');
    }

    /**
     * Show success message
     * @param {string} message 
     */
    showSuccess(message) {
        if (this.errorDisplay) {
            this.errorDisplay.style.color = '#00C49F';
            this.errorDisplay.textContent = `✓ ${message}`;
            this.errorDisplay.classList.add('show');
        }
    }

    /**
     * Set loading state
     * @param {boolean} loading 
     */
    setLoading(loading) {
        if (this.submitButton) {
            this.submitButton.disabled = loading;
            this.submitButton.textContent = loading ? 'Logging in...' : 'Login';
        }

        this.usernameInput.disabled = loading;
        this.passwordInput.disabled = loading;
        this.rememberMeCheckbox.disabled = loading;
    }

    /**
     * Delay helper
     * @param {number} ms 
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Callback for successful login (override this)
     * @param {Object} user 
     */
    onLoginSuccess(user) {
        console.log('Login successful:', user);
        // Override this method to handle post-login actions
    }

    /**
     * Reset form
     */
    reset() {
        this.form.reset();
        this.usernameInput.classList.remove('error');
        this.passwordInput.classList.remove('error');
        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.classList.remove('show');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthConfig, AuthManager, LoginFormHandler };
}

// Example Usage:
/*
// Initialize authentication manager
const authManager = new AuthManager(AuthConfig);

// Initialize login form
const loginForm = new LoginFormHandler(authManager);
loginForm.init('loginForm');

// Override success callback
loginForm.onLoginSuccess = (user) => {
    console.log('Logged in as:', user.username);
    // Redirect to dashboard or show dashboard content
    window.location.href = '/dashboard';
};

// Check for existing session on page load
const session = authManager.checkSession();
if (session) {
    console.log('User already logged in:', session.user.username);
    // Show dashboard directly
}

// Logout functionality
function logout() {
    authManager.destroySession();
    window.location.href = '/login';
}
*/
