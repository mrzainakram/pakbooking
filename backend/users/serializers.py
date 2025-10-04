from rest_framework import serializers
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import User, EmailOTP, Favorite
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user, created = User.objects.get_or_create(
            email=validated_data['email'],
            defaults={
                'first_name': validated_data.get('first_name', ''),
                'last_name': validated_data.get('last_name', ''),
            }
        )
        if created:
            user.set_password(validated_data['password'])
            user.is_active = True  # Auto activate for now
            user.save()
        else:
            # User already exists, just return
            pass
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials')
        
        if not user.is_active:
            raise serializers.ValidationError('Account not activated')
        
        attrs['user'] = user
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found')
        try:
            otp = EmailOTP.objects.filter(user=user, code=attrs['code']).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError('Invalid code')
        if not otp.is_valid():
            raise serializers.ValidationError('Code expired or used')
        attrs['user'] = user
        attrs['otp'] = otp
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        otp = self.validated_data['otp']
        user.is_active = True
        user.save(update_fields=['is_active'])
        otp.used = True
        otp.save(update_fields=['used'])
        return user

class OTPLoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found')
        code = EmailOTP.generate_code()
        EmailOTP.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timezone.timedelta(minutes=10)
        )
        # Skip email for now
        return {'detail': 'OTP sent to email'}

class OTPLoginVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found')
        try:
            otp = EmailOTP.objects.filter(user=user, code=attrs['code']).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError('Invalid code')
        if not otp.is_valid():
            raise serializers.ValidationError('Code expired or used')
        attrs['user'] = user
        attrs['otp'] = otp
        return attrs

    def create(self, validated_data):
        user = validated_data['user']
        otp = validated_data['otp']
        otp.used = True
        otp.save(update_fields=['used'])
        # Issue JWT
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active')

class FavoriteSerializer(serializers.ModelSerializer):
    property = serializers.SerializerMethodField()
    
    class Meta:
        model = Favorite
        fields = ('id', 'property', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_property(self, obj) -> dict:
        from listings.serializers import PropertySerializer
        return PropertySerializer(obj.property).data

class FavoriteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('property',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
