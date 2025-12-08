/**
 * Authentication Service
 */

class AuthService {
    /**
     * Store authentication data
     */
    static setAuth(token, user) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    }

    /**
     * Get stored user data
     */
    static getUser() {
        const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Get stored token
     */
    static getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Clear authentication data
     */
    static clearAuth() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    }

    /**
     * Register new user
     */
    static async register(userData) {
        try {
            const response = await apiService.post('/auth/register', userData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, errors: error.errors };
        }
    }

    /**
     * Login user
     */
    static async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);

            if (response.success && response.data) {
                this.setAuth(response.data.token, response.data.user);
            }

            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message, errors: error.errors };
        }
    }

    /**
     * Logout user
     */
    static async logout() {
        try {
            await apiService.post('/auth/logout', {}, true);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    }

    /**
     * Get user profile
     */
    static async getProfile() {
        try {
            const response = await apiService.get('/auth/profile', true);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Protect page - redirect if not authenticated
     */
    static protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}