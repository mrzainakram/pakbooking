from django.db import models
from django.utils import timezone
from listings.models import Property
from django.conf import settings

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Contact information
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    special_requests = models.TextField(blank=True)
    
    # Status fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    
    # Payment fields
    payment_id = models.CharField(max_length=100, blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cancellation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Legacy field for backward compatibility
    confirmed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.property.title} by {self.user.email}"

    def get_nights(self):
        nights = (self.check_out - self.check_in).days
        # For same-day bookings, return 1 day minimum
        return max(nights, 1)

    def overlaps(self, start, end):
        return not (self.check_out <= start or self.check_in >= end)

    @staticmethod
    def is_available(property_obj, start, end):
        return not Booking.objects.filter(
            property=property_obj, 
            check_in__lt=end, 
            check_out__gt=start,
            status__in=['confirmed', 'pending']
        ).exists() 