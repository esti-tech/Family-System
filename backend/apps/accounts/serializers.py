import re
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from apps.accounts.models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['avatar_media_id', 'bio', 'location_country', 'location_city', 'timezone']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone_number', 'status',
            'is_verified', 'is_staff', 'is_superuser',
            'preferred_language', 'last_login_at', 'created_at', 'profile'
        ]
        read_only_fields = ['id', 'status', 'is_verified', 'is_staff', 'is_superuser', 'last_login_at', 'created_at']

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=320)
    full_name = serializers.CharField(max_length=200)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    preferred_language = serializers.ChoiceField(choices=User.Language.choices, default=User.Language.EN)

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email=normalized, deleted_at__isnull=True).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return normalized

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        # Django standard password complexity check
        validate_password(data['password'])
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    remember_me = serializers.BooleanField(default=False)

class TokenRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

class EmailVerificationSerializer(serializers.Serializer):
    token_or_code = serializers.CharField(max_length=255)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(data['new_password'])
        return data

class UserUpdateSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(required=False, allow_blank=True)
    location_country = serializers.CharField(required=False, allow_blank=True, max_length=100)
    location_city = serializers.CharField(required=False, allow_blank=True, max_length=100)
    timezone = serializers.CharField(required=False, allow_blank=True, max_length=50)

    class Meta:
        model = User
        fields = ['full_name', 'phone_number', 'preferred_language', 'bio', 'location_country', 'location_city', 'timezone']

    def update(self, instance, validated_data):
        profile_data = {}
        for field in ['bio', 'location_country', 'location_city', 'timezone']:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

