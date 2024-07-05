# MisplaceAI/results_viewer/views.py

# This file defines the views for the results_viewer app.
# Views handle the logic for different endpoints, providing appropriate responses
# based on the request and the business logic.

from django.http import JsonResponse
from .utils import visualize_misplaced_objects
import os

def generate_annotated_image(request):
    """
    View to generate an annotated image with misplaced object annotations.

    Args:
        request (HttpRequest): The HTTP request object containing image path and misplaced objects.

    Returns:
        JsonResponse: JSON response with the path to the annotated image or an error message.
    """
    if request.method == 'POST':
        # Get the image path and misplaced objects data from the request
        image_path = request.POST.get('image_path')
        misplaced_objects = request.POST.get('misplaced_objects')

        # Check if image path and misplaced objects are provided
        if not image_path or not misplaced_objects:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        # Define the output path for the annotated image
        output_image_path = os.path.join("media", "annotated_" + os.path.basename(image_path))
        # Generate the annotated image
        visualize_misplaced_objects(image_path, misplaced_objects, output_image_path)
        
        # Return the path to the annotated image
        return JsonResponse({'annotated_image_path': output_image_path})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
