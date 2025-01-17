# MisplaceAI/user_dashboard/serializers.py

# This file defines serializers for the user_dashboard app.
# Serializers are used to convert complex data types such as querysets and model instances 
# into native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
# They also provide deserialization, allowing parsed data to be converted back into complex types,
# after first validating the incoming data.

from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving user information.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user information.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        """
        Update the user instance with the validated data.
        """
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance

class UserUpdateEmailSerializer(serializers.Serializer):
    """
    Serializer for updating user email.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

class UserUpdateUsernameSerializer(serializers.Serializer):
    """
    Serializer for updating user username.
    """
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        """
        Check that the username is at least 3 characters long.
        """
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        return value

class UserUpdatePasswordSerializer(serializers.Serializer):
    """
    Serializer for updating user password.
    """
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        """
        Validate the format of the new password using Django's built-in validators.
        """
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
