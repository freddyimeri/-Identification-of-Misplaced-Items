from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageUploadForm
from .models import UploadedImage
from item_detector.utils import run_inference, load_model, create_category_index_from_labelmap
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects

import os

# Load the model and category index for object detection
MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

def upload_image(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            new_image = form.save()
            return redirect('process_misplaced_manager:display_results', image_id=new_image.id)
    else:
        form = ImageUploadForm()
    return render(request, 'process_misplaced_manager/upload_image.html', {'form': form})

def display_results(request, image_id):
    image = get_object_or_404(UploadedImage, id=image_id)
    image_path = image.image.path

    # Run object detection
    detected_objects = run_inference(detection_model, category_index, image_path)
    print(f"Detected objects: {detected_objects}")  # Debugging

    # Check placement rules
    placement_rules = PlacementRules()
    misplaced_objects = placement_rules.check_placement(detected_objects)
    print(f"Misplaced objects: {misplaced_objects}")  # Debugging

    # Visualize results
    output_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

    return render(request, 'process_misplaced_manager/display_results.html', {
        'image': image,
        'output_image_url': "/media/" + os.path.basename(output_image_path),
        'misplaced_objects': misplaced_objects
    })
