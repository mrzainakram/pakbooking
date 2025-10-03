from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Booking
from listings.models import Property
from listings.serializers import PropertySerializer

class BookingSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source='property', read_only=True)
    nights = serializers.ReadOnlyField(source='get_nights')
    
    class Meta:
        model = Booking
        fields = (
            'id', 'property', 'property_details', 'user', 'check_in', 'check_out', 
            'guests', 'total_price', 'contact_phone', 'contact_email', 'special_requests',
            'status', 'payment_status', 'payment_id', 'refund_amount', 'cancellation_fee',
            'nights', 'created_at', 'updated_at', 'confirmed'
        )
        read_only_fields = ('user', 'total_price', 'nights', 'confirmed')

    def validate(self, attrs):
        check_in = attrs['check_in']
        check_out = attrs['check_out']
        
        # Validate dates
        if check_in > check_out:
            raise serializers.ValidationError('Check-out date must be after check-in date')
        
        # Allow same-day bookings (day use)
        if check_in == check_out:
            # Same day booking - this is allowed for day use
            pass
        
        if check_in < timezone.now().date():
            raise serializers.ValidationError('Check-in date cannot be in the past')
        
        property_obj = attrs['property']
        
        # Check availability
        if not Booking.is_available(property_obj, check_in, check_out):
            raise serializers.ValidationError('Property not available for selected dates')
        
        # Validate guest count
        if attrs['guests'] > property_obj.max_guests:
            raise serializers.ValidationError(f'Maximum {property_obj.max_guests} guests allowed')
        
        if attrs['guests'] < 1:
            raise serializers.ValidationError('At least 1 guest required')
        
        # Calculate total price
        nights = (check_out - check_in).days
        # For same-day bookings, charge for 1 day minimum
        if nights == 0:
            nights = 1
        attrs['total_price'] = property_obj.price_per_night * nights
        
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Set default contact email to user's email if not provided
        if not validated_data.get('contact_email'):
            validated_data['contact_email'] = self.context['request'].user.email
        return super().create(validated_data) 