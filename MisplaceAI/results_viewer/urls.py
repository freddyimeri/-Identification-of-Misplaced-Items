# MisplaceAI/results_viewer/urls.py

from django.urls import path
from .views import generate_annotated_image

app_name = 'results_viewer'

urlpatterns = [
    path('generate/<int:image_id>/', generate_annotated_image, name='generate_annotated_image'),
]
