# MisplaceAI/process_misplaced_manager/urls.py

# This file defines the URL patterns for the process_misplaced_manager app.
# It includes routes for uploading images and videos, running object detection,
# displaying results, downloading and deleting media files, and managing user detection limits.

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UploadedImageViewSet, UploadedVideoViewSet,
    normal_detection, 
    display_results, 
    display_video_results, 
    upload_video,
    download_image, 
    delete_image,
    delete_video,
    download_media, 
    get_daily_limits, 
    set_daily_limits,
    check_daily_limit,
    increment_detection
)

# Initialize the default router
router = DefaultRouter()
# Register viewsets for uploaded images and videos
router.register(r'images', UploadedImageViewSet)
router.register(r'videos', UploadedVideoViewSet)

# Define the app name for namespacing URL names
app_name = 'process_misplaced_manager'

# Define the URL patterns
urlpatterns = [
    # Include the router's URLs
    path('', include(router.urls)),

    # Route for normal image detection
    path('normal-detection/', normal_detection, name='normal_detection'),

    # Route for uploading videos
    path('upload-video/', upload_video, name='upload_video'),

    # Route for displaying results of a specific video
    path('video-results/<int:video_id>/', display_video_results, name='display_video_results'),

    # Route for displaying results of a specific image
    path('display-results/<int:image_id>/', display_results, name='display_results'),

    # Route for downloading an image
    path('download/<path:file_path>/', download_image, name='download_image'),

    # Route for deleting a specific image by name
    path('delete-image/<str:image_name>/', delete_image, name='delete_image_by_name'),

    # Route for deleting a specific video by name
    path('delete-video/<str:video_name>/', delete_video, name='delete_video'),

    # Route for downloading a media file (image or video)
    path('download_video/<str:file_path>/', download_media, name='download_media'),

    # Route for getting daily detection limits
    path('daily-limits/', get_daily_limits, name='get_daily_limits'),  
    
    # Route for setting daily detection limits (admin only)
    path('set-daily-limits/', set_daily_limits, name='set_daily_limits'),

    # Route for checking the remaining daily limit for the user
    path('check-daily-limit/', check_daily_limit, name='check_daily_limit'),

    # Route for incrementing the detection count for the user
    path('increment-detection/', increment_detection, name='increment_detection'),
]
