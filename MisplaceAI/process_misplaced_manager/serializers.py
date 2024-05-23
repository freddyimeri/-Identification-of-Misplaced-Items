# process_misplaced_manager/serializers.py
from rest_framework import serializers
from .models import UploadedImage, UploadedVideo

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at']

class UploadedVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedVideo
        fields = ['id', 'video', 'uploaded_at']
