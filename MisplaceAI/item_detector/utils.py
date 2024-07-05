# MisplaceAI/item_detector/utils.py

# This file contains utility functions for loading models, creating category indices,
# loading images, and running inference for object detection using TensorFlow.

import os
import glob
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO
from object_detection.utils import ops as utils_ops, label_map_util

# Patch tf1 functions into `utils.ops` for compatibility with TensorFlow 2
utils_ops.tf = tf.compat.v1

# Patch the location of gfile for TensorFlow file operations
tf.gfile = tf.io.gfile

def load_model(model_path):
    """
    Load the object detection model from the specified path.

    Args:
        model_path (str): Path to the saved model directory.

    Returns:
        model: Loaded TensorFlow model.
    """
    model = tf.saved_model.load(model_path)
    return model

def create_category_index_from_labelmap(label_map_path, use_display_name=True):
    """
    Create a category index from a label map file.

    Args:
        label_map_path (str): Path to the label map file.
        use_display_name (bool): Whether to use display names in the category index.

    Returns:
        dict: Category index mapping class IDs to class names.
    """
    return label_map_util.create_category_index_from_labelmap(label_map_path, use_display_name=use_display_name)

def load_image_into_numpy_array(image):
    """
    Load an image from file or PIL image into a numpy array.

    Args:
        image (str or PIL.Image.Image): Path to the image file or PIL image object.

    Returns:
        np.ndarray: Image as a numpy array.
    """
    if isinstance(image, str):  # If the image is a file path
        img_data = tf.io.gfile.GFile(image, "rb").read()
        image = Image.open(BytesIO(img_data))
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def run_inference(model, category_index, image):
    """
    Run inference on a single image.

    Args:
        model: Loaded TensorFlow model.
        category_index (dict): Category index mapping class IDs to class names.
        image (str or PIL.Image.Image): Path to the image file or PIL image object.

    Returns:
        list: List of detected objects with their bounding box coordinates and class names.
    """
    # Convert the image to a numpy array
    image_np = load_image_into_numpy_array(image)
    # Run inference on the image
    output_dict = run_inference_for_single_image(model, image_np)

    dataLocation = []
    print(f"Detected objects in {image if isinstance(image, str) else 'provided image'}:")
    for i, box in enumerate(output_dict["detection_boxes"]):
        if output_dict["detection_scores"][i] > 0.5:  # Only consider detections with a score above 0.5
            ymin, xmin, ymax, xmax = box
            class_id = output_dict["detection_classes"][i]
            class_name = category_index[class_id]["name"] if class_id in category_index else "N/A"
            print(f"Object {i+1} ({class_name}): [{ymin:.2f}, {xmin:.2f}, {ymax:.2f}, {xmax:.2f}]")
            dataLocation.append({
                "Object": i,
                "class_name": class_name,
                "ymin": ymin,
                "xmin": xmin,
                "ymax": ymax,
                "xmax": xmax,
            })

    return dataLocation

def run_inference_for_single_image(model, image):
    """
    Run inference on a single image and return the output dictionary.

    Args:
        model: Loaded TensorFlow model.
        image (np.ndarray): Image as a numpy array.

    Returns:
        dict: Output dictionary with detection results.
    """
    # Convert image to tensor and add batch dimension
    input_tensor = tf.convert_to_tensor(image)
    input_tensor = input_tensor[tf.newaxis, ...]

    # Run inference
    output_dict = model(input_tensor)

    # Process output tensors
    num_detections = int(output_dict.pop("num_detections"))
    output_dict = {key: value[0, :num_detections].numpy() for key, value in output_dict.items()}
    output_dict["num_detections"] = num_detections
    output_dict["detection_classes"] = output_dict["detection_classes"].astype(np.int64)

    # Process masks, if available
    if "detection_masks" in output_dict:
        detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
            output_dict["detection_masks"],
            output_dict["detection_boxes"],
            image.shape[0],
            image.shape[1],
        )
        detection_masks_reframed = tf.cast(detection_masks_reframed > 0.5, tf.uint8)
        output_dict["detection_masks_reframed"] = detection_masks_reframed.numpy()

    return output_dict
