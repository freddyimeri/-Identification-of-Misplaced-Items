import os
import glob
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO
from object_detection.utils import ops as utils_ops, label_map_util

# Patch tf1 functions into `utils.ops` for compatibility
utils_ops.tf = tf.compat.v1

# Patch the location of gfile for TensorFlow file operations
tf.gfile = tf.io.gfile

def load_model(model_path):
    """Load the object detection model from the specified path."""
    model = tf.saved_model.load(model_path)
    return model

def create_category_index_from_labelmap(label_map_path, use_display_name=True):
    """Create a category index from a label map file."""
    return label_map_util.create_category_index_from_labelmap(label_map_path, use_display_name=use_display_name)

def load_image_into_numpy_array(path):
    """Load an image from file into a numpy array."""
    img_data = tf.io.gfile.GFile(path, "rb").read()
    image = Image.open(BytesIO(img_data))
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def run_inference(model, category_index, image_path):
    """Run inference on a single image."""
    print("-----------------------------------")
    print("DEBUG-MESSAGE--FROM-BATCH-INTERFACE")

    image_np = load_image_into_numpy_array(image_path)
    output_dict = run_inference_for_single_image(model, image_np)

    dataLocation = []
    print(f"Detected objects in {image_path}:")
    for i, box in enumerate(output_dict["detection_boxes"]):
        if output_dict["detection_scores"][i] > 0.5:
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

    print("-----------------------------------")
    return dataLocation

def run_inference_for_single_image(model, image):
    """Run inference on a single image and return the output dictionary."""
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
