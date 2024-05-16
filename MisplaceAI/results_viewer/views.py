from django.shortcuts import render, get_object_or_404
from process_misplaced_manager.models import UploadedImage
from item_detector.models import DetectedObject
from .utils import visualize_misplaced_objects
import os

def visualize_results(request, image_id):
    image = get_object_or_404(UploadedImage, id=image_id)
    image_path = image.image.path

    detected_objects = DetectedObject.objects.filter(image=image)

    data_location = [
        {
            "class_name": obj.class_name,
            "ymin": obj.ymin,
            "xmin": obj.xmin,
            "ymax": obj.ymax,
            "xmax": obj.xmax,
        }
        for obj in detected_objects
    ]

    # Here you would get the misplaced objects
    # For now, assuming misplaced_objects is available
    misplaced_objects = []  # Replace with actual misplaced objects

    visualize_misplaced_objects(image_path, data_location, misplaced_objects)

    return render(request, 'results_viewer/visualize_results.html', {
        'image': image,
        'output_image_url': "/media/" + os.path.basename(image_path),
        'detected_objects': detected_objects,
        'misplaced_objects': misplaced_objects,
    })
