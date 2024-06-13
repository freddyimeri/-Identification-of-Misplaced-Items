# MisplaceAi/results_viewer/views.py

from django.http import JsonResponse
from .utils import visualize_misplaced_objects
import os

def generate_annotated_image(request):
    if request.method == 'POST':
        image_path = request.POST.get('image_path')
        misplaced_objects = request.POST.get('misplaced_objects')

        if not image_path or not misplaced_objects:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        output_image_path = os.path.join("media", "annotated_" + os.path.basename(image_path))
        visualize_misplaced_objects(image_path, misplaced_objects, output_image_path)
        
        return JsonResponse({'annotated_image_path': output_image_path})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
