# MisplaceAI/process_misplaced_manager/views.py

# This file contains the views for handling image and video uploads, running object detection,
# applying placement rules to detect misplaced objects, and providing results to the users.
# The views utilize Django Rest Framework to create API endpoints that are secured with 
# authentication and permission classes. The file also includes utility functions for image 
# and video processing, and daily detection limit checks per user.

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UploadedImage, UploadedVideo, UserVideoFramePreference, DetectionLimitSetting, DailyDetectionLimit
from .serializers import UploadedImageSerializer, UploadedVideoSerializer
from item_detector.utils import run_inference, load_model, create_category_index_from_labelmap
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_misplaced_objects, visualize_pil_misplaced_objects
from django.core.files.base import ContentFile
import base64
import os
import logging
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404
from .utils import increment_detection_count, correct_image_orientation, process_video_for_misplaced_objects

# Set up logging
logger = logging.getLogger(__name__)

# Paths to the model and label map used for object detection
MODEL_PATH = "models/research/object_detection/faster_rcnn_resnet50_v1_1024x1024_coco17_tpu-8/saved_model"
LABEL_MAP_PATH = "models/research/object_detection/data/mscoco_label_map.pbtxt"

# Load the detection model and create the category index from the label map
detection_model = load_model(MODEL_PATH)
category_index = create_category_index_from_labelmap(LABEL_MAP_PATH)

# ViewSet for managing uploaded images
class UploadedImageViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()  # Queryset of all uploaded images
    serializer_class = UploadedImageSerializer  # Serializer class for uploaded images
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

# API view for normal detection on uploaded imagesm to detect misplaced items
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def normal_detection(request):
    """Handle image upload, run object detection, and check for misplaced objects."""
    try:
        if 'capturedImageData' in request.data:
            # Process base64 encoded image data
            captured_image_data = request.data['capturedImageData']
            format, imgstr = captured_image_data.split(';base64,')
            ext = format.split('/')[-1]
            image_data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            new_image = UploadedImage.objects.create(image=image_data, user=request.user)
        else:
            # Process uploaded image file
            data = request.data.copy()
            data['user'] = request.user.id
            serializer = UploadedImageSerializer(data=data)
            if serializer.is_valid():
                new_image = serializer.save()
            else:
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Path to the newly uploaded image
        image_path = new_image.image.path
        
        # Correct the orientation of the image
        correct_image_orientation(image_path)
        
        # Run object detection on the image
        detected_objects = run_inference(detection_model, category_index, image_path)
        
        # Check for misplaced objects using placement rules
        placement_rules = PlacementRules()
        misplaced_objects = placement_rules.check_placement(detected_objects)
        
        # Visualize the detected and misplaced objects on the image
        output_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

        # Delete the original uploaded image to save space
        if os.path.exists(image_path):
            os.remove(image_path)

        # Prepare response data
        response_data = {
            'image_id': new_image.id,
            'image_url': new_image.image.url,
            'output_image_url': request.build_absolute_uri("/media/" + os.path.basename(output_image_path)),
            'misplaced_objects': misplaced_objects
        }
        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API view for displaying detection results for a specific image
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_results(request, image_id):
    """Display the detection results for a specific uploaded image."""
    image = get_object_or_404(UploadedImage, id=image_id)
    image_path = image.image.path

    # Correct the orientation of the image
    correct_image_orientation(image_path)

    # Run object detection on the image
    detected_objects = run_inference(detection_model, category_index, image_path)
    
    # Check for misplaced objects using placement rules
    placement_rules = PlacementRules()
    misplaced_objects = placement_rules.check_placement(detected_objects)
    
    # Visualize the detected and misplaced objects on the image
    output_image_path = visualize_misplaced_objects(image_path, detected_objects, misplaced_objects)

    # Prepare response data
    response_data = {
        'image_url': image.image.url,
        'output_image_url': "/media/" + os.path.basename(output_image_path),
        'misplaced_objects': misplaced_objects
    }
    return Response(response_data, status=status.HTTP_200_OK)

#################################################################################################
################################## Video Upload and Processing #################################

# ViewSet for managing uploaded videos
class UploadedVideoViewSet(viewsets.ModelViewSet):
    queryset = UploadedVideo.objects.all()  # Queryset of all uploaded videos
    serializer_class = UploadedVideoSerializer  # Serializer class for uploaded videos
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

