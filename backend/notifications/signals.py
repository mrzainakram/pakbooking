from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from bookings.models import Booking
from .models import Notification, BookingStatusHistory
from decimal import Decimal

@receiver(pre_save, sender=Booking)
def track_booking_status_change(sender, instance, **kwargs):
    """Track booking status changes before saving"""
    if instance.pk:  # Only for existing bookings
        try:
            old_booking = Booking.objects.get(pk=instance.pk)
            instance._old_status = old_booking.status
        except Booking.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Booking)
def create_booking_notification(sender, instance, created, **kwargs):
    """Create notification when booking status changes"""
    
    if created:
        # New booking created
        Notification.objects.create(
            user=instance.user,
            booking=instance,
            notification_type='booking_pending',
            title='Booking Created',
            message=f'Your booking for {instance.property.title} has been created and is pending confirmation. Booking ID: #{instance.id}'
        )
        
        # Create status history
        BookingStatusHistory.objects.create(
            booking=instance,
            old_status='',
            new_status=instance.status,
            changed_by=instance.user,
            reason='Booking created'
        )
        
    else:
        # Status changed
        old_status = getattr(instance, '_old_status', None)
        if old_status and old_status != instance.status:
            
            # Create notification based on new status
            notification_data = get_notification_data(instance, old_status, instance.status)
            
            Notification.objects.create(
                user=instance.user,
                booking=instance,
                notification_type=notification_data['type'],
                title=notification_data['title'],
                message=notification_data['message']
            )
            
            # Create status history
            BookingStatusHistory.objects.create(
                booking=instance,
                old_status=old_status,
                new_status=instance.status,
                changed_by=instance.user,  # This should be set by the view
                reason=f'Status changed from {old_status} to {instance.status}'
            )

def get_notification_data(booking, old_status, new_status):
    """Get notification data based on status change"""
    
    notifications_map = {
        'confirmed': {
            'type': 'booking_confirmed',
            'title': '✅ Booking Confirmed!',
            'message': f'🎉 Congratulations! Your booking for {booking.property.title} has been confirmed.\n\n📋 Booking Details:\n• Booking ID: #{booking.id}\n• Check-in: {booking.check_in}\n• Check-out: {booking.check_out}\n• Guests: {booking.guests}\n• Total: PKR {booking.total_price}\n\n📄 Your detailed receipt is ready! View it in your dashboard.'
        },
        'cancelled': {
            'type': 'booking_cancelled',
            'title': '❌ Booking Cancelled',
            'message': f'Your booking for {booking.property.title} has been cancelled. If you cancelled this booking, refund will be processed with 2% deduction. Booking ID: #{booking.id}'
        },
        'completed': {
            'type': 'booking_completed',
            'title': '🎉 Stay Completed!',
            'message': f'Thank you for staying at {booking.property.title}! 🏨\n\n✨ We hope you had a wonderful experience!\n\n📋 Booking Summary:\n• Booking ID: #{booking.id}\n• Duration: {booking.check_in} to {booking.check_out}\n• Total Paid: PKR {booking.total_price}\n\n⭐ Please consider leaving a review to help other travelers!'
        },
        'refunded': {
            'type': 'booking_refunded',
            'title': '💰 Refund Processed',
            'message': f'Your refund for booking #{booking.id} has been processed. Amount: PKR {booking.refund_amount or 0}. Please allow 3-5 business days for the amount to reflect in your account.'
        },
        'pending': {
            'type': 'booking_pending',
            'title': '⏳ Booking Pending',
            'message': f'Your booking for {booking.property.title} is pending confirmation. We will notify you once it\'s confirmed. Booking ID: #{booking.id}'
        }
    }
    
    return notifications_map.get(new_status, {
        'type': 'booking_pending',
        'title': 'Booking Status Updated',
        'message': f'Your booking status has been updated to {new_status}. Booking ID: #{booking.id}'
    })
