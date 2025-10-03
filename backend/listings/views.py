from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters import rest_framework as filters
from .models import Property
from .serializers import PropertySerializer

class PropertyFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price_per_night", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="price_per_night", lookup_expr='lte')
    city = filters.CharFilter(field_name="city", lookup_expr='icontains')
    property_type = filters.CharFilter(field_name="property_type", lookup_expr='exact')
    
    class Meta:
        model = Property
        fields = ['city', 'property_type', 'max_guests', 'is_available', 'min_price', 'max_price']

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.owner == request.user

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.filter(is_available=True).order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'city', 'address']
    ordering_fields = ['price_per_night', 'created_at', 'rating', 'title']
    ordering = ['-rating']  # Default ordering by rating

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user) 