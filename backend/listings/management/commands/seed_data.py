from django.core.management.base import BaseCommand
from listings.models import Property
from users.models import User

class Command(BaseCommand):
    help = 'Seed sample hotel data'

    def handle(self, *args, **options):
        # Get or create admin user
        admin_user, created = User.objects.get_or_create(
            email='admin@bookpakistan.com',
            defaults={
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS('Created admin user')
            )

        # Sample hotels data
        hotels_data = [
            {
                'title': 'Serena Hotel Islamabad',
                'description': 'Luxury hotel in the heart of Islamabad with stunning mountain views',
                'city': 'Islamabad',
                'price_per_night': 25000,
                'max_guests': 4,
                'property_type': 'hotel',
                'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', '24/7 Reception'],
                'image_url': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.8
            },
            {
                'title': 'Pearl Continental Karachi',
                'description': 'Modern business hotel with excellent facilities in Karachi',
                'city': 'Karachi',
                'price_per_night': 18000,
                'max_guests': 3,
                'property_type': 'hotel',
                'amenities': ['WiFi', 'Gym', 'Business Center', 'Restaurant', 'Parking'],
                'image_url': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.6
            },
            {
                'title': 'Lahore Marriott Hotel',
                'description': 'Elegant hotel in Lahore with traditional Pakistani hospitality',
                'city': 'Lahore',
                'price_per_night': 22000,
                'max_guests': 4,
                'property_type': 'hotel',
                'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar'],
                'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.7
            },
            {
                'title': 'Swat Serena Hotel',
                'description': 'Mountain resort with breathtaking views of Swat Valley',
                'city': 'Swat',
                'price_per_night': 15000,
                'max_guests': 3,
                'property_type': 'resort',
                'amenities': ['WiFi', 'Garden', 'Restaurant', 'Mountain View', 'Hiking'],
                'image_url': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.9
            },
            {
                'title': 'Hunza Serena Inn',
                'description': 'Charming inn with panoramic views of Hunza Valley',
                'city': 'Hunza',
                'price_per_night': 12000,
                'max_guests': 2,
                'property_type': 'guest_house',
                'amenities': ['WiFi', 'Mountain View', 'Garden', 'Restaurant', 'Hiking'],
                'image_url': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
                'rating': 4.8
            }
        ]

        # Create properties
        for hotel_data in hotels_data:
            property_obj, created = Property.objects.get_or_create(
                title=hotel_data['title'],
                defaults={
                    'owner': admin_user,
                    'description': hotel_data['description'],
                    'city': hotel_data['city'],
                    'address': f"{hotel_data['city']}, Pakistan",
                    'price_per_night': hotel_data['price_per_night'],
                    'max_guests': hotel_data['max_guests'],
                    'property_type': hotel_data['property_type'],
                    'amenities': hotel_data['amenities'],
                    'image_url': hotel_data['image_url'],
                    'rating': hotel_data['rating'],
                    'is_available': True
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created property: {property_obj.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Property already exists: {property_obj.title}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully seeded hotel data!')
        )
