/**
 * Frontend Configuration
 */

const CONFIG = {
    // API Configuration
    API_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ?
        'http://localhost:3000/api' : 'https://your-production-api.com/api',

    // API Timeout
    API_TIMEOUT: 30000, // 30 seconds

    // Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'saralseva_token',
        USER: 'saralseva_user',
        THEME: 'saralseva_theme'
    },

    // App Information
    APP_NAME: 'SaralSeva AI',
    APP_VERSION: '1.0.0',

    // Feature Flags
    FEATURES: {
        CHATBOT: true,
        DOCUMENT_CHECK: true,
        OFFICE_LOCATOR: true,
        AUTOFILL: true
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);