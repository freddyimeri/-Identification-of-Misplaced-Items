# MisplaceAI/process_misplaced_manager/serializers.py

from rest_framework import serializers
from .models import UploadedImage, UploadedVideo, UserVideoFramePreference

class UserVideoFramePreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserVideoFramePreference
        fields = ['frame_interval', 'frame_delay']

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at', 'user']
        read_only_fields = ['uploaded_at']


class UploadedVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedVideo
        fields = ['id', 'video', 'uploaded_at', 'user', 'user_video_frame_preference']