# API view for uploading a video and setting frame preferences
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_video(request):
    """Handle video upload and set user preferences for frame processing."""
    if 'video' not in request.FILES:
        print("No video file provided in request")
        return Response({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Get frame processing preferences from the request
    frame_interval = int(request.data.get('frames_jump', 1))
    frame_delay = int(request.data.get('frame_delay', 1))

    # Retrieve or create user video frame preferences
    user_video_frame_preference, created = UserVideoFramePreference.objects.get_or_create(user=request.user)
    user_video_frame_preference.frame_interval = frame_interval
    user_video_frame_preference.frame_delay = frame_delay
    user_video_frame_preference.save()

    # Serialize the video data and save the uploaded video
    serializer = UploadedVideoSerializer(data={'video': request.FILES['video'], 'user': request.user.id, 'user_video_frame_preference': user_video_frame_preference.id})
    if serializer.is_valid():
        print("Serializer data is valid")
        serializer.save()
        print("Video successfully saved:", serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view for displaying detection results for a specific video
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_video_results(request, video_id):
    """Display the detection results for a specific uploaded video."""
    print("Received request to display video results for video ID", video_id)
    try:
        # Retrieve the uploaded video object
        video = get_object_or_404(UploadedVideo, id=video_id)
        video_path = video.video.path

        # Retrieve user preferences for frame processing
        user_video_frame_preference = get_object_or_404(UserVideoFramePreference, user=video.user)
        frame_interval = user_video_frame_preference.frame_interval
        frame_delay = user_video_frame_preference.frame_delay

        print("Processing video at path:", video_path)
        print(f"Frame interval: {frame_interval}, Frame delay: {frame_delay}")
        
        # Process the video to detect and visualize misplaced objects
        detected_objects, misplaced_objects, output_video_path = process_video_for_misplaced_objects(
            video_path, frame_interval, frame_delay, detection_model, category_index
        )

        # Delete the original uploaded video to save space
        if os.path.exists(video_path):
            os.remove(video_path)

        # Prepare response data
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

# API view for deleting an image
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_image(request, image_name):
    """Delete a specific image by its name."""
    try:
        print(f"Attempting to delete image: {image_name}")
        # Construct the file path
        file_path = os.path.join(settings.MEDIA_ROOT, image_name)
        
        # Check if the file exists
        if os.path.exists(file_path):
            # Delete the file
            os.remove(file_path)
            print(f"Image {image_name} deleted successfully.")
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            print(f"Image {image_name} not found.")
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting image {image_name}: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API view for deleting a video
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_video(request, video_name):
    """Delete a specific video by its name."""
    try:
        print(f"Attempting to delete video: {video_name}")
        video_path = os.path.join(settings.MEDIA_ROOT, 'videos', video_name)
        if os.path.exists(video_path):
            os.remove(video_path)
            print(f"Video {video_name} deleted successfully.")
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            print(f"Video {video_name} not found.")
            return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error deleting video {video_name}: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#################################################################################################
####################################### Download Results ########################################

# API view for downloading an image file
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_image(request, file_path):
    """Download a specific image file."""
    file_path = os.path.join(settings.MEDIA_ROOT, file_path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/force-download")
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
            return response
    else:
        raise Http404

# API view for downloading a media file (image or video)
@api_view(['GET'])
def download_media(request, file_path):
    """Download a specific media file, either an image or a video."""
    # Determine if the file is in the 'videos' directory
    video_path = os.path.join(settings.MEDIA_ROOT, 'videos', file_path)
    if os.path.exists(video_path):
        file_path = video_path
    else:
        # Otherwise, treat it as if it's in the root of MEDIA_ROOT (for images)
        file_path = os.path.join(settings.MEDIA_ROOT, file_path)
    
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/force-download")
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
            return response
    else:
        raise Http404

#################################################################################################
####################################### LIMITS PER USER #########################################

# API view for getting the daily detection limits for the user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_daily_limits(request):
    """Get the daily detection limits for the user."""
    limit_setting = DetectionLimitSetting.objects.first()
    if not limit_setting:
        limit_setting = DetectionLimitSetting.objects.create(daily_image_limit=10, daily_video_limit=5)
    return Response({
        'daily_image_limit': limit_setting.daily_image_limit,
        'daily_video_limit': limit_setting.daily_video_limit
    })

# API view for setting the daily detection limits (admin only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def set_daily_limits(request):
    """Set the daily detection limits for all users (admin only)."""
    daily_image_limit = request.data.get('daily_image_limit', 10)
    daily_video_limit = request.data.get('daily_video_limit', 5)
    limit_setting, created = DetectionLimitSetting.objects.get_or_create(id=1)
    limit_setting.daily_image_limit = daily_image_limit
    limit_setting.daily_video_limit = daily_video_limit
    limit_setting.save()
    return Response({
        'daily_image_limit': limit_setting.daily_image_limit,
        'daily_video_limit': limit_setting.daily_video_limit
    })

# API view for checking the remaining daily limit for the user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_daily_limit(request):
    """Check the remaining daily detection limit for the user."""
    user = request.user
    detection_type = request.GET.get('type')
    
    if detection_type not in ['image', 'video']:
        return Response({'error': 'Invalid detection type'}, status=400)

    limit_setting = DetectionLimitSetting.objects.first()
    detection_limit, created = DailyDetectionLimit.objects.get_or_create(user=user)
    detection_limit.reset_limits()  # Ensure limits are reset if the day has changed

    if detection_type == 'image':
        remaining = limit_setting.daily_image_limit - detection_limit.image_detection_count
    else:
        remaining = limit_setting.daily_video_limit - detection_limit.video_detection_count

    return Response({
        'remaining': remaining,
        'limit': limit_setting.daily_image_limit if detection_type == 'image' else limit_setting.daily_video_limit
    })

# API view for incrementing the detection count for the user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increment_detection(request):
    """Increment the detection count for the user."""
    user = request.user
    detection_type = request.data.get('type')

    if detection_type not in ['image', 'video']:
        return Response({'error': 'Invalid detection type'}, status=400)
    
    increment_detection_count(user, detection_type)
    return Response({'status': 'success'})
