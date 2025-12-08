/**
 * Global error handling middleware
 */

const Logger = require('../utils/logger');
const ApiResponse = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    Logger.error('Error occurred:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return ApiResponse.validationError(res, errors);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ApiResponse.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Token expired');
    }

    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        return ApiResponse.conflict(res, 'Duplicate entry - resource already exists');
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return ApiResponse.validationError(res, ['Invalid reference - related resource not found']);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;