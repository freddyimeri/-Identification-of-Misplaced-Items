# MisplaceAI/process_misplaced_manager/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UploadedImageViewSet, UploadedVideoViewSet,
    normal_detection, 
    display_results, display_video_results,upload_video, download_image
)

router = DefaultRouter()
router.register(r'images', UploadedImageViewSet)
router.register(r'videos', UploadedVideoViewSet)

app_name = 'process_misplaced_manager'

urlpatterns = [
    path('', include(router.urls)),
    path('normal-detection/', normal_detection, name='normal_detection'),
    # path('segmentation-detection/', segmentation_detection, name='segmentation_detection'),
    path('upload-video/', upload_video, name='upload_video'),
    path('video-results/<int:video_id>/', display_video_results, name='display_video_results'),
    path('display-results/<int:image_id>/', display_results, name='display_results'),
    path('download/<path:file_path>/', download_image, name='download_image'),


]
