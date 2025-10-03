from django.contrib import admin
from .models import Property, PropertyImage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'price_per_night', 'max_guests')
    search_fields = ('title', 'city', 'address')
    inlines = [PropertyImageInline] 