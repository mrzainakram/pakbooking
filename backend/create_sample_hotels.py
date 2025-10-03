#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from listings.models import Property
from users.models import User
from decimal import Decimal

def create_sample_hotels():
    # Create or get admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@pakbooking.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'is_active': True,
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"Created admin user: {admin_user.email}")

    # Sample hotels data
    hotels_data = [
        {
            'title': 'Pearl Continental Lahore',
            'description': 'Luxury hotel in the heart of Lahore with world-class amenities near Badshahi Mosque. Experience traditional Pakistani hospitality with modern comfort.',
            'city': 'Lahore',
            'address': 'Shahrah-e-Quaid-e-Azam, Lahore, Punjab',
            'price_per_night': Decimal('15000.00'),
            'max_guests': 4,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Room Service'],
            'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
            'rating': Decimal('4.8')
        },
        {
            'title': 'Serena Hotel Islamabad',
            'description': 'Premium business hotel with stunning Margalla Hills views. Perfect for business travelers and tourists exploring the capital.',
            'city': 'Islamabad',
            'address': 'Khayaban-e-Suharwardy, Islamabad',
            'price_per_night': Decimal('18000.00'),
            'max_guests': 3,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Business Center', 'Restaurant', 'Parking', 'Conference Rooms', 'Concierge'],
            'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
            'rating': Decimal('4.9')
        },
        {
            'title': 'Movenpick Hotel Karachi',
            'description': 'Modern hotel near Clifton Beach and Port Grand. Enjoy the vibrant city life of Karachi with easy access to business districts.',
            'city': 'Karachi',
            'address': 'Club Road, Karachi, Sindh',
            'price_per_night': Decimal('12000.00'),
            'max_guests': 4,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Pool', 'Parking', 'Room Service', 'Fitness Center', 'Beach Access'],
            'image_url': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
            'rating': Decimal('4.7')
        },
        {
            'title': 'Hunza Serena Inn',
            'description': 'Breathtaking mountain resort with views of Rakaposhi and Ultar Sar peaks. Experience the beauty of northern Pakistan.',
            'city': 'Hunza',
            'address': 'Karimabad, Hunza Valley, Gilgit-Baltistan',
            'price_per_night': Decimal('25000.00'),
            'max_guests': 2,
            'property_type': 'resort',
            'amenities': ['WiFi', 'Mountain View', 'Restaurant', 'Garden', 'Trekking Guide', 'Cultural Tours'],
            'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'rating': Decimal('5.0')
        },
        {
            'title': 'PC Hotel Muzaffarabad',
            'description': 'Scenic hotel overlooking the confluence of Neelum and Jhelum rivers. Gateway to beautiful Azad Kashmir.',
            'city': 'Muzaffarabad',
            'address': 'Chatter, Muzaffarabad, Azad Kashmir',
            'price_per_night': Decimal('11000.00'),
            'max_guests': 3,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Conference', 'River View', 'Local Tours'],
            'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
            'rating': Decimal('4.6')
        },
        {
            'title': 'Hotel Faisalabad',
            'description': 'Business hotel in the textile capital of Pakistan. Perfect for business travelers and industrial visits.',
            'city': 'Faisalabad',
            'address': 'Jinnah Colony, Faisalabad, Punjab',
            'price_per_night': Decimal('8000.00'),
            'max_guests': 4,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Restaurant', 'Parking', 'Conference', 'Business Center', 'Laundry'],
            'image_url': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
            'rating': Decimal('4.3')
        },
        {
            'title': 'Shangrila Resort Skardu',
            'description': 'Paradise on earth resort on the shores of Lower Kachura Lake. Experience the magic of Baltistan.',
            'city': 'Skardu',
            'address': 'Kachura Lake, Skardu, Gilgit-Baltistan',
            'price_per_night': Decimal('22000.00'),
            'max_guests': 2,
            'property_type': 'resort',
            'amenities': ['Lake View', 'Restaurant', 'Garden', 'Boating', 'Fishing', 'Mountain Trekking'],
            'image_url': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
            'rating': Decimal('4.9')
        },
        {
            'title': 'Hotel One Multan',
            'description': 'Modern accommodation in the city of saints and shrines. Explore the rich cultural heritage of South Punjab.',
            'city': 'Multan',
            'address': 'Abdali Road, Multan, Punjab',
            'price_per_night': Decimal('9500.00'),
            'max_guests': 3,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Restaurant', 'Parking', 'Business Center', 'Cultural Tours', 'Airport Shuttle'],
            'image_url': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
            'rating': Decimal('4.4')
        },
        {
            'title': 'Peach Tree Hotel Peshawar',
            'description': 'Gateway hotel to explore the historic Khyber Pass region. Rich in Pashtun culture and history.',
            'city': 'Peshawar',
            'address': 'University Road, Peshawar, Khyber Pakhtunkhwa',
            'price_per_night': Decimal('10000.00'),
            'max_guests': 4,
            'property_type': 'hotel',
            'amenities': ['WiFi', 'Restaurant', 'Cultural Tours', 'Parking', 'Historical Tours', 'Local Cuisine'],
            'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
            'rating': Decimal('4.2')
        }
    ]

    created_count = 0
    for hotel_data in hotels_data:
        property_obj, created = Property.objects.get_or_create(
            title=hotel_data['title'],
            defaults={
                'owner': admin_user,
                **hotel_data
            }
        )
        if created:
            created_count += 1
            print(f"Created hotel: {property_obj.title}")

    print(f"\nSample data creation complete!")
    print(f"Created {created_count} new hotels")
    print(f"Total hotels in database: {Property.objects.count()}")
    print(f"Admin user: admin@pakbooking.com / admin123")

if __name__ == '__main__':
    create_sample_hotels()
