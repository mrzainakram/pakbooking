from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'user_email', 'property_name', 'check_in', 'check_out', 
        'guests', 'total_price', 'status_badge', 'payment_status', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at', 'check_in']
    search_fields = [
        'user__email', 'user__first_name', 'user__last_name', 
        'property__title', 'property__city', 'contact_phone', 'contact_email'
    ]
    readonly_fields = ['created_at', 'updated_at', 'total_price', 'nights_display']
    list_per_page = 25
    date_hierarchy = 'check_in'
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('property', 'user', 'check_in', 'check_out', 'guests', 'nights_display')
        }),
        ('Contact Details', {
            'fields': ('contact_phone', 'contact_email', 'special_requests'),
            'classes': ('collapse',)
        }),
        ('Status & Payment', {
            'fields': ('status', 'payment_status', 'payment_id')
        }),
        ('Financial Details', {
            'fields': ('total_price', 'refund_amount', 'cancellation_fee'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['confirm_bookings', 'cancel_bookings', 'complete_bookings']
    
    def booking_id(self, obj):
        return f"#{obj.id}"
    booking_id.short_description = 'Booking ID'
    
    def user_email(self, obj):
        return obj.user.email if obj.user else 'N/A'
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def property_name(self, obj):
        return obj.property.title if obj.property else 'N/A'
    property_name.short_description = 'Property'
    property_name.admin_order_field = 'property__title'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#fbbf24',      # Yellow
            'confirmed': '#10b981',    # Green
            'cancelled': '#ef4444',    # Red
            'completed': '#3b82f6',    # Blue
            'refunded': '#8b5cf6',     # Purple
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 8px; '
            'border-radius: 4px; font-size: 12px; font-weight: bold;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def nights_display(self, obj):
        return f"{obj.get_nights()} night(s)"
    nights_display.short_description = 'Nights'
    
    def confirm_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.filter(status='pending'):
            booking.status = 'confirmed'
            booking.save()
            updated += 1
        
        self.message_user(
            request, 
            f'{updated} booking(s) confirmed successfully. Notifications sent to users.'
        )
    confirm_bookings.short_description = "Confirm selected bookings"
    
    def cancel_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.filter(status__in=['pending', 'confirmed']):
            booking.status = 'cancelled'
            # Calculate refund (98% of total price)
            booking.refund_amount = booking.total_price * 0.98
            booking.save()
            updated += 1
        
        self.message_user(
            request, 
            f'{updated} booking(s) cancelled successfully. Refund notifications sent.'
        )
    cancel_bookings.short_description = "Cancel selected bookings"
    
    def complete_bookings(self, request, queryset):
        updated = 0
        for booking in queryset.filter(status='confirmed'):
            booking.status = 'completed'
            booking.save()
            updated += 1
        
        self.message_user(
            request, 
            f'{updated} booking(s) marked as completed.'
        )
    complete_bookings.short_description = "Mark selected bookings as completed"
