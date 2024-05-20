from django.urls import path
from .views import upload_image, display_results

app_name = 'process_misplaced_manager'

urlpatterns = [
    path('upload/', upload_image, name='upload_image'),
    path('results/<int:image_id>/', display_results, name='display_results'),
]
