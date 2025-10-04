from rest_framework import serializers
from .models import Notification, BookingStatusHistory
from bookings.serializers import BookingSerializer

class NotificationSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 
            'is_read', 'created_at', 'time_ago', 'booking_details'
        ]
        read_only_fields = ['id', 'created_at', 'time_ago']
    
    def get_time_ago(self, obj) -> str:
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"

class BookingStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = BookingStatusHistory
        fields = [
            'id', 'old_status', 'new_status', 'changed_by_name', 
            'reason', 'refund_amount', 'deduction_amount', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class BookingStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed'),
            ('refunded', 'Refunded'),
        ]
    )
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True)
    admin_notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)

class BookingCancellationSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True)
    request_refund = serializers.BooleanField(default=True)
