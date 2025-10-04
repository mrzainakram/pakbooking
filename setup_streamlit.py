#!/usr/bin/env python3
"""
Setup script for Streamlit Cloud deployment
This script initializes the Django application and creates sample data
"""

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

from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model
from listings.models import Property
from decimal import Decimal

def setup_database():
    """Initialize database with migrations and sample data"""
    print("🔄 Setting up database...")
    
    # Run migrations
    execute_from_command_line(['manage.py', 'migrate'])
    print("✅ Database migrations completed")
    
    # Create superuser if not exists
    User = get_user_model()
    if not User.objects.filter(email='admin@bookpakistan.com').exists():
        admin_user = User.objects.create_superuser(
            email='admin@bookpakistan.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print("✅ Admin user created: admin@bookpakistan.com / admin123")
    else:
        print("ℹ️ Admin user already exists")
    
    # Create sample properties if not exist
    if not Property.objects.exists():
        create_sample_properties()
        print("✅ Sample properties created")
    else:
        print("ℹ️ Properties already exist")
    
    print("🎉 Database setup completed!")

def create_sample_properties():
    """Create sample hotel properties"""
    User = get_user_model()
    admin_user = User.objects.get(email='admin@bookpakistan.com')
    
    properties_data = [
        {
            'title': 'Serena Hotel Islamabad',
            'description': 'Luxury 5-star hotel in the heart of Islamabad with stunning mountain views and world-class amenities.',
            'city': 'Islamabad',
            'address': 'Khayaban-e-Suharwardy, G-5/1, Islamabad',
            'price_per_night': Decimal('25000.00'),
            'max_guests': 4,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', '24/7 Reception', 'Gym', 'Room Service'],
            'is_available': True,
            'rating': 4.8,
        },
        {
            'title': 'Pearl Continental Lahore',
            'description': 'Historic luxury hotel in Lahore with traditional Pakistani hospitality and modern facilities.',
            'city': 'Lahore',
            'address': 'Shahrah-e-Quaid-e-Azam, Lahore',
            'price_per_night': Decimal('22000.00'),
            'max_guests': 3,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Swimming Pool', 'Restaurant', 'Parking', 'Laundry Service', 'Air Conditioning'],
            'is_available': True,
            'rating': 4.6,
        },
        {
            'title': 'Movenpick Hotel Karachi',
            'description': 'Contemporary beachfront hotel offering spectacular views of the Arabian Sea.',
            'city': 'Karachi',
            'address': 'Club Road, Karachi',
            'price_per_night': Decimal('28000.00'),
            'max_guests': 2,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym'],
            'is_available': True,
            'rating': 4.7,
        },
        {
            'title': 'Shangrila Resort Skardu',
            'description': 'Mountain resort with breathtaking views of Shangrila Lake and Karakoram mountains.',
            'city': 'Skardu',
            'address': 'Kachura Lake, Skardu',
            'price_per_night': Decimal('15000.00'),
            'max_guests': 6,
            'property_type': 'resort',
            'amenities': ['WiFi', 'Restaurant', 'Lake View', 'Hiking', 'Boating', 'Parking'],
            'is_available': True,
            'rating': 4.9,
        },
        {
            'title': 'Marriott Hotel Islamabad',
            'description': 'International luxury hotel with premium amenities and services.',
            'city': 'Islamabad',
            'address': 'Aga Khan Road, Shalimar 5, Islamabad',
            'price_per_night': Decimal('30000.00'),
            'max_guests': 2,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', '24/7 Reception', 'Room Service'],
            'is_available': True,
            'rating': 4.8,
        }
    ]
    
    for prop_data in properties_data:
        Property.objects.create(
            owner=admin_user,
            **prop_data
        )

if __name__ == "__main__":
    setup_database()
