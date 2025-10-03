from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image')

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Property
        fields = (
            'id', 'owner', 'title', 'description', 'city', 'address',
            'price_per_night', 'max_guests', 'property_type', 'amenities',
            'image_url', 'is_available', 'rating', 'images', 'created_at', 'updated_at'
        )
        read_only_fields = ('owner',) 