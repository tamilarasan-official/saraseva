const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Logger = require("../utils/logger");
const ApiResponse = require("../utils/response");

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async(req, res, next) => {
    try {
        const { name, first_name, last_name, email, phone, password } = req.body;

        // Handle both name formats: single "name" field or separate first_name/last_name
        let firstName, lastName;
        if (first_name) {
            firstName = first_name;
            lastName = last_name || '';
        } else if (name) {
            // Split full name into first and last name
            const nameParts = name.trim().split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        } else {
            return ApiResponse.validationError(res, ['Name is required']);
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return ApiResponse.conflict(res, "User already exists with this email");
        }

        // Check if phone already exists
        const existingPhone = await User.findByPhone(phone);
        if (existingPhone) {
            return ApiResponse.conflict(res, "User already exists with this phone number");
        }

        // Hash password with salt rounds of 12 for better security
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const userId = await User.create({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            password: hashedPassword
        });

        Logger.info(`New user registered: ${email}`);

        return ApiResponse.success(
            res, { userId },
            "User registered successfully. Please login to continue.",
            201
        );
    } catch (error) {
        Logger.error("Registration error:", error);
        next(error);
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return ApiResponse.unauthorized(res, "Invalid email or password");
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return ApiResponse.unauthorized(res, "Invalid email or password");
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Create JWT token
        const token = jwt.sign({
                userId: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`.trim()
            },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "24h" }
        );

        Logger.info(`User logged in: ${email}`);

        return ApiResponse.success(res, {
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                name: `${user.first_name} ${user.last_name}`.trim(),
                email: user.email,
                phone: user.phone
            }
        }, "Login successful");
    } catch (error) {
        Logger.error("Login error:", error);
        next(error);
    }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
exports.getProfile = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return ApiResponse.notFound(res, "User not found");
        }

        return ApiResponse.success(res, {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            name: `${user.first_name} ${user.last_name}`.trim(),
            email: user.email,
            phone: user.phone,
            createdAt: user.created_at
        }, "Profile fetched successfully");
    } catch (error) {
        Logger.error("Get profile error:", error);
        next(error);
    }
};

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = async(req, res, next) => {
    try {
        Logger.info(`User logged out: ${req.user.email}`);
        return ApiResponse.success(res, null, "Logout successful");
    } catch (error) {
        Logger.error("Logout error:", error);
        next(error);
    }
};