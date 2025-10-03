from django.db import models
from django.conf import settings
import uuid

class Property(models.Model):
    PROPERTY_TYPES = [
        ('hotel', 'Hotel'),
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('villa', 'Villa'),
        ('guest_house', 'Guest House'),
        ('resort', 'Resort'),
        ('hostel', 'Hostel'),
        ('cottage', 'Cottage'),
        ('cabin', 'Cabin'),
        ('luxury_suite', 'Luxury Suite'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    max_guests = models.PositiveIntegerField(default=1)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='hotel')
    amenities = models.JSONField(default=list, blank=True)
    image_url = models.URLField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.property.title} - Image"
