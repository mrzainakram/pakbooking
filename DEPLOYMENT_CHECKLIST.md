# ✅ PakBooking Deployment Checklist

## 🚀 **Pre-Deployment (Local)**

### **Docker Setup**
- [x] Docker containers running locally
- [x] Frontend accessible at `http://localhost:3001`
- [x] Backend accessible at `http://localhost:8000`
- [x] Database connected and working
- [x] All API warnings fixed
- [x] Code committed and pushed to GitHub

---

## 🗄️ **Step 1: Database Setup**

### **Choose Database Provider**
- [ ] **Railway** (Recommended - Easy setup)
- [ ] **Render** (Alternative)
- [ ] **ElephantSQL** (Simple option)

### **Railway Setup**
1. [ ] Go to [railway.app](https://railway.app)
2. [ ] Sign up with GitHub
3. [ ] Create new project
4. [ ] Add PostgreSQL database
5. [ ] Copy connection string
6. [ ] Save for backend environment variables

**Connection String Format:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

---

## 🔧 **Step 2: Backend Deployment (Streamlit Cloud)**

### **Streamlit Cloud Setup**
1. [ ] Go to [share.streamlit.io](https://share.streamlit.io)
2. [ ] Sign up with GitHub
3. [ ] Click "New app"
4. [ ] Select repository: `mrzainakram/pakbooking`
5. [ ] Branch: `main`
6. [ ] Main file path: `streamlit_app.py`
7. [ ] App URL: `pakbooking-backend` (or your choice)

### **Environment Variables Setup**
Add these in Streamlit Cloud → Settings → Secrets:

```toml
[secrets]
DJANGO_SECRET_KEY = "django-insecure-your-super-secret-key-min-50-characters-long"
DATABASE_URL = "postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
DJANGO_ALLOWED_HOSTS = "*.streamlit.app,*.vercel.app"
DJANGO_CORS_ORIGINS = "https://pakbooking.vercel.app"
DJANGO_SUPERUSER_EMAIL = "admin@pakbooking.com"
DJANGO_SUPERUSER_PASSWORD = "SecurePassword123!"
```

### **Deploy & Test Backend**
1. [ ] Click "Deploy" button
2. [ ] Wait for deployment to complete
3. [ ] Click "Setup Database & Start Backend" button
4. [ ] Test admin panel: `https://pakbooking-backend.streamlit.app/admin/`
5. [ ] Test API docs: `https://pakbooking-backend.streamlit.app/api/docs/`

**Backend URL:** `https://pakbooking-backend.streamlit.app`

---

## 🎨 **Step 3: Frontend Deployment (Vercel)**

### **Vercel Setup**
1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Sign up with GitHub
3. [ ] Click "New Project"
4. [ ] Import repository: `mrzainakram/pakbooking`
5. [ ] Configure:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### **Environment Variables Setup**
Add these in Vercel → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://pakbooking-backend.streamlit.app
```

### **Deploy & Test Frontend**
1. [ ] Click "Deploy" button
2. [ ] Wait for deployment to complete
3. [ ] Test frontend: `https://pakbooking.vercel.app`

**Frontend URL:** `https://pakbooking.vercel.app`

---

## 🔗 **Step 4: Connect Frontend & Backend**

### **Update CORS Settings**
1. [ ] Get your Vercel frontend URL
2. [ ] Update Streamlit Cloud environment variables:
   ```toml
   DJANGO_CORS_ORIGINS = "https://your-actual-vercel-url.vercel.app"
   ```
3. [ ] Restart Streamlit app

### **Test Connection**
1. [ ] Visit your Vercel frontend URL
2. [ ] Try to register a new account
3. [ ] Check if data loads from backend
4. [ ] Test login functionality

---

## 🧪 **Step 5: Complete Testing**

### **User Features**
- [ ] Homepage loads correctly
- [ ] Property listing shows hotels
- [ ] Search and filter works
- [ ] User registration works
- [ ] User login works
- [ ] User dashboard accessible
- [ ] Booking creation works
- [ ] Booking history shows

### **Admin Features**
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Property management works
- [ ] User management works
- [ ] Booking management works
- [ ] Notifications work

### **API Testing**
- [ ] API documentation accessible
- [ ] All endpoints respond correctly
- [ ] Authentication works
- [ ] CORS headers present

---

## 🔒 **Step 6: Security & Production**

### **Security Checklist**
- [ ] Strong Django secret key set
- [ ] Secure admin password
- [ ] HTTPS enabled (automatic)
- [ ] CORS properly configured
- [ ] No debug mode in production
- [ ] Database credentials secure

### **Performance**
- [ ] Frontend loads quickly
- [ ] API responses are fast
- [ ] Images load properly
- [ ] Mobile responsive

---

## 📱 **Step 7: Custom Domain (Optional)**

### **Vercel Custom Domain**
1. [ ] Go to Vercel → Settings → Domains
2. [ ] Add your domain
3. [ ] Configure DNS settings
4. [ ] Update CORS with new domain

### **Update Environment Variables**
```toml
DJANGO_CORS_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

---

## 🎉 **Step 8: Go Live!**

### **Final Checklist**
- [ ] All tests passing
- [ ] Custom domain configured (if desired)
- [ ] Analytics set up (optional)
- [ ] Backup strategy in place
- [ ] Monitoring configured

### **Share Your App**
- [ ] Frontend URL: `https://pakbooking.vercel.app`
- [ ] Backend URL: `https://pakbooking-backend.streamlit.app`
- [ ] Admin Panel: `https://pakbooking-backend.streamlit.app/admin/`

---

## 🆘 **Troubleshooting**

### **Common Issues**
- **CORS Error**: Check `DJANGO_CORS_ORIGINS` includes your Vercel URL
- **Database Error**: Verify `DATABASE_URL` is correct
- **Build Error**: Check all environment variables are set
- **Frontend Not Loading**: Verify `NEXT_PUBLIC_API_URL` is correct

### **Support Resources**
- Streamlit Cloud logs
- Vercel deployment logs
- Railway database logs
- GitHub repository issues

---

## 📊 **Post-Deployment**

### **Monitor Performance**
- [ ] Check Vercel analytics
- [ ] Monitor Streamlit Cloud usage
- [ ] Watch database performance
- [ ] Set up error tracking

### **Regular Maintenance**
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Monitor security updates
- [ ] Check performance metrics

**🎊 Congratulations! Your PakBooking app is now live! 🎊**
