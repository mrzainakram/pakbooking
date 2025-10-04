from rest_framework import status, viewsets, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, Favorite
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, FavoriteSerializer, FavoriteCreateSerializer
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                # Create user
                user = User.objects.create_user(
                    email=serializer.validated_data['email'],
                    password=serializer.validated_data['password'],
                    first_name=serializer.validated_data.get('first_name', ''),
                    last_name=serializer.validated_data.get('last_name', ''),
                    is_active=True  # Auto-activate for now
                )
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': str(user.id),
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_active': user.is_active,
                    }
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'detail': 'Registration failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                password = serializer.validated_data['password']
                
                # Authenticate user
                try:
                    user = User.objects.get(email=email)
                    if user.check_password(password):
                        if not user.is_active:
                            return Response({
                                'detail': 'Account is not activated.'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Generate tokens
                        refresh = RefreshToken.for_user(user)
                        
                        return Response({
                            'access': str(refresh.access_token),
                            'refresh': str(refresh),
                            'user': {
                                'id': str(user.id),
                                'email': user.email,
                                'first_name': user.first_name,
                                'last_name': user.last_name,
                                'is_active': user.is_active,
                            }
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            'detail': 'Invalid email or password.'
                        }, status=status.HTTP_400_BAD_REQUEST)
                        
                except User.DoesNotExist:
                    return Response({
                        'detail': 'Invalid email or password.'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'detail': 'Login failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None  # No serializer needed for logout
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    # Try to blacklist if the package supports it
                    if hasattr(token, 'blacklist'):
                        token.blacklist()
                except Exception as token_error:
                    # If blacklisting fails, just log it but still return success
                    logger.warning(f"Token blacklist failed: {str(token_error)}")
            
            return Response({
                'detail': 'Successfully logged out.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'detail': 'Logout successful.'
            }, status=status.HTTP_200_OK)

class UserProfileView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get(self, request):
        """Get current user info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FavoriteCreateSerializer
        return FavoriteSerializer
    
    def create(self, request, *args, **kwargs):
        """Add property to favorites"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                if 'unique constraint' in str(e).lower():
                    return Response({
                        'detail': 'Property already in favorites'
                    }, status=status.HTTP_400_BAD_REQUEST)
                return Response({
                    'detail': 'Failed to add to favorites'
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Remove property from favorites"""
        try:
            # The pk here is the property ID, not the favorite ID
            property_id = kwargs.get('pk')
            favorite = get_object_or_404(
                Favorite, 
                user=request.user, 
                property_id=property_id
            )
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'detail': 'Failed to remove from favorites'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def check(self, request, pk=None):
        """Check if property is in favorites"""
        try:
            favorite = Favorite.objects.filter(
                user=request.user, 
                property_id=pk
            ).exists()
            return Response({'is_favorite': favorite})
        except Exception as e:
            return Response({'is_favorite': False})
