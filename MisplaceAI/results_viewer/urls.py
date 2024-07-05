# MisplaceAI/results_viewer/urls.py

# This file defines the URL patterns for the results_viewer app.
# It includes routes for generating annotated images with misplaced object annotations.

from django.urls import path
from .views import generate_annotated_image

# Define the app name for namespacing URL names
app_name = 'results_viewer'

# Define the URL patterns for the results_viewer app
urlpatterns = [
    # Route for generating annotated images
    path('generate/<int:image_id>/', generate_annotated_image, name='generate_annotated_image'),
]
