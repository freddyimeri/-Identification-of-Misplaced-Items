# MisplaceAI/authentication/serializers.py

# This file defines serializers for the authentication app.
# Serializers are used to convert complex data types such as querysets and model instances 
# into native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
# They also provide deserialization, allowing parsed data to be converted back into complex types,
# after first validating the incoming data.

from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate

# Get the user model
UserModel = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = UserModel
        # Specify the fields to be included in the serialized output
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        """
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, data):
        """
        Validate the login data.
        """
        username = data.get('username')
        password = data.get('password')

        if username and password:
            # Authenticate the user
            user = authenticate(request=self.context.get('request'), username=username, password=password)

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        data['user'] = user
        return data
