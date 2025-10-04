# 🐳 Docker Deployment Guide

## 🎯 **Environment Variables - Sirf Ye Dalne Hain:**

### **Create .env file in root directory:**
```bash
# Database
POSTGRES_DB=booking
POSTGRES_USER=booking_user
POSTGRES_PASSWORD=secure_password_123

# Django
DJANGO_SECRET_KEY=your-very-secure-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
DJANGO_CORS_ORIGINS=http://localhost:3001
```

## 🚀 **Quick Start:**

### **Step 1: Create .env file**
```bash
# Copy the environment variables above into .env file
```

### **Step 2: Run Docker**
```bash
docker-compose up --build
```

### **Step 3: Access Your App**
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 👤 **Admin Credentials:**
```
Email: admin@bookpakistan.com
Password: admin123
```

## 🎯 **Why Docker is Better:**
- ✅ **Complete control**
- ✅ **Local testing**
- ✅ **Easy deployment**
- ✅ **Professional setup**
- ✅ **Database included**

## 💰 **Cost: $0** (Local deployment)
