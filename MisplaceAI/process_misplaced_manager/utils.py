# MisplaceAI/process_misplaced_manager/utils.py

# This file contains utility functions used for various purposes in the MisplaceAI project.
# These include functions to increment the detection count for a user, correct image orientation,
# and process videos to detect and visualize misplaced objects.

from django.utils import timezone
from .models import DailyDetectionLimit
from PIL import Image, ExifTags
import cv2
from moviepy.editor import ImageSequenceClip
from item_detector.utils import run_inference
from placement_rules.utils import PlacementRules
from results_viewer.utils import visualize_pil_misplaced_objects
from django.conf import settings
import numpy as np
import os

def increment_detection_count(user, detection_type):
    """
    Increment the detection count for a user based on the detection type (image or video).
    
    Args:
        user: The user for whom the detection count needs to be incremented.
        detection_type: The type of detection ('image' or 'video') to be incremented.
    """
    # Retrieve the daily detection limit object for the user
    detection_limit = DailyDetectionLimit.objects.get(user=user)
    
    # Increment the appropriate detection count based on the detection type
    if detection_type == 'image':
        detection_limit.image_detection_count += 1
    elif detection_type == 'video':
        detection_limit.video_detection_count += 1
    
    # Save the updated detection limit object
    detection_limit.save()

def correct_image_orientation(image_path):
    """
    Correct the orientation of an image based on its EXIF data.
    
    Args:
        image_path: The path to the image file that needs orientation correction.
    """
    try:
        # Open the image file
        image = Image.open(image_path)
        
        # Get the orientation tag from the EXIF data
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        
        exif = image._getexif()
        if exif is not None:
            orientation = exif.get(orientation)
            
            # Rotate the image based on the orientation value
            if orientation == 3:
                image = image.rotate(180, expand=True)
            elif orientation == 6:
                image = image.rotate(270, expand=True)
            elif orientation == 8:
                image = image.rotate(90, expand=True)
        
        # Save the corrected image back to the same path
        image.save(image_path)
    except (AttributeError, KeyError, IndexError):
        # If there is an error accessing the EXIF data, pass without making changes
        pass

def process_video_for_misplaced_objects(video_path, frame_interval, frame_delay, detection_model, category_index):
    """
    Process a video to detect and visualize misplaced objects at specified frame intervals.
    
    Args:
        video_path: The path to the video file that needs processing.
        frame_interval: The interval (in seconds) at which frames should be analyzed.
        frame_delay: The delay (in seconds) between frames in the output video.
        detection_model: The object detection model to be used for inference.
        category_index: The category index mapping class IDs to class names.
    
    Returns:
        detected_objects_all_frames: A list of detected objects for each analyzed frame.
        misplaced_objects_all_frames: A list of misplaced objects for each analyzed frame.
        output_video_path: The path to the output video with annotated frames.
    """
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    
    # Get the frames per second (FPS) of the video
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    # Initialize lists to store detected and misplaced objects for each frame
    misplaced_objects_all_frames = []
    detected_objects_all_frames = []
    
    frame_count = 0
    annotated_frame_count = 1  # Start frame count from 1 for annotated frames
    frame_interval_frames = frame_interval * fps  # Convert frame interval from seconds to frames
    annotated_frames = []

    # Process the video frame by frame
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Analyze the frame at the specified intervals
        if frame_count % frame_interval_frames == 0:
            # Convert the frame to RGB format
            image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert the frame to a PIL image
            image_pil = Image.fromarray(image_np)

            # Run object detection on the frame
            detected_objects = run_inference(detection_model, category_index, image_pil)

            # Check for misplaced objects using placement rules
            placement_rules = PlacementRules()
            misplaced_objects = placement_rules.check_placement(detected_objects)

            # Store the detected and misplaced objects for the current frame
            detected_objects_all_frames.append(detected_objects)
            misplaced_objects_all_frames.append(misplaced_objects)

            # Annotate the frame with bounding boxes, labels, and frame number
            annotated_image_pil = visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects, annotated_frame_count)
            annotated_image_np = np.array(annotated_image_pil)
            annotated_frames.append(annotated_image_np)

            # Increment the annotated frame count
            annotated_frame_count += 1

        frame_count += 1

    # Release the video capture object
    cap.release()

    # Create an annotated video from the processed frames
    output_video_path = os.path.join(settings.MEDIA_ROOT, 'videos', os.path.basename(video_path).replace('.mp4', '_annotated.mp4'))
    annotated_clip = ImageSequenceClip(annotated_frames, fps=1/frame_delay)
    annotated_clip.write_videofile(output_video_path, fps=fps, codec='libx264', audio_codec='aac')

    # Return the detected objects, misplaced objects, and path to the output video
    return detected_objects_all_frames, misplaced_objects_all_frames, output_video_path
