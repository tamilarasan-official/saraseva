# SaralSeva AI - Smart Government Services Platform

A modern, production-ready web application for simplifying government services with AI assistance.

## ✨ Features

- 🤖 **AI Chatbot** - Get instant answers to government service questions
- 📄 **Document Verification** - Verify documents before submission
- 📍 **Office Locator** - Find nearby government offices with directions
- 📝 **Auto-fill Forms** - AI-powered form filling assistance
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MySQL (optional, for production) - [Download](https://dev.mysql.com/downloads/)

### Installation

1. **Clone the repository**
   ```cmd
   git clone https://github.com/jeeva-off/WEB-TECH-project.git
   cd WEB-TECH-project
   ```

2. **Run the application**
   ```cmd
   START.bat
   ```
   This will automatically install dependencies and start both servers.

3. **Access the application**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:3000

### Manual Setup

#### Backend
```cmd
cd backend
npm install
node server.js
```

#### Frontend
```cmd
cd frontend
npm install
npx http-server -p 8000
```

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API** with Express.js
- **JWT Authentication** for secure user sessions
- **MySQL/In-Memory Database** support
- **Rate Limiting** to prevent abuse
- **Winston Logging** for debugging
- **Input Validation** with express-validator
- **Error Handling** middleware

### Frontend (Vanilla JS + TailwindCSS)
- **Modern UI** with Tailwind CSS
- **Modular JavaScript** architecture
- **API Client** with Axios
- **Responsive Design** for all devices
- **Progressive Enhancement**

## 📁 Project Structure

```
WEB-TECH-project/
│
├── backend/              # Node.js API Server
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── utils/          # Utilities
│   └── server.js       # Entry point
│
└── frontend/            # Static Frontend
    ├── js/             # JavaScript modules
    ├── pages/          # HTML pages
    └── index.html      # Landing page
│
└── backend/               # Node.js + Express + MongoDB
    ├── server.js         # Main server file
    ├── package.json
    ├── controllers/      # Business logic
    ├── routes/          # API routes
    ├── models/          # Database models
    ├── middleware/      # Authentication middleware
    └── config/          # Database configuration
```

## Features

✅ **User Authentication** - Register & Login with JWT tokens
✅ **AI Chatbot** - Get instant answers to government service queries
✅ **Document Verification** - Check documents before submission
✅ **Office Locator** - Find nearest government offices
✅ **Auto Form Filling** - Intelligent form auto-completion

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Server will run on: `http://localhost:5000`

### Frontend Setup

1. Open `frontend/pages/index.html` in your browser
2. Or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server frontend
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Technologies Used

### Frontend
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- CORS

## Default Configuration

- Backend Port: `5000`
- MongoDB: `mongodb://127.0.0.1:27017/saralseva`
- JWT Secret: `your_jwt_secret_key` (change in production)

## Next Steps

Additional features to implement:
- Chatbot UI (WhatsApp-like interface)
- Document Checker with file upload
- Office Locator with Google Maps integration
- Auto Form Fill functionality

## License

MIT License

---

**Note:** Make sure MongoDB is running before starting the backend server.
