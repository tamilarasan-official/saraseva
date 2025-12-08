/**
 * Main Application Logic
 * Production-ready implementation with proper error handling
 */

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize application
 */
function initializeApp() {
    const currentPage = getCurrentPage();

    // Initialize page-specific functionality
    switch (currentPage) {
        case 'register':
            initRegisterPage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'home':
            initHomePage();
            break;
        case 'index':
            initLandingPage();
            break;
    }

    // Initialize common functionality
    initLogoutButton();
}

/**
 * Get current page name
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page.replace('.html', '') || 'index';
}

/**
 * Initialize Register Page
 */
function initRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        UIUtils.showLoading(submitBtn);

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value
        };

        // Client-side validation
        if (!validateRegistrationForm(formData)) {
            UIUtils.hideLoading(submitBtn);
            return;
        }

        // Call API
        const result = await AuthService.register(formData);
        UIUtils.hideLoading(submitBtn);

        if (result.success) {
            UIUtils.showToast(result.data.message || 'Registration successful!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            if (result.errors && Array.isArray(result.errors)) {
                result.errors.forEach(error => UIUtils.showToast(error, 'error'));
            } else {
                UIUtils.showToast(result.error || 'Registration failed', 'error');
            }
        }
    });
}

/**
 * Validate registration form
 */
function validateRegistrationForm(data) {
    if (data.name.length < 2) {
        UIUtils.showToast('Name must be at least 2 characters', 'error');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        UIUtils.showToast('Please enter a valid email', 'error');
        return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s()-]/g, ''))) {
        UIUtils.showToast('Please enter a valid 10-digit phone number', 'error');
        return false;
    }

    if (data.password.length < 8) {
        UIUtils.showToast('Password must be at least 8 characters', 'error');
        return false;
    }

    return true;
}

/**
 * Initialize Login Page
 */
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        UIUtils.showLoading(submitBtn);

        const credentials = {
            email: document.getElementById('loginEmail').value.trim(),
            password: document.getElementById('loginPassword').value
        };

        const result = await AuthService.login(credentials);
        UIUtils.hideLoading(submitBtn);

        if (result.success) {
            UIUtils.showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            if (result.errors && Array.isArray(result.errors)) {
                result.errors.forEach(error => UIUtils.showToast(error, 'error'));
            } else {
                UIUtils.showToast(result.error || 'Login failed', 'error');
            }
        }
    });
}

/**
 * Initialize Home Page
 */
function initHomePage() {
    // Protect page - redirect if not authenticated
    if (!AuthService.protectPage()) {
        return;
    }

    // Display user information
    const user = AuthService.getUser();
    if (user) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `Welcome, ${user.name}`;
        }

        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    }

    // Load user profile from API
    loadUserProfile();
}

/**
 * Load user profile from API
 */
async function loadUserProfile() {
    const result = await AuthService.getProfile();
    if (result.success) {
        // Update UI with fresh profile data
        const user = result.data;
        AuthService.setAuth(AuthService.getToken(), user);
    }
}

/**
 * Initialize Landing Page
 */
function initLandingPage() {
    // Check if already logged in
    if (AuthService.isAuthenticated()) {
        const homeBtn = document.getElementById('goToHomeBtn');
        if (homeBtn) {
            homeBtn.textContent = 'Go to Dashboard';
            homeBtn.onclick = () => window.location.href = 'home.html';
        }
    }
}

/**
 * Initialize Logout Button
 */
function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async(e) => {
            e.preventDefault();

            const confirmed = await UIUtils.confirm('Are you sure you want to logout?');
            if (confirmed) {
                UIUtils.showLoading(logoutBtn);
                await AuthService.logout();
                UIUtils.showToast('Logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "index.html";
        }
    });
}