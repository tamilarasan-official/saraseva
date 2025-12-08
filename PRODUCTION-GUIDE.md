# SaralSeva AI - Production Architecture

## 🏗️ Project Structure (Production-Ready)

```
WEB-TECH-project/
│
├── backend/                    # Node.js + Express Backend
│   ├── config/
│   │   └── db.js              # MySQL connection pool with error handling
│   ├── controllers/
│   │   └── authController.js  # Business logic for authentication
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   ├── errorHandler.js    # Global error handling
│   │   ├── rateLimiter.js     # Rate limiting protection
│   │   └── validation.js      # Request validation
│   ├── models/
│   │   └── User.js            # User data model
│   ├── routes/
│   │   └── auth.js            # Authentication routes
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   │   ├── response.js        # Standardized API responses
│   │   └── validator.js       # Input validation utilities
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # Dependencies and scripts
│   └── server.js             # Express server setup
│
└── frontend/                  # Frontend (HTML/CSS/JS)
    ├── js/
    │   ├── api.js            # API service layer
    │   ├── auth.js           # Authentication service
    │   ├── config.js         # Configuration
    │   ├── main.js           # Main application logic
    │   └── utils.js          # UI utilities
    ├── pages/
    │   ├── index.html        # Landing page
    │   ├── login.html        # Login page
    │   ├── login-new.html    # New login (production-ready)
    │   ├── register.html     # Register page
    │   ├── register-new.html # New register (production-ready)
    │   ├── home.html         # Dashboard
    │   ├── chatbot.html      # AI Chatbot
    │   ├── document-check.html
    │   ├── office-locator.html
    │   └── autofill.html
    ├── .gitignore
    └── package.json

```

## 🚀 Production Features Implemented

### Backend Improvements:
1. **Security**
   - Helmet.js for HTTP headers security
   - Rate limiting to prevent abuse
   - CORS properly configured
   - Input validation and sanitization
   - JWT token authentication with expiry
   - Password hashing with bcrypt (12 salt rounds)

2. **Error Handling**
   - Global error handler
   - Standardized API responses
   - Detailed error logging
   - Database error handling

3. **Code Quality**
   - Modular architecture
   - Separation of concerns
   - Utility functions
   - Comprehensive logging
   - Environment-based configuration

4. **Performance**
   - Database connection pooling
   - Response compression
   - Efficient query patterns
   - Request timeout handling

5. **Database**
   - Production-ready schema
   - Indexes for performance
   - Proper foreign keys
   - Sessions table for token management

### Frontend Improvements:
1. **Architecture**
   - Service-based architecture
   - Centralized API communication
   - Authentication service layer
   - Configuration management
   - UI utility functions

2. **User Experience**
   - Toast notifications
   - Loading states
   - Form validation
   - Error handling
   - Responsive design

3. **Security**
   - Secure token storage
   - Route protection
   - Input sanitization
   - HTTPS ready

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` (already done)
   - Update database credentials in `.env`

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE saralseva_db;
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on: `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   Frontend will run on: `http://localhost:8000`

4. **Access the application:**
   - Landing: `http://localhost:8000/pages/index.html`
   - Register: `http://localhost:8000/pages/register-new.html`
   - Login: `http://localhost:8000/pages/login-new.html`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Health Check
- `GET /` - API status
- `GET /health` - Health check with uptime

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=saralseva_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:8000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:3000/health
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123"
  }'
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_user_id (user_id)
);
```

## 🛡️ Security Best Practices

1. ✅ HTTPS in production
2. ✅ Environment variables for secrets
3. ✅ Rate limiting enabled
4. ✅ Input validation and sanitization
5. ✅ SQL injection prevention
6. ✅ XSS protection
7. ✅ CORS properly configured
8. ✅ Secure password hashing
9. ✅ JWT token expiration
10. ✅ Error messages don't leak sensitive info

## 🚀 Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Configure firewall rules
- [ ] Use process manager (PM2)
- [ ] Set up CI/CD pipeline

## 📝 License

ISC

## 👥 Team

SaralSeva Team
