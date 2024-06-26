# MisplaceAI/process_misplaced_manager/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UploadedImage, UploadedVideo, UserVideoFramePreference
from .serializers import UploadedImageSerializer, UploadedVideoSerializer
from item_detector.utils import run_inference, load_model, create_category_index_from_labelmap
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects, visualize_video_misplaced_objects, visualize_pil_misplaced_objects
from django.core.files.base import ContentFile
import base64
import os
from PIL import Image, ExifTags
import logging
import cv2
from django.conf import settings
from django.http import JsonResponse
import numpy as np  
from moviepy.editor import VideoFileClip, ImageSequenceClip

logger = logging.getLogger(__name__)

MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

class UploadedImageViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
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

 

#################################################################################################
################################## Video Upload and Processing #################################








class UploadedVideoViewSet(viewsets.ModelViewSet):
    queryset = UploadedVideo.objects.all()
    serializer_class = UploadedVideoSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):
    print("Received request to upload video")
    print("Request data:", request.data)
    print("Request FILES:", request.FILES)

    if 'video' not in request.FILES:
        print("No video file provided in request")
        return Response({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)

    frame_interval = int(request.data.get('frame_interval', 1))
    user_video_frame_preference, created = UserVideoFramePreference.objects.get_or_create(user=request.user)
    user_video_frame_preference.frame_interval = frame_interval
    user_video_frame_preference.save()

    serializer = UploadedVideoSerializer(data={'video': request.FILES['video'], 'user': request.user.id, 'user_video_frame_preference': user_video_frame_preference.id})
    if serializer.is_valid():
        print("Serializer data is valid")
        serializer.save()
        print("Video successfully saved:", serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_video_results(request, video_id):
    print("Received request to display video results for video ID", video_id)
    try:
        video = get_object_or_404(UploadedVideo, id=video_id)
        video_path = video.video.path

        print("Processing video at path:", video_path)
        frame_interval = video.user_video_frame_preference.frame_interval if video.user_video_frame_preference else 1
        detected_objects, misplaced_objects, output_video_path = process_video_for_misplaced_objects(video_path, frame_interval)
        print

        response_data = {
            'video_url': request.build_absolute_uri(video.video.url),
            'output_video_url': request.build_absolute_uri(settings.MEDIA_URL + 'videos/' + os.path.basename(output_video_path)),
            'detected_objects': detected_objects,
            'misplaced_objects': misplaced_objects  # Ensure misplaced_objects include 'allowed_locations'
        }
  
        print("\nDEBUG FOR misplaced_objects: ", misplaced_objects)

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error processing video results: {e}")
        return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



def process_video_for_misplaced_objects(video_path, frame_interval):
    print("Starting object detection for video:", video_path)
    cap = cv2.VideoCapture(video_path)
    print("Video capture object created")
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    print("Frame width:", frame_width)
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print("Frame height:", frame_height)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    print("FPS:", fps)

    misplaced_objects_all_frames = []
    print("Misplaced objects list created")
    detected_objects_all_frames = []
    print("Detected objects list created")

    frame_count = 0
    frame_interval_frames = frame_interval * fps
    annotated_frames = []

    while cap.isOpened():
        print(f"Processing frame {frame_count}")
        ret, frame = cap.read()
        print("Frame read")
        if not ret:
            break

        if frame_count % frame_interval_frames == 0:
            print("Frame read successfully")
            image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            print("Frame converted to RGB")
            
            # Convert the frame to PIL image
            image_pil = Image.fromarray(image_np)

            detected_objects = run_inference(detection_model, category_index, image_pil)
            print(f"Detected objects in frame {frame_count}: {detected_objects}")

            placement_rules = PlacementRules()
            misplaced_objects = placement_rules.check_placement(detected_objects)
            print(f"Misplaced objects in frame {frame_count}: {misplaced_objects}")

            detected_objects_all_frames.append(detected_objects)
            misplaced_objects_all_frames.append(misplaced_objects)

            # Annotate the frame with bounding boxes and labels
            annotated_image_pil = visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects)
            annotated_image_np = np.array(annotated_image_pil)
            annotated_frames.append(annotated_image_np)

        frame_count += 1

    cap.release()

    # Create a video with a 1-second delay between each frame
    output_video_path = os.path.join(settings.MEDIA_ROOT, 'videos', os.path.basename(video_path).replace('.mp4', '_annotated.mp4'))
    annotated_clip = ImageSequenceClip([np.array(frame) for frame in annotated_frames], fps=1)
    annotated_clip.write_videofile(output_video_path, codec='libx264', audio_codec='aac')

    print("Finished processing video:", output_video_path)
    return detected_objects_all_frames, misplaced_objects_all_frames, output_video_path































# class UploadedVideoViewSet(viewsets.ModelViewSet):
#     queryset = UploadedVideo.objects.all()
#     serializer_class = UploadedVideoSerializer
#     permission_classes = [IsAuthenticated]

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def upload_video(request):
#     print("Received request to upload video")
#     print("Request data:", request.data)
#     print("Request FILES:", request.FILES)

#     if 'video' not in request.FILES:
#         print("No video file provided in request")
#         return Response({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)

#     serializer = UploadedVideoSerializer(data={'video': request.FILES['video']})
#     if serializer.is_valid():
#         print("Serializer data is valid")
#         serializer.save()
#         print("Video successfully saved:", serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     else:
#         print("Serializer errors:", serializer.errors)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def display_video_results(request, video_id):
#     print("Received request to display video results for video ID", video_id)
#     try:
#         video = get_object_or_404(UploadedVideo, id=video_id)
#         video_path = video.video.path

#         print("Processing video at path:", video_path)
#         detected_objects, misplaced_objects, output_video_path = process_video_for_misplaced_objects(video_path)

#         response_data = {
#             'video_url': request.build_absolute_uri(video.video.url),
#             'output_video_url': request.build_absolute_uri(settings.MEDIA_URL + 'videos/' + os.path.basename(output_video_path)),
#             'detected_objects': detected_objects,
#             'misplaced_objects': misplaced_objects
#         }
#         print("Successfully processed video and generated results")
#         return Response(response_data, status=status.HTTP_200_OK)
#     except Exception as e:
#         print(f"Error processing video results: {e}")
#         return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




















# def process_video_for_misplaced_objects(video_path):
#     print("Starting object detection for video:", video_path)
#     cap = cv2.VideoCapture(video_path)
#     print("Video capture object created")
#     frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     print("Frame width:", frame_width)
#     frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#     print("Frame height:", frame_height)
#     fps = int(cap.get(cv2.CAP_PROP_FPS))
#     print("FPS:", fps)

#     output_video_path = os.path.join(settings.MEDIA_ROOT, 'videos', os.path.basename(video_path).replace('.mp4', '_annotated.mp4'))
#     print("Output video path:", output_video_path)
#     out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))
#     print("Video writer object created")
#     misplaced_objects_all_frames = []
#     print("Misplaced objects list created")
#     detected_objects_all_frames = []
#     print("Detected objects list created")

#     frame_count = 0

#     while cap.isOpened():
#         print(f"Processing frame {frame_count}")
#         ret, frame = cap.read()
#         print("Frame read")
#         if not ret:
#             break
#         print("Frame read successfully")
#         image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         print("Frame converted to RGB")

#         # Convert the frame to PIL image
#         image_pil = Image.fromarray(image_np)

#         detected_objects = run_inference(detection_model, category_index, image_pil)
#         print(f"Detected objects in frame {frame_count}: {detected_objects}")

#         placement_rules = PlacementRules()
#         misplaced_objects = placement_rules.check_placement(detected_objects)
#         print(f"Misplaced objects in frame {frame_count}: {misplaced_objects}")

#         detected_objects_all_frames.append(detected_objects)
#         misplaced_objects_all_frames.append(misplaced_objects)

#         # Annotate the frame with bounding boxes and labels
#         annotated_image_pil = visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects)
#         annotated_image_np = np.array(annotated_image_pil)
#         out.write(cv2.cvtColor(annotated_image_np, cv2.COLOR_RGB2BGR))

#         frame_count += 1

#     cap.release()
#     out.release()

#     print("Finished processing video:", output_video_path)
#     return detected_objects_all_frames, misplaced_objects_all_frames, output_video_path