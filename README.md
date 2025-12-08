# SaralSeva AI

A comprehensive government services platform that helps users navigate EB, Ration, Water & Civic Services with AI-powered assistance.

## Project Structure

```
saralseva-ai/
│
├── frontend/              # HTML + Tailwind CSS + JavaScript
│   ├── pages/
│   │   ├── index.html    # Landing page
│   │   ├── register.html # User registration
│   │   ├── login.html    # User login
│   │   └── home.html     # Dashboard
│   ├── assets/
│   │   ├── images/
│   │   └── css/
│   └── js/
│       └── main.js       # Frontend logic
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
