# MisplaceAI/process_misplaced_manager/models.py

from django.db import models
from django.contrib.auth.models import User

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class UserVideoFramePreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    frame_interval = models.IntegerField(default=1)  # interval in seconds

class UploadedVideo(models.Model):
    video = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_video_frame_preference = models.ForeignKey(UserVideoFramePreference, on_delete=models.CASCADE, null=True, blank=True)