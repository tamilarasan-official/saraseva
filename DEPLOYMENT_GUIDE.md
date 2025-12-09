# SaralSeva AI - Production Deployment Guide

## 🏗️ Architecture Overview

```
WEB-TECH-project/
├── backend/                    # Node.js/Express API Server
│   ├── config/                # Configuration files
│   │   └── db.js             # Database connection
│   ├── controllers/           # Business logic
│   │   └── authController.js # Authentication logic
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── validation.js     # Input validation
│   ├── models/                # Data models
│   │   └── User.js           # User model
│   ├── routes/                # API routes
│   │   └── auth.js           # Authentication routes
│   ├── utils/                 # Utility functions
│   │   ├── logger.js         # Winston logger
│   │   ├── response.js       # Response formatters
│   │   └── validator.js      # Validation helpers
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Dependencies
│   └── server.js             # Entry point
│
└── frontend/                   # Static Frontend
    ├── js/                    # JavaScript modules
    │   ├── api.js            # API client
    │   ├── auth.js           # Auth handling
    │   ├── config.js         # Configuration
    │   ├── main.js           # Main entry point
    │   └── utils.js          # Utility functions
    ├── pages/                 # HTML pages
    │   ├── index.html        # Landing page
    │   ├── login.html        # Login page
    │   ├── register.html     # Registration page
    │   ├── home.html         # Dashboard
    │   ├── chatbot.html      # AI Chatbot
    │   ├── document-check.html
    │   ├── office-locator.html
    │   └── autofill.html
    ├── index.html            # Root redirect
    └── package.json          # Frontend dependencies
```

## 🚀 Quick Start

### Development Mode

1. **Run the startup script:**
   ```cmd
   START.bat
   ```

2. **Manual start:**
   ```cmd
   # Terminal 1 - Backend
   cd backend
   npm install
   node server.js

   # Terminal 2 - Frontend
   cd frontend
   npm install
   npx http-server -p 8000
   ```

3. **Access the application:**
   - Frontend: http://localhost:8000
   - Backend: http://localhost:3000
   - API Docs: http://localhost:3000/api/health

## 🗄️ Database Setup

### Development (Current - In-Memory)
The app currently runs with an in-memory database for quick development.
**Note:** All data is lost when the server restarts.

### Production (MySQL)

1. **Install MySQL:**
   - Download from: https://dev.mysql.com/downloads/installer/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Create Database:**
   ```sql
   CREATE DATABASE saralseva_ai;
   USE saralseva_ai;

   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     phone VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

3. **Configure Environment:**
   ```cmd
   cd backend
   copy .env.example .env
   ```

4. **Update .env file:**
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=saralseva_ai
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   ```

## 🌐 Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

#### Backend Deployment

1. **Install Node.js on server**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

3. **Upload backend code and configure**
   ```bash
   cd backend
   npm install --production
   cp .env.example .env
   # Edit .env with production values
   ```

4. **Start with PM2**
   ```bash
   pm2 start server.js --name saralseva-backend
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Frontend Deployment

1. **Build frontend (if using build process)**
   ```bash
   cd frontend
   npm install
   # Copy files to web server
   ```

2. **Configure Nginx for frontend**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/saralseva/frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend
       location /api {
           proxy_pass http://localhost:3000/api;
       }
   }
   ```

3. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

### Option 2: Cloud Platforms

#### Heroku

**Backend:**
```bash
cd backend
heroku create saralseva-api
heroku addons:create cleardb:ignite
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

**Frontend:**
Deploy to Netlify, Vercel, or GitHub Pages

#### AWS

**Backend:** Deploy to Elastic Beanstalk or EC2
**Frontend:** Host on S3 + CloudFront
**Database:** RDS MySQL

#### Azure

**Backend:** Azure App Service
**Frontend:** Azure Static Web Apps
**Database:** Azure Database for MySQL

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to a strong random string
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up environment variables securely
- [ ] Remove .env from version control
- [ ] Enable SQL injection protection
- [ ] Implement input validation
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Regular security updates

## 📊 Monitoring

### Backend Logs
```bash
# PM2 logs
pm2 logs saralseva-backend

# Application logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

### Health Check Endpoints
- Backend: `http://your-api/api/health`
- Database: Check connection in logs

## 🔄 Updates and Maintenance

### Update Backend
```bash
cd backend
git pull
npm install
pm2 restart saralseva-backend
```

### Update Frontend
```bash
cd frontend
git pull
npm install
# Copy updated files to web server
```

### Database Backup
```bash
# Manual backup
mysqldump -u root -p saralseva_ai > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * mysqldump -u root -pPASSWORD saralseva_ai > /backups/saralseva_$(date +\%Y\%m\%d).sql
```

## 🐛 Troubleshooting

### Backend won't start
- Check logs: `pm2 logs` or `tail -f logs/error.log`
- Verify environment variables in `.env`
- Check database connection
- Ensure port 3000 is not in use

### Frontend shows directory listing
- Ensure `index.html` exists in root
- Check web server configuration
- Verify file permissions

### Database connection errors
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists
- Check firewall rules

### CORS errors
- Update `CORS_ORIGIN` in backend `.env`
- Check frontend `API_BASE_URL` in `js/config.js`

## 📞 Support

For issues or questions:
1. Check logs first
2. Review this documentation
3. Check GitHub issues
4. Contact development team

## 📝 License

MIT License - See LICENSE file for details
