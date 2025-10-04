# 🚀 Deployment Configuration for PakBooking

## Environment Variables for Streamlit Cloud (Backend)

Add these in your Streamlit Cloud dashboard:

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

## Environment Variables for Vercel (Frontend)

Add these in your Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend.streamlit.app/api
```

## Deployment URLs

After deployment, your URLs will be:
- **Frontend**: `https://pakbooking-frontend.vercel.app`
- **Backend**: `https://pakbooking-backend.streamlit.app`
- **Admin Panel**: `https://pakbooking-backend.streamlit.app/admin/`

## Admin Credentials

```
Email: admin@bookpakistan.com
Password: admin123
```

## Quick Deployment Steps

1. **Push to GitHub**: All files are ready
2. **Deploy Backend**: Go to https://share.streamlit.io
3. **Deploy Frontend**: Go to https://vercel.com
4. **Set Environment Variables**: Use the values above
5. **Test**: Visit your deployed URLs
