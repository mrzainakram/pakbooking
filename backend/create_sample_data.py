import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from listings.models import Property
from users.models import User

# Create sample hotels
hotels_data = [
    {
        'title': 'Serena Hotel Islamabad',
        'description': 'Luxury 5-star hotel in the heart of Islamabad with stunning mountain views and world-class amenities.',
        'city': 'Islamabad',
        'address': 'Khayaban-e-Suharwardy, G-5/1, Islamabad',
        'price_per_night': 25000.00,
        'max_guests': 4,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', '24/7 Reception', 'Gym', 'Room Service'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.8,
    },
    {
        'title': 'Pearl Continental Lahore',
        'description': 'Historic luxury hotel in Lahore with traditional Pakistani hospitality and modern facilities.',
        'city': 'Lahore',
        'address': 'Shahrah-e-Quaid-e-Azam, Lahore',
        'price_per_night': 22000.00,
        'max_guests': 3,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Swimming Pool', 'Restaurant', 'Parking', 'Laundry Service', 'Air Conditioning'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.6,
    },
    {
        'title': 'Movenpick Hotel Karachi',
        'description': 'Contemporary beachfront hotel offering spectacular views of the Arabian Sea.',
        'city': 'Karachi',
        'address': 'Club Road, Karachi',
        'price_per_night': 28000.00,
        'max_guests': 2,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.7,
    },
    {
        'title': 'Shangrila Resort Skardu',
        'description': 'Mountain resort with breathtaking views of Shangrila Lake and Karakoram mountains.',
        'city': 'Skardu',
        'address': 'Kachura Lake, Skardu',
        'price_per_night': 15000.00,
        'max_guests': 6,
        'property_type': 'resort',
        'amenities': ['WiFi', 'Restaurant', 'Lake View', 'Hiking', 'Boating', 'Parking'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.9,
    },
    {
        'title': 'Avari Hotel Lahore',
        'description': 'Elegant hotel in the heart of Lahore with easy access to historical sites.',
        'city': 'Lahore',
        'address': '87 Shahrah-e-Quaid-e-Azam, Lahore',
        'price_per_night': 18000.00,
        'max_guests': 4,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Restaurant', 'Parking', 'Room Service', 'Air Conditioning'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.4,
    },
    {
        'title': 'Marriott Hotel Islamabad',
        'description': 'International luxury hotel with premium amenities and services.',
        'city': 'Islamabad',
        'address': 'Aga Khan Road, Shalimar 5, Islamabad',
        'price_per_night': 30000.00,
        'max_guests': 2,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym', '24/7 Reception', 'Room Service'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.8,
    },
    {
        'title': 'Faletti\'s Hotel Lahore',
        'description': 'Historic heritage hotel with colonial architecture and modern comforts.',
        'city': 'Lahore',
        'address': 'Egerton Road, Lahore',
        'price_per_night': 16000.00,
        'max_guests': 3,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Restaurant', 'Heritage Building', 'Parking', 'Room Service'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.3,
    },
    {
        'title': 'Ramada Creek Hotel Karachi',
        'description': 'Waterfront hotel with marina views and excellent dining options.',
        'city': 'Karachi',
        'address': 'DHA Phase VIII, Karachi',
        'price_per_night': 20000.00,
        'max_guests': 4,
        'property_type': 'hotel',
        'amenities': ['WiFi', 'Swimming Pool', 'Restaurant', 'Marina View', 'Parking', 'Gym'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.5,
    },
    {
        'title': 'Hunza Serena Inn',
        'description': 'Boutique mountain inn with spectacular views of Rakaposhi peak.',
        'city': 'Hunza',
        'address': 'Karimabad, Hunza Valley',
        'price_per_night': 12000.00,
        'max_guests': 2,
        'property_type': 'guest_house',
        'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Hiking', 'Cultural Tours'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.6,
    },
    {
        'title': 'Nathia Gali Resort',
        'description': 'Hill station resort perfect for summer getaways with cool mountain air.',
        'city': 'Nathia Gali',
        'address': 'Mall Road, Nathia Gali',
        'price_per_night': 8000.00,
        'max_guests': 5,
        'property_type': 'resort',
        'amenities': ['WiFi', 'Restaurant', 'Mountain View', 'Hiking', 'Parking'],
        'is_available': True,
        'image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        'rating': 4.2,
    },
]

# Get or create admin user
admin_user, created = User.objects.get_or_create(
    email='admin@bookpakistan.com',
    defaults={
        'first_name': 'Admin',
        'last_name': 'User',
        'is_staff': True,
        'is_superuser': True,
    }
)

# Create hotels
for hotel_data in hotels_data:
    property_obj, created = Property.objects.get_or_create(
        title=hotel_data['title'],
        defaults={
            **hotel_data,
            'owner': admin_user,
        }
    )
    if created:
        print(f"Created: {property_obj.title}")
    else:
        print(f"Already exists: {property_obj.title}")

print(f"\nTotal properties in database: {Property.objects.count()}")
