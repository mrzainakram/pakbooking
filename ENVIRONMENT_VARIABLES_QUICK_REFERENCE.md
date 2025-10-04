# 🔐 Environment Variables Quick Reference

## 📝 **Backend (Streamlit Cloud)**

### **Required Variables**
```bash
DJANGO_SECRET_KEY=django-insecure-your-super-secret-key-min-50-characters-long
DATABASE_URL=postgresql://username:password@host:port/database
DJANGO_ALLOWED_HOSTS=*.streamlit.app,*.vercel.app
DJANGO_CORS_ORIGINS=https://your-frontend.vercel.app
```

### **Admin Setup**
```bash
DJANGO_SUPERUSER_EMAIL=admin@pakbooking.com
DJANGO_SUPERUSER_PASSWORD=SecurePassword123!
```

### **Optional (Email)**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## 🎨 **Frontend (Vercel)**

### **Required Variables**
```bash
NEXT_PUBLIC_API_URL=https://pakbooking-backend.streamlit.app
```

### **Optional**
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## 🗄️ **Database Connection Examples**

### **Railway PostgreSQL**
```bash
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### **Render PostgreSQL**
```bash
DATABASE_URL=postgresql://username:password@dpg-xxx-a.oregon-postgres.render.com/database_name
```

### **ElephantSQL**
```bash
DATABASE_URL=postgresql://username:password@bubble.db.elephantsql.com/database_name
```

---

## 🔑 **Generate Django Secret Key**

Use this Python script to generate a secure key:

```python
import secrets
import string

def generate_secret_key():
    alphabet = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(alphabet) for i in range(50))

print(f"DJANGO_SECRET_KEY={generate_secret_key()}")
```

Or use online generator: [djecrety.ir](https://djecrety.ir)

---

## ⚠️ **Important Security Notes**

1. **Never commit** these variables to Git
2. **Use strong passwords** (min 12 characters)
3. **Rotate secrets** regularly
4. **Use different passwords** for each environment
5. **Enable 2FA** on all platforms

---

## 📋 **Copy-Paste Checklist**

### **Backend Variables to Set**
- [ ] `DJANGO_SECRET_KEY`
- [ ] `DATABASE_URL`
- [ ] `DJANGO_ALLOWED_HOSTS`
- [ ] `DJANGO_CORS_ORIGINS`
- [ ] `DJANGO_SUPERUSER_EMAIL`
- [ ] `DJANGO_SUPERUSER_PASSWORD`

### **Frontend Variables to Set**
- [ ] `NEXT_PUBLIC_API_URL`

### **Test After Setting**
- [ ] Backend loads without errors
- [ ] Frontend connects to backend
- [ ] Admin panel accessible
- [ ] User registration works
- [ ] Properties load correctly
