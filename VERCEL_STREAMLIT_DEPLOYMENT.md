# 🚀 Vercel + Streamlit Cloud Deployment Guide

## **Overview**
This guide will help you deploy your PakBooking project using:
- **Frontend**: Vercel (Free)
- **Backend**: Streamlit Cloud (Free)

## **🎯 Deployment Architecture**
```
Frontend (Vercel) → Backend (Streamlit Cloud)
     ↓                      ↓
https://your-app.vercel.app → https://your-app.streamlit.app
```

---

## **📋 Prerequisites**
1. GitHub repository with your code
2. Vercel account (free)
3. Streamlit Cloud account (free)

---

## **🚀 Step 1: Deploy Backend to Streamlit Cloud**

### **1.1 Prepare Repository**
Make sure your repository has these files:
- `streamlit_app.py` (main Streamlit app)
- `requirements.txt` (with all dependencies)
- `setup_streamlit.py` (database setup script)
- `.streamlit/config.toml` (Streamlit configuration)

### **1.2 Deploy to Streamlit Cloud**

1. **Go to Streamlit Cloud**: https://share.streamlit.io
2. **Sign up/Login** with GitHub
3. **Click "New app"**
4. **Configure deployment**:
   ```
   Repository: your-username/your-repo-name
   Branch: main
   Main file path: streamlit_app.py
   ```
5. **Click "Deploy"**

### **1.3 Configure Environment Variables**
In Streamlit Cloud dashboard, add these environment variables:
```
DJANGO_SECRET_KEY=your-very-secure-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=*.streamlit.app,your-app-name.streamlit.app
DJANGO_CORS_ORIGINS=https://your-frontend.vercel.app
POSTGRES_DB=streamlit
POSTGRES_USER=streamlit
POSTGRES_PASSWORD=your-secure-password
DB_HOST=your-db-host
DB_PORT=5432
```

### **1.4 Initialize Database**
After deployment, your `streamlit_app.py` will automatically run the setup script to:
- Run Django migrations
- Create admin user
- Add sample properties

**Admin Credentials**:
```
Email: admin@bookpakistan.com
Password: admin123
```

---

## **🌐 Step 2: Deploy Frontend to Vercel**

### **2.1 Prepare Frontend**
Ensure your frontend has:
- `vercel.json` configuration file
- Updated `api.ts` with environment variable support
- All dependencies in `package.json`

### **2.2 Deploy to Vercel**

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your repository**
5. **Configure build settings**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

### **2.3 Set Environment Variables**
In Vercel dashboard, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-app.streamlit.app/api
```

### **2.4 Deploy**
Click "Deploy" and wait for the build to complete.

---

## **🔧 Step 3: Configure CORS and API Integration**

### **3.1 Update Backend CORS Settings**
Your backend is already configured to allow all origins for development. In production, update:
```python
# In backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-frontend.vercel.app:3000",  # For development
]
```

### **3.2 Test API Connection**
After both deployments are complete:
1. Visit your Vercel frontend URL
2. Try to register/login
3. Browse properties
4. Create a test booking

---

## **📊 Step 4: Verify Deployment**

### **4.1 Backend Verification**
Visit your Streamlit app URL and check:
- ✅ Streamlit dashboard loads
- ✅ Database metrics show data
- ✅ API endpoints are accessible

### **4.2 Frontend Verification**
Visit your Vercel app URL and test:
- ✅ Homepage loads
- ✅ User registration works
- ✅ Property browsing works
- ✅ Booking creation works
- ✅ Admin panel accessible

### **4.3 API Integration Test**
1. Open browser developer tools
2. Go to Network tab
3. Perform actions on frontend
4. Verify API calls are made to Streamlit backend
5. Check for CORS errors

---

## **🔍 Troubleshooting**

### **Common Issues:**

#### **CORS Errors**
```
Access to fetch at 'https://backend.streamlit.app' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

**Solution**: Update CORS settings in backend:
```python
CORS_ALLOW_ALL_ORIGINS = True  # For testing
# Or specify exact origins:
CORS_ALLOWED_ORIGINS = ["https://your-frontend.vercel.app"]
```

#### **Database Connection Issues**
```
django.db.utils.OperationalError: could not connect to server
```

**Solution**: 
1. Check database credentials in environment variables
2. Ensure database service is running
3. Verify network connectivity

#### **Build Failures**
```
ModuleNotFoundError: No module named 'django'
```

**Solution**: 
1. Check `requirements.txt` includes all dependencies
2. Verify Python version compatibility
3. Check for import errors in `streamlit_app.py`

#### **Frontend API Connection**
```
GET https://backend.streamlit.app/api/properties/ 404 (Not Found)
```

**Solution**:
1. Verify backend URL in `NEXT_PUBLIC_API_URL`
2. Check if Django URLs are properly configured
3. Ensure backend is deployed and accessible

---

## **🎯 Final URLs Structure**

After successful deployment:

### **Frontend (Vercel)**
```
https://pakbooking-frontend.vercel.app
```

### **Backend (Streamlit)**
```
https://pakbooking-backend.streamlit.app
```

### **API Endpoints**
```
https://pakbooking-backend.streamlit.app/api/auth/
https://pakbooking-backend.streamlit.app/api/listings/
https://pakbooking-backend.streamlit.app/api/bookings/
https://pakbooking-backend.streamlit.app/admin/
```

---

## **📱 Testing Your Deployment**

### **1. User Flow Test**
1. Visit frontend URL
2. Register new user
3. Browse properties
4. Create booking
5. Check dashboard

### **2. Admin Flow Test**
1. Visit backend URL
2. Login with admin credentials
3. Check database metrics
4. Access Django admin panel

### **3. API Integration Test**
1. Open frontend in browser
2. Open Developer Tools → Network
3. Perform various actions
4. Verify API calls to backend

---

## **🚀 Production Optimizations**

### **Security Improvements**
1. Set `DEBUG=False` in production
2. Use strong `DJANGO_SECRET_KEY`
3. Configure proper CORS origins
4. Enable HTTPS only

### **Performance Optimizations**
1. Enable static file compression
2. Use CDN for static assets
3. Implement caching strategies
4. Optimize database queries

### **Monitoring**
1. Set up error tracking
2. Monitor API response times
3. Track user analytics
4. Set up uptime monitoring

---

## **💰 Cost Breakdown**

### **Vercel (Frontend)**
- **Cost**: Free
- **Limits**: 100GB bandwidth, unlimited static sites
- **Features**: Automatic HTTPS, global CDN

### **Streamlit Cloud (Backend)**
- **Cost**: Free
- **Limits**: 1GB RAM, CPU limits
- **Features**: Automatic deployments, GitHub integration

### **Total Cost: $0/month** 🎉

---

## **📞 Support & Resources**

### **Documentation**
- [Vercel Documentation](https://vercel.com/docs)
- [Streamlit Cloud Documentation](https://docs.streamlit.io/streamlit-community-cloud)
- [Django Deployment Guide](https://docs.djangoproject.com/en/stable/howto/deployment/)

### **Community**
- [Vercel Discord](https://vercel.com/discord)
- [Streamlit Community](https://discuss.streamlit.io/)
- [Django Forum](https://forum.djangoproject.com/)

---

## **🎉 Congratulations!**

Your PakBooking application is now live with:
- ✅ Professional frontend on Vercel
- ✅ Robust backend on Streamlit Cloud
- ✅ Complete API integration
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ HTTPS enabled

**Your live application URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.streamlit.app`

Enjoy your deployed PakBooking system! 🏨✨
