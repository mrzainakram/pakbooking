from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from decimal import Decimal
from django.utils import timezone

from .models import Notification, BookingStatusHistory
from .serializers import (
    NotificationSerializer, 
    BookingStatusHistorySerializer,
    BookingStatusUpdateSerializer,
    BookingCancellationSerializer
)
from bookings.models import Booking

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})
    
    def destroy(self, request, *args, **kwargs):
        """Only admin can delete notifications"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admin can delete notifications'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

class BookingStatusViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingStatusUpdateSerializer
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Admin can update booking status"""
        booking = get_object_or_404(Booking, pk=pk)
        serializer = BookingStatusUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            old_status = booking.status
            new_status = serializer.validated_data['status']
            reason = serializer.validated_data.get('reason', '')
            
            # Update booking status
            booking.status = new_status
            booking.save()
            
            # Create status history
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status=new_status,
                changed_by=request.user,
                reason=reason or f'Status updated by admin from {old_status} to {new_status}'
            )
            
            return Response({
                'status': 'success',
                'message': f'Booking status updated from {old_status} to {new_status}',
                'booking_id': booking.id,
                'new_status': new_status
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel_booking(self, request, pk=None):
        """User can cancel their own booking"""
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        
        # Check if booking can be cancelled
        if booking.status in ['cancelled', 'completed', 'refunded']:
            return Response(
                {'error': f'Cannot cancel booking with status: {booking.status}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BookingCancellationSerializer(data=request.data)
        
        if serializer.is_valid():
            reason = serializer.validated_data.get('reason', 'Cancelled by user')
            request_refund = serializer.validated_data.get('request_refund', True)
            
            old_status = booking.status
            booking.status = 'cancelled'
            
            # Calculate refund with 2% deduction
            if request_refund:
                deduction_percentage = Decimal('0.02')  # 2%
                deduction_amount = booking.total_price * deduction_percentage
                refund_amount = booking.total_price - deduction_amount
                
                booking.refund_amount = refund_amount
                booking.cancellation_fee = deduction_amount
            
            booking.save()
            
            # Create status history
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status='cancelled',
                changed_by=request.user,
                reason=reason,
                refund_amount=booking.refund_amount,
                deduction_amount=booking.cancellation_fee
            )
            
            response_data = {
                'status': 'success',
                'message': 'Booking cancelled successfully',
                'booking_id': booking.id,
                'refund_requested': request_refund
            }
            
            if request_refund:
                response_data.update({
                    'original_amount': str(booking.total_price),
                    'deduction_amount': str(booking.cancellation_fee),
                    'refund_amount': str(booking.refund_amount),
                    'deduction_percentage': '2%'
                })
            
            return Response(response_data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def status_history(self, request, pk=None):
        """Get booking status history"""
        booking = get_object_or_404(Booking, pk=pk)
        
        # Users can only see their own booking history, admins can see all
        if not request.user.is_staff and booking.user != request.user:
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        history = BookingStatusHistory.objects.filter(booking=booking)
        serializer = BookingStatusHistorySerializer(history, many=True)
        
        return Response({
            'booking_id': booking.id,
            'current_status': booking.status,
            'history': serializer.data
        })