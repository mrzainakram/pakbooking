# 🚀 PakBooking - Complete Production Deployment Guide

## 📋 **Overview**
This guide will help you deploy PakBooking to production with:
- **Frontend**: Vercel (Free hosting)
- **Backend**: Streamlit Cloud (Free hosting) 
- **Database**: External PostgreSQL (Railway/Render)

## 🎯 **Step-by-Step Deployment**

### **Phase 1: Prepare for Deployment**

#### **1.1 Git Setup (Already Done)**
```bash
git add .
git commit -m "Production ready - all warnings fixed"
git push origin main
```

#### **1.2 Current Status**
- ✅ Docker containers running locally
- ✅ All API warnings fixed
- ✅ Code pushed to GitHub
- ✅ Ready for production deployment

---

### **Phase 2: Backend Deployment (Streamlit Cloud)**

#### **2.1 Create Streamlit Cloud Account**
1. Go to [share.streamlit.io](https://share.streamlit.io)
2. Sign up with GitHub account
3. Connect your GitHub repository

#### **2.2 Deploy Backend**
1. Click "New app"
2. Select repository: `mrzainakram/pakbooking`
3. Branch: `main`
4. Main file path: `streamlit_app.py`
5. App URL: Choose your custom URL (e.g., `pakbooking-backend`)

#### **2.3 Environment Variables for Backend**
Add these in Streamlit Cloud settings:

```bash
# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here-min-50-chars
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=*.streamlit.app,*.vercel.app
DJANGO_CORS_ORIGINS=https://your-frontend.vercel.app

# Database (Use Railway or Render)
DATABASE_URL=postgresql://username:password@host:port/database

# Admin Credentials
DJANGO_SUPERUSER_EMAIL=admin@pakbooking.com
DJANGO_SUPERUSER_PASSWORD=your-secure-password

# Optional: Email Settings (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

#### **2.4 Database Setup (Railway - Recommended)**

**Option A: Railway (Free Tier)**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → "Provision PostgreSQL"
4. Copy connection string
5. Add to Streamlit environment variables

**Option B: Render (Free Tier)**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create "PostgreSQL" database
4. Copy connection string
5. Add to Streamlit environment variables

---

### **Phase 3: Frontend Deployment (Vercel)**

#### **3.1 Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import project: `mrzainakram/pakbooking`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### **3.2 Environment Variables for Frontend**
Add these in Vercel project settings:

```bash
# Backend API URL (Your Streamlit app URL)
NEXT_PUBLIC_API_URL=https://pakbooking-backend.streamlit.app

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### **3.3 Custom Domain (Optional)**
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS settings

---

### **Phase 4: Configuration & Testing**

#### **4.1 Update CORS Settings**
After getting your Vercel URL, update Streamlit environment:
```bash
DJANGO_CORS_ORIGINS=https://your-app.vercel.app
```

#### **4.2 Test Complete Flow**
1. **Frontend**: Visit your Vercel URL
2. **Registration**: Create test account
3. **Login**: Test authentication
4. **Properties**: Browse hotels
5. **Booking**: Create test booking
6. **Admin**: Visit `https://your-backend.streamlit.app/admin/`

#### **4.3 Admin Setup**
1. Go to your Streamlit app URL
2. Click "Setup Database & Start Backend"
3. Admin panel: `https://your-backend.streamlit.app/admin/`
4. Login with credentials from environment variables

---

### **Phase 5: Production URLs**

After deployment, you'll have:

#### **Frontend (Vercel)**
```
https://pakbooking.vercel.app
```

#### **Backend (Streamlit Cloud)**
```
https://pakbooking-backend.streamlit.app
```

#### **Admin Panel**
```
https://pakbooking-backend.streamlit.app/admin/
```

#### **API Documentation**
```
https://pakbooking-backend.streamlit.app/api/docs/
```

---

## 🔧 **Environment Variables Reference**

### **Backend (Streamlit Cloud)**
```bash
# Required
DJANGO_SECRET_KEY=your-50-char-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
DJANGO_ALLOWED_HOSTS=*.streamlit.app,*.vercel.app
DJANGO_CORS_ORIGINS=https://your-app.vercel.app

# Admin
DJANGO_SUPERUSER_EMAIL=admin@pakbooking.com
DJANGO_SUPERUSER_PASSWORD=secure-password-123

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### **Frontend (Vercel)**
```bash
# Required
NEXT_PUBLIC_API_URL=https://pakbooking-backend.streamlit.app

# Optional
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## 🚨 **Important Notes**

### **Security**
- ✅ Use strong passwords
- ✅ Generate secure Django secret key
- ✅ Enable HTTPS (automatic on Vercel/Streamlit)
- ✅ Configure CORS properly

### **Limitations**
- **Streamlit Cloud**: 1GB RAM, 1GB storage
- **Vercel**: 100GB bandwidth/month (free tier)
- **Railway**: 500MB database (free tier)

### **Monitoring**
- Monitor app performance in Streamlit Cloud dashboard
- Check Vercel analytics for frontend metrics
- Monitor database usage in Railway/Render

---

## 🔄 **Updates & Maintenance**

### **Code Updates**
1. Make changes locally
2. Test with Docker: `docker-compose up --build`
3. Push to GitHub: `git push origin main`
4. Streamlit Cloud auto-deploys
5. Vercel auto-deploys

### **Database Backup**
- Railway: Automatic backups
- Render: Manual backup option
- Download backups regularly

### **Scaling**
- **Upgrade Streamlit**: Pro plan for more resources
- **Upgrade Vercel**: Pro plan for more bandwidth
- **Database**: Upgrade to paid tier when needed

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **CORS Errors**
- Check `DJANGO_CORS_ORIGINS` includes your Vercel URL
- Ensure no trailing slashes in URLs

#### **Database Connection**
- Verify `DATABASE_URL` format
- Check database is running
- Ensure firewall allows connections

#### **Build Failures**
- Check environment variables are set
- Verify all dependencies in requirements.txt
- Check Streamlit Cloud logs

#### **Frontend Not Loading**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Vercel build logs
- Ensure backend is running

---

## 📞 **Support**

If you encounter issues:
1. Check deployment logs in respective platforms
2. Verify all environment variables
3. Test locally with Docker first
4. Check GitHub repository for latest code

---

## 🎉 **Success Checklist**

- [ ] Backend deployed on Streamlit Cloud
- [ ] Frontend deployed on Vercel
- [ ] Database configured and connected
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Admin panel accessible
- [ ] User registration working
- [ ] Property listing working
- [ ] Booking system working
- [ ] Custom domain configured (optional)

**Your PakBooking app is now live in production! 🚀**
