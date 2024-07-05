# MisplaceAI/admin_app/serializers.py

# This file defines serializers for the admin_app.
# Serializers are used to convert complex data types such as querysets and model instances 
# into native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
# They also provide deserialization, allowing parsed data to be converted back into complex types,
# after first validating the incoming data.

from rest_framework import serializers
from django.contrib.auth.models import User

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    """
    class Meta:
        model = User
        # Specify the fields to be included in the serialized output
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'is_active', 'is_staff', 'is_superuser', 'groups']
