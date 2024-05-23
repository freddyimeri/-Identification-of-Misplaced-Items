from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UploadedImage, UploadedVideo
from .serializers import UploadedImageSerializer, UploadedVideoSerializer
from item_detector.utils import run_inference, load_model, create_category_index_from_labelmap
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects, visualize_video_misplaced_objects
from django.core.files.base import ContentFile
import base64
import os
from PIL import Image, ExifTags

MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

class UploadedImageViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    permission_classes = [IsAuthenticated]

class UploadedVideoViewSet(viewsets.ModelViewSet):
    queryset = UploadedVideo.objects.all()
    serializer_class = UploadedVideoSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def normal_detection(request):
    if 'capturedImageData' in request.data:
        captured_image_data = request.data['capturedImageData']
        format, imgstr = captured_image_data.split(';base64,')
        ext = format.split('/')[-1]
        image_data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

        new_image = UploadedImage.objects.create(image=image_data)
    else:
        serializer = UploadedImageSerializer(data=request.data)
        if serializer.is_valid():
            new_image = serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    image_path = new_image.image.path
    correct_image_orientation(image_path)
    detected_objects = run_inference(detection_model, category_index, image_path)
    placement_rules = PlacementRules()
    misplaced_objects = placement_rules.check_placement(detected_objects)
    output_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

    response_data = {
        'image_url': new_image.image.url,
        'output_image_url': request.build_absolute_uri("/media/" + os.path.basename(output_image_path)),
        'misplaced_objects': misplaced_objects
    }
    return Response(response_data, status=status.HTTP_200_OK)

def correct_image_orientation(image_path):
    try:
        image = Image.open(image_path)
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = image._getexif()
        if exif is not None:
            orientation = exif.get(orientation)
            if orientation == 3:
                image = image.rotate(180, expand=True)
            elif orientation == 6:
                image = image.rotate(270, expand=True)
            elif orientation == 8:
                image = image.rotate(90, expand=True)
        image.save(image_path)
    except (AttributeError, KeyError, IndexError):
        pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_results(request, image_id):
    image = get_object_or_404(UploadedImage, id=image_id)
    image_path = image.image.path

    correct_image_orientation(image_path)

    detected_objects = run_inference(detection_model, category_index, image_path)
    placement_rules = PlacementRules()
    misplaced_objects = placement_rules.check_placement(detected_objects)
    output_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

    response_data = {
        'image_url': image.image.url,
        'output_image_url': "/media/" + os.path.basename(output_image_path),
        'misplaced_objects': misplaced_objects
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_video_results(request, video_id):
    video = get_object_or_404(UploadedVideo, id=video_id)
    video_path = video.video.path

    detected_objects, misplaced_objects = visualize_video_misplaced_objects(video_path, detection_model, category_index)

    response_data = {
        'video_url': video.video.url,
        'detected_objects': detected_objects,
        'misplaced_objects': misplaced_objects
    }
    return Response(response_data, status=status.HTTP_200_OK)
