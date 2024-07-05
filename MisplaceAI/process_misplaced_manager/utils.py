# MisplaceAI/process_misplaced_manager/utils.py

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
    detection_limit = DailyDetectionLimit.objects.get(user=user)
    if detection_type == 'image':
        detection_limit.image_detection_count += 1
    elif detection_type == 'video':
        detection_limit.video_detection_count += 1
    detection_limit.save()

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

def process_video_for_misplaced_objects(video_path, frame_interval, frame_delay, detection_model, category_index):
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    misplaced_objects_all_frames = []
    detected_objects_all_frames = []
    frame_count = 0
    annotated_frame_count = 1  # Start frame count from 1 for annotated frames
    frame_interval_frames = frame_interval * fps
    annotated_frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval_frames == 0:
            image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert the frame to PIL image
            image_pil = Image.fromarray(image_np)

            detected_objects = run_inference(detection_model, category_index, image_pil)

            placement_rules = PlacementRules()
            misplaced_objects = placement_rules.check_placement(detected_objects)

            detected_objects_all_frames.append(detected_objects)
            misplaced_objects_all_frames.append(misplaced_objects)

            # Annotate the frame with bounding boxes, labels, and annotated frame number
            annotated_image_pil = visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects, annotated_frame_count)
            annotated_image_np = np.array(annotated_image_pil)
            annotated_frames.append(annotated_image_np)

            # Increment the annotated frame count
            annotated_frame_count += 1

        frame_count += 1

    cap.release()

    # Create a video with a specified delay between each frame
    output_video_path = os.path.join(settings.MEDIA_ROOT, 'videos', os.path.basename(video_path).replace('.mp4', '_annotated.mp4'))
    annotated_clip = ImageSequenceClip(annotated_frames, fps=1/frame_delay)
    annotated_clip.write_videofile(output_video_path, fps=fps, codec='libx264', audio_codec='aac')

    return detected_objects_all_frames, misplaced_objects_all_frames, output_video_path
