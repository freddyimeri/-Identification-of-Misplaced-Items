# MisplaceAI/process_misplaced_manager/forms.py

# This file defines the forms for the process_misplaced_manager app.
# Forms are used to handle user input and validate the data before it is saved to the database.
# In this file, we define forms for uploading images and videos.

from django import forms
from .models import UploadedImage, UploadedVideo

# Form for uploading images
class ImageUploadForm(forms.ModelForm):
    """
    A form for uploading images.
    """
    class Meta:
        # Specify the model associated with the form
        model = UploadedImage
        # Specify the fields to be included in the form
        fields = ['image']

# Form for uploading videos
class VideoUploadForm(forms.ModelForm):
    """
    A form for uploading videos.
    """
    class Meta:
        # Specify the model associated with the form
        model = UploadedVideo
        # Specify the fields to be included in the form
        fields = ['video']
