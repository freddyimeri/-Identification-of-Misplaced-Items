from django.shortcuts import render, get_object_or_404
from .models import DetectedObject
from process_misplaced_manager.models import UploadedImage
from .utils import run_inference, load_model, create_category_index_from_labelmap, run_inference_and_visualize
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects  # Import the visualization function
import os

MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

def detect_items(request, image_id):
    image = get_object_or_404(UploadedImage, id=image_id)
    image_path = image.image.path
    output_image_name = "detected_" + os.path.basename(image_path)
    output_image_path = os.path.join("media", output_image_name)
    detected_objects = run_inference_and_visualize(detection_model, category_index, image_path, output_image_path)

    for obj in detected_objects:
        DetectedObject.objects.create(
            class_name=obj['class_name'],
            ymin=obj['ymin'],
            xmin=obj['xmin'],
            ymax=obj['ymax'],
            xmax=obj['xmax'],
            image=image
        )

    placement_rules = PlacementRules()
    misplaced_objects = placement_rules.check_placement(detected_objects)

    annotated_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

    return render(request, 'item_detector/results.html', {
        'detected_objects': detected_objects,
        'image': image,
        'output_image_url': "/media/" + output_image_name,
        'annotated_image_url': "/media/" + os.path.basename(annotated_image_path),
        'misplaced_objects': misplaced_objects
    })
