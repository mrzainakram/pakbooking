from rest_framework import viewsets, permissions, decorators, status
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.utils import timezone
from decimal import Decimal
from .models import Booking
from listings.models import Property
from .serializers import BookingSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.user == request.user

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    # Safe default for schema generation and unauthenticated access during introspection
    queryset = Booking.objects.none()

    def get_queryset(self):
        # When generating schema, drf-spectacular sets swagger_fake_view
        if getattr(self, 'swagger_fake_view', False):  # pragma: no cover
            return Booking.objects.none()
        return Booking.objects.filter(user=self.request.user).select_related('property').order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        # Enhanced error handling for booking creation
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            # Log the error for debugging
            print(f"Booking creation error: {str(e)}")
            # Re-raise to let DRF handle the response
            raise

    @decorators.action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def availability(self, request):
        property_id = request.query_params.get('property')
        check_in = parse_date(request.query_params.get('check_in'))
        check_out = parse_date(request.query_params.get('check_out'))
        
        if not property_id or not check_in or not check_out:
            return Response({'detail': 'property, check_in, check_out required'}, status=400)
        
        try:
            prop = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'detail': 'Property not found'}, status=404)
        
        # Check if property is available for the given dates
        available = Booking.is_available(prop, check_in, check_out)
        
        return Response({
            'available': available,
            'property_id': property_id,
            'check_in': check_in,
            'check_out': check_out,
            'nights': (check_out - check_in).days,
            'price_per_night': prop.price_per_night,
            'max_guests': prop.max_guests
        })

    @decorators.action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking with 2% deduction"""
        booking = self.get_object()
        
        if booking.status in ['cancelled', 'completed', 'refunded']:
            return Response({
                'detail': f'Cannot cancel booking with status: {booking.status}'
            }, status=400)
        
        # Calculate refund with 2% deduction
        from decimal import Decimal
        deduction_percentage = Decimal('0.02')  # 2%
        deduction_amount = booking.total_price * deduction_percentage
        refund_amount = booking.total_price - deduction_amount
        
        # Update booking
        old_status = booking.status
        booking.status = 'cancelled'
        booking.refund_amount = refund_amount
        booking.cancellation_fee = deduction_amount
        booking.save()
        
        return Response({
            'detail': 'Booking cancelled successfully',
            'original_amount': str(booking.total_price),
            'deduction_amount': str(deduction_amount),
            'refund_amount': str(refund_amount),
            'deduction_percentage': '2%',
            'status': 'cancelled'
        })
    
    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def confirm_booking(self, request, pk=None):
        try:
            booking = self.get_queryset().get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'detail': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == 'confirmed':
            return Response({'detail': 'Booking is already confirmed'}, status=status.HTTP_400_BAD_REQUEST)
        
        if booking.status == 'cancelled':
            return Response({'detail': 'Cannot confirm a cancelled booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Confirm the booking
        booking.status = 'confirmed'
        booking.confirmed = True  # For backward compatibility
        booking.save()
        
        return Response({'detail': 'Booking confirmed successfully'}, status=status.HTTP_200_OK)

    @decorators.action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking (admin only)"""
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied'}, status=403)
        
        booking = self.get_object()
        booking.status = 'confirmed'
        booking.confirmed = True
        booking.save()
        
        return Response({'detail': 'Booking confirmed successfully'})

    @decorators.action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def calculate_price(self, request):
        """Calculate booking price"""
        property_id = request.data.get('property_id')
        check_in = parse_date(request.data.get('check_in'))
        check_out = parse_date(request.data.get('check_out'))
        guests = request.data.get('guests', 1)
        
        if not property_id or not check_in or not check_out:
            return Response({'detail': 'property_id, check_in, check_out required'}, status=400)
        
        try:
            prop = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'detail': 'Property not found'}, status=404)
        
        from decimal import Decimal
        
        nights = (check_out - check_in).days
        base_price = prop.price_per_night * nights
        taxes = base_price * Decimal('0.05')  # 5% tax
        total_price = base_price + taxes
        
        return Response({
            'property_id': property_id,
            'nights': nights,
            'base_price': base_price,
            'taxes': taxes,
            'total_price': total_price,
            'price_per_night': prop.price_per_night,
            'guests': guests,
            'max_guests': prop.max_guests
        })
    
    @decorators.action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark booking as completed (admin only)"""
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied'}, status=403)
        
        booking = self.get_object()
        
        if booking.status != 'confirmed':
            return Response({
                'detail': 'Only confirmed bookings can be marked as completed'
            }, status=400)
        
        booking.status = 'completed'
        booking.save()
        
        return Response({
            'detail': 'Booking marked as completed',
            'booking_id': booking.id,
            'status': booking.status
        })
    
    @decorators.action(detail=True, methods=['post'])
    def admin_cancel(self, request, pk=None):
        """Cancel booking (admin only) - full refund"""
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied'}, status=403)
        
        booking = self.get_object()
        
        if booking.status in ['cancelled', 'refunded']:
            return Response({'detail': 'Booking already cancelled'}, status=400)
        
        # Admin cancellation - full refund
        booking.status = 'cancelled'
        booking.refund_amount = booking.total_price  # Full refund for admin cancellation
        booking.cancellation_fee = 0
        booking.save()
        
        return Response({
            'detail': 'Booking cancelled by admin',
            'booking_id': booking.id,
            'status': booking.status,
            'refund_amount': str(booking.refund_amount)
        })
    
    @decorators.action(detail=True, methods=['post'])
    def user_confirm(self, request, pk=None):
        """User confirms their own booking"""
        booking = self.get_object()
        
        if booking.status != 'pending':
            return Response({
                'detail': f'Cannot confirm booking with status: {booking.status}'
            }, status=400)
        
        # User confirms booking
        booking.status = 'confirmed'
        booking.confirmed = True
        booking.save()
        
        return Response({
            'detail': 'Booking confirmed successfully',
            'booking_id': booking.id,
            'status': booking.status,
            'message': 'Your booking has been confirmed! You will receive a detailed receipt.'
        })
    
    @decorators.action(detail=True, methods=['post'])
    def user_complete(self, request, pk=None):
        """User marks their booking as completed after stay"""
        booking = self.get_object()
        
        if booking.status != 'confirmed':
            return Response({
                'detail': 'Only confirmed bookings can be marked as completed'
            }, status=400)
        
        # Check if check-out date has passed
        from django.utils import timezone
        if booking.check_out > timezone.now().date():
            return Response({
                'detail': 'Cannot complete booking before check-out date'
            }, status=400)
        
        booking.status = 'completed'
        booking.save()
        
        return Response({
            'detail': 'Booking marked as completed',
            'booking_id': booking.id,
            'status': booking.status,
            'message': 'Thank you for your stay! Please consider leaving a review.'
        })
    
    @decorators.action(detail=True, methods=['get'])
    def receipt(self, request, pk=None):
        """Generate detailed booking receipt"""
        booking = self.get_object()
        
        # Calculate nights and pricing breakdown
        nights = booking.get_nights()
        base_price = booking.property.price_per_night * nights
        
        # Tax and fee calculations
        from decimal import Decimal
        tax_rate = Decimal('0.05')  # 5%
        service_fee_rate = Decimal('0.02')  # 2%
        
        tax_amount = base_price * tax_rate
        service_fee = base_price * service_fee_rate
        subtotal = base_price + tax_amount + service_fee
        
        receipt_data = {
            'booking_id': booking.id,
            'booking_status': booking.status,
            'created_at': booking.created_at,
            'updated_at': booking.updated_at,
            
            # Guest Information
            'guest_info': {
                'name': f"{booking.user.first_name} {booking.user.last_name}",
                'email': booking.user.email,
                'contact_phone': booking.contact_phone,
                'contact_email': booking.contact_email,
            },
            
            # Property Information
            'property_info': {
                'name': booking.property.title,
                'address': booking.property.address,
                'city': booking.property.city,
                'type': booking.property.property_type,
            },
            
            # Booking Details
            'booking_details': {
                'check_in': booking.check_in,
                'check_out': booking.check_out,
                'nights': nights,
                'guests': booking.guests,
                'special_requests': booking.special_requests,
            },
            
            # Pricing Breakdown
            'pricing': {
                'price_per_night': str(booking.property.price_per_night),
                'nights': nights,
                'base_price': str(base_price),
                'tax_amount': str(tax_amount),
                'service_fee': str(service_fee),
                'subtotal': str(subtotal),
                'total_paid': str(booking.total_price),
            },
            
            # Payment Information
            'payment_info': {
                'payment_status': booking.payment_status,
                'payment_id': booking.payment_id,
                'cancellation_fee': str(booking.cancellation_fee) if booking.cancellation_fee else None,
                'refund_amount': str(booking.refund_amount) if booking.refund_amount else None,
            },
            
            # Status Information
            'status_info': {
                'current_status': booking.status,
                'confirmed': booking.confirmed,
                'can_cancel': booking.status in ['pending', 'confirmed'],
                'can_complete': booking.status == 'confirmed' and booking.check_out <= timezone.now().date(),
            }
        }
        
        return Response({
            'receipt': receipt_data,
            'message': f'Receipt for booking #{booking.id}'
        })