/**
 * Request validation middleware
 */

const Validator = require('../utils/validator');
const ApiResponse = require('../utils/response');

const validateRegistration = (req, res, next) => {
    const validation = Validator.validateRegistration(req.body);

    if (!validation.isValid) {
        return ApiResponse.validationError(res, validation.errors);
    }

    // Sanitize inputs
    req.body.name = Validator.sanitizeString(req.body.name);
    req.body.email = Validator.sanitizeString(req.body.email).toLowerCase();
    req.body.phone = req.body.phone.replace(/[\s()-]/g, '');

    next();
};

const validateLogin = (req, res, next) => {
    const validation = Validator.validateLogin(req.body);

    if (!validation.isValid) {
        return ApiResponse.validationError(res, validation.errors);
    }

    // Sanitize inputs
    req.body.email = Validator.sanitizeString(req.body.email).toLowerCase();

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};