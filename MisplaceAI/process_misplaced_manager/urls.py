from django.urls import path
from . import views

app_name = 'process_misplaced_manager'

urlpatterns = [
    path('detection-options/', views.detection_options, name='detection_options'),
    path('normal-detection/', views.normal_detection, name='normal_detection'),
    path('segmentation-detection/', views.segmentation_detection, name='segmentation_detection'),
    path('upload-video/', views.upload_video, name='upload_video'),
    path('results/<int:image_id>/', views.display_results, name='display_results'),
    path('video-results/<int:video_id>/', views.display_video_results, name='display_video_results'),
]
