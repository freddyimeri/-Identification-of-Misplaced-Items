# MisplaceAI/process_misplaced_manager/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class UserVideoFramePreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    frame_interval = models.IntegerField(default=1)  # interval in seconds

class UploadedVideo(models.Model):
    video = models.FileField(upload_to='videos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_video_frame_preference = models.ForeignKey(UserVideoFramePreference, on_delete=models.CASCADE, null=True, blank=True)

class DailyDetectionLimit(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image_detection_count = models.IntegerField(default=0)
    video_detection_count = models.IntegerField(default=0)
    last_reset = models.DateField(auto_now_add=True)

    def reset_limits(self):
        if self.last_reset < timezone.now().date():
            self.image_detection_count = 0
            self.video_detection_count = 0
            self.last_reset = timezone.now().date()
            self.save()

    def __str__(self):
        return f'{self.user.username} - Images: {self.image_detection_count}, Videos: {self.video_detection_count}'

class DetectionLimitSetting(models.Model):
    daily_image_limit = models.IntegerField(default=10)  # Default limit for images
    daily_video_limit = models.IntegerField(default=5)   # Default limit for videos

    def __str__(self):
        return f'Daily Limits - Images: {self.daily_image_limit}, Videos: {self.daily_video_limit}'
