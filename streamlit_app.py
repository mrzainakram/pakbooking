import streamlit as st
import os
import sys
import django
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.append(str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.wsgi import get_wsgi_application
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# Import your Django models and views
from users.models import User
from listings.models import Property
from bookings.models import Booking
from notifications.models import Notification

# Configure Streamlit page
st.set_page_config(
    page_title="PakBooking API Server",
    page_icon="🏨",
    layout="wide"
)

# Main Streamlit app
def main():
    st.title("🏨 PakBooking API Server")
    st.markdown("---")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Total Users", User.objects.count())
    
    with col2:
        st.metric("Total Properties", Property.objects.count())
    
    with col3:
        st.metric("Total Bookings", Booking.objects.count())
    
    st.markdown("---")
    
    # API Status
    st.subheader("🚀 API Endpoints Status")
    
    endpoints = [
        ("Authentication", "/api/auth/", "🔐"),
        ("Properties", "/api/listings/", "🏨"),
        ("Bookings", "/api/bookings/", "📋"),
        ("Notifications", "/api/notifications/", "🔔"),
        ("Admin Panel", "/admin/", "👨‍💼"),
        ("API Docs", "/api/docs/", "📚")
    ]
    
    for name, endpoint, icon in endpoints:
        st.write(f"{icon} **{name}**: `{endpoint}`")
    
    st.markdown("---")
    
    # Recent Activity
    st.subheader("📊 Recent Activity")
    
    # Recent bookings
    recent_bookings = Booking.objects.select_related('user', 'property').order_by('-created_at')[:5]
    
    if recent_bookings:
        st.write("**Recent Bookings:**")
        for booking in recent_bookings:
            st.write(f"- {booking.user.email} booked {booking.property.title} ({booking.status})")
    else:
        st.write("No recent bookings")
    
    st.markdown("---")
    
    # System Information
    st.subheader("ℹ️ System Information")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Environment:**")
        st.write(f"- Django Version: {django.get_version()}")
        st.write(f"- Debug Mode: {os.environ.get('DEBUG', 'False')}")
        st.write(f"- Database: PostgreSQL")
    
    with col2:
        st.write("**Deployment:**")
        st.write(f"- Platform: Streamlit Cloud")
        st.write(f"- Python Version: {sys.version}")
        st.write(f"- Working Directory: {os.getcwd()}")
    
    # Footer
    st.markdown("---")
    st.markdown("**PakBooking API Server** - Powered by Django + Streamlit Cloud")

if __name__ == "__main__":
    main()
