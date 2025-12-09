/**
 * API Service - Centralized API communication
 */

class ApiService {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.timeout = CONFIG.API_TIMEOUT;
    }

    /**
     * Get authorization token
     */
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    }

    /**
     * Get default headers
     */
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.authenticated),
        };

        console.log('API Request:', { url, method: options.method || 'GET', body: options.body });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('API Response status:', response.status);
            const data = await response.json();
            console.log('API Response data:', data);

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Request failed',
                    errors: data.errors || null
                };
            }

            return data;
        } catch (error) {
            console.error('API Request error:', error);
            if (error.name === 'AbortError') {
                throw { message: 'Request timeout. Please try again.' };
            }
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, authenticated = false) {
        return this.request(endpoint, {
            method: 'GET',
            authenticated
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data, authenticated = false) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            authenticated
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data, authenticated = false) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            authenticated
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, authenticated = false) {
        return this.request(endpoint, {
            method: 'DELETE',
            authenticated
        });
    }
}

// Create singleton instance
const apiService = new ApiService();