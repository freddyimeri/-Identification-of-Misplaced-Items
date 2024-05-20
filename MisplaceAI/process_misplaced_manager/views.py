from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageUploadForm, VideoUploadForm
from .models import UploadedImage, UploadedVideo
from item_detector.utils import run_inference, load_model, create_category_index_from_labelmap
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects
import base64

import os
from django.core.files.base import ContentFile

# Load the model and category index for object detection
MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

def detection_options(request):
    return render(request, 'process_misplaced_manager/detection_options.html')


def normal_detection(request):
    if request.method == 'POST':
        if 'capturedImageData' in request.POST:
            captured_image_data = request.POST['capturedImageData']
            format, imgstr = captured_image_data.split(';base64,') 
            ext = format.split('/')[-1] 
            image_data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

            # Save the image to the UploadedImage model
            new_image = UploadedImage.objects.create(image=image_data)
            return redirect('process_misplaced_manager:display_results', image_id=new_image.id)
        else:
            form = ImageUploadForm(request.POST, request.FILES)
            if form.is_valid():
                new_image = form.save()
                return redirect('process_misplaced_manager:display_results', image_id=new_image.id)
    else:
        form = ImageUploadForm()
    return render(request, 'process_misplaced_manager/normal_detection.html', {'form': form})








def segmentation_detection(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            new_image = form.save()
            return redirect('process_misplaced_manager:display_results', image_id=new_image.id)
    else:
        form = ImageUploadForm()
    return render(request, 'process_misplaced_manager/segmentation_detection.html', {'form': form})

def upload_video(request):
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            new_video = form.save()
            return redirect('process_misplaced_manager:display_video_results', video_id=new_video.id)
    else:
        form = VideoUploadForm()
    return render(request, 'process_misplaced_manager/upload_video.html', {'form': form})

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

def display_video_results(request, video_id):
    # Placeholder for video processing results view
    video = get_object_or_404(UploadedVideo, id=video_id)
    video_path = video.video.path

    # Here you would run video analysis, currently, it's a placeholder
    detected_objects = []  # Replace with actual video detection logic
    misplaced_objects = []  # Replace with actual video detection logic

    return render(request, 'process_misplaced_manager/display_video_results.html', {
        'video': video,
        'detected_objects': detected_objects,
        'misplaced_objects': misplaced_objects
    })
