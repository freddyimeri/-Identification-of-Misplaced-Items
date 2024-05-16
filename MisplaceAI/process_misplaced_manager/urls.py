# process_misplaced_manager/urls.py

from django.urls import path
from .views import upload_image, display_image

app_name = 'process_misplaced_manager' 

urlpatterns = [
    path('upload-image/', upload_image, name='upload_image'),
    path('display-image/<int:image_id>/', display_image, name='display_image'),
]
