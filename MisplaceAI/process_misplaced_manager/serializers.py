# MisplaceAI/process_misplaced_manager/serializers.py

# This file defines the serializers for the process_misplaced_manager app.
# Serializers convert complex data types such as querysets and model instances 
# into native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
# They also provide deserialization, allowing parsed data to be converted back into complex types,
# after first validating the incoming data.

from rest_framework import serializers
from .models import UploadedImage, UploadedVideo, UserVideoFramePreference

# Serializer for the UserVideoFramePreference model
class UserVideoFramePreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for UserVideoFramePreference model, which handles user preferences for video frame processing.
    """
    class Meta:
        model = UserVideoFramePreference
        # Specify the fields that should be included in the serialized output
        fields = ['frame_interval', 'frame_delay']

# Serializer for the UploadedImage model
class UploadedImageSerializer(serializers.ModelSerializer):
    """
    Serializer for UploadedImage model, which handles the metadata of uploaded images.
    """
    class Meta:
        model = UploadedImage
        # Specify the fields that should be included in the serialized output
        fields = ['id', 'image', 'uploaded_at', 'user']
        # 'uploaded_at' is read-only and will be set automatically when the image is saved
        read_only_fields = ['uploaded_at']

# Serializer for the UploadedVideo model
class UploadedVideoSerializer(serializers.ModelSerializer):
    """
    Serializer for UploadedVideo model, which handles the metadata of uploaded videos.
    """
    class Meta:
        model = UploadedVideo
        # Specify the fields that should be included in the serialized output
        fields = ['id', 'video', 'uploaded_at', 'user', 'user_video_frame_preference']
