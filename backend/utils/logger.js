/**
 * Logger utility for consistent logging across the application
 */

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class Logger {
    static timestamp() {
        return new Date().toISOString();
    }

    static info(message, ...args) {
        console.log(`${colors.blue}[INFO]${colors.reset} ${this.timestamp()} - ${message}`, ...args);
    }

    static success(message, ...args) {
        console.log(`${colors.green}[SUCCESS]${colors.reset} ${this.timestamp()} - ${message}`, ...args);
    }

    static warn(message, ...args) {
        console.warn(`${colors.yellow}[WARN]${colors.reset} ${this.timestamp()} - ${message}`, ...args);
    }

    static error(message, ...args) {
        console.error(`${colors.red}[ERROR]${colors.reset} ${this.timestamp()} - ${message}`, ...args);
    }

    static debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.magenta}[DEBUG]${colors.reset} ${this.timestamp()} - ${message}`, ...args);
        }
    }
}

module.exports = Logger;