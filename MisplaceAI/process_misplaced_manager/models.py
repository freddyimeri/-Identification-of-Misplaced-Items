# MisplaceAI/process_misplaced_manager/models.py

# This file defines the models for the process_misplaced_manager app.
# Models are used to define the structure of the database tables and the relationships between them.
# Each model maps to a single table in the database.

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UploadedImage(models.Model):
    """
    Model to represent an uploaded image.
    """
    # Field to store the image file, which will be uploaded to the 'images/' directory
    image = models.ImageField(upload_to='images/')
    # Field to store the timestamp when the image was uploaded, set automatically when the image is created
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # ForeignKey field to create a relationship with the User model, indicating the user who uploaded the image
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class UserVideoFramePreference(models.Model):
    """
    Model to represent user preferences for video frame processing.
    """
    # One-to-one relationship with the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Integer field to store the frame interval preference
    frame_interval = models.IntegerField(default=1)
    # Integer field to store the frame delay preference
    frame_delay = models.IntegerField(default=1)

    def __str__(self):
        """
        String representation of the UserVideoFramePreference model.
        """
        return f'{self.user.username} - Frame Interval: {self.frame_interval}, Frame Delay: {self.frame_delay}'

class UploadedVideo(models.Model):
    """
    Model to represent an uploaded video.
    """
    # Field to store the video file, which will be uploaded to the 'videos/' directory
    video = models.FileField(upload_to='videos/')
    # Field to store the timestamp when the video was uploaded, set automatically when the video is created
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # ForeignKey field to create a relationship with the User model, indicating the user who uploaded the video
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # ForeignKey field to create a relationship with the UserVideoFramePreference model
    user_video_frame_preference = models.ForeignKey(UserVideoFramePreference, on_delete=models.SET_NULL, null=True)

class DailyDetectionLimit(models.Model):
    """
    Model to represent daily detection limits for a user.
    """
    # One-to-one relationship with the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Integer field to store the count of image detections for the current day
    image_detection_count = models.IntegerField(default=0)
    # Integer field to store the count of video detections for the current day
    video_detection_count = models.IntegerField(default=0)
    # Date field to store the date when the detection counts were last reset
    last_reset = models.DateField(auto_now_add=True)

    def reset_limits(self):
        """
        Reset the detection limits if the day has changed.
        """
        # Check if the last reset date is earlier than today
        if self.last_reset < timezone.now().date():
            # Reset the detection counts to zero
            self.image_detection_count = 0
            self.video_detection_count = 0
            # Update the last reset date to today
            self.last_reset = timezone.now().date()
            self.save()

    def __str__(self):
        """
        String representation of the DailyDetectionLimit model.
        """
        return f'{self.user.username} - Images: {self.image_detection_count}, Videos: {self.video_detection_count}'

class DetectionLimitSetting(models.Model):
    """
    Model to represent global detection limit settings.
    """
    # Integer field to store the daily limit for image detections
    daily_image_limit = models.IntegerField(default=10)
    # Integer field to store the daily limit for video detections
    daily_video_limit = models.IntegerField(default=5)

    def __str__(self):
        """
        String representation of the DetectionLimitSetting model.
        """
        return f'Daily Limits - Images: {self.daily_image_limit}, Videos: {self.daily_video_limit}'
