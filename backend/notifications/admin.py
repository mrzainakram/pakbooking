from django.contrib import admin
from .models import Notification, BookingStatusHistory

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user_email', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at']
    list_per_page = 25
    
    def user_email(self, obj):
        return obj.user.email if obj.user else 'N/A'
    user_email.short_description = 'User Email'
    
    fieldsets = (
        ('Notification Info', {
            'fields': ('user', 'booking', 'notification_type', 'title', 'message')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(BookingStatusHistory)
class BookingStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['booking', 'old_status', 'new_status', 'changed_by', 'created_at']
    list_filter = ['old_status', 'new_status', 'created_at']
    search_fields = ['booking__id', 'reason', 'changed_by__email']
    readonly_fields = ['created_at']
    list_per_page = 25
    
    fieldsets = (
        ('Status Change', {
            'fields': ('booking', 'old_status', 'new_status', 'changed_by', 'reason')
        }),
        ('Financial Info', {
            'fields': ('refund_amount', 'deduction_amount'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
