const jwt = require("jsonwebtoken");
require("dotenv").config();
const ApiResponse = require("../utils/response");
const Logger = require("../utils/logger");

/**
 * Authentication middleware - Verifies JWT token
 * Protects routes that require authentication
 */
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return ApiResponse.unauthorized(res, "No authorization token provided");
        }

        // Check if it's a Bearer token
        if (!authHeader.startsWith("Bearer ")) {
            return ApiResponse.unauthorized(res, "Invalid token format. Use: Bearer <token>");
        }

        const token = authHeader.replace("Bearer ", "");

        if (!token) {
            return ApiResponse.unauthorized(res, "No token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = decoded;

        Logger.debug(`Authenticated request from user: ${decoded.email}`);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return ApiResponse.unauthorized(res, "Token has expired. Please login again.");
        }

        if (error.name === "JsonWebTokenError") {
            return ApiResponse.unauthorized(res, "Invalid token. Please login again.");
        }

        Logger.error("Auth middleware error:", error);
        return ApiResponse.unauthorized(res, "Authentication failed");
    }
};

module.exports = authMiddleware;