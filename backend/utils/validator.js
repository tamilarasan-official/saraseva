/**
 * Validation utility functions
 */

class Validator {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
    }

    static isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password);
    }

    static sanitizeString(str) {
        if (typeof str !== 'string') return str;
        return str.trim().replace(/[<>]/g, '');
    }

    static validateRegistration(data) {
        const errors = [];

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!data.email || !this.isEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.phone || !this.isPhone(data.phone)) {
            errors.push('Valid 10-digit phone number is required');
        }

        if (!data.password || !this.isStrongPassword(data.password)) {
            errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static validateLogin(data) {
        const errors = [];

        if (!data.email || !this.isEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.password || data.password.length < 8) {
            errors.push('Password is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = Validator;