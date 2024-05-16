import numpy as np
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import tensorflow as tf
import os


from object_detection.utils import label_map_util, ops as utils_ops

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

MAX_DIMENSION = 1024

def load_image_into_numpy_array(path):
    img_data = tf.io.gfile.GFile(path, "rb").read()
    image = Image.open(BytesIO(img_data))
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def load_model(model_path):
    return tf.saved_model.load(model_path)

def create_category_index_from_labelmap(label_map_path, use_display_name=True):
    return label_map_util.create_category_index_from_labelmap(label_map_path, use_display_name)

def resize_image(image):
    width, height = image.size
    if width > MAX_DIMENSION or height > MAX_DIMENSION:
        if width > height:
            new_width = MAX_DIMENSION
            new_height = int((MAX_DIMENSION / width) * height)
        else:
            new_height = MAX_DIMENSION
            new_width = int((MAX_DIMENSION / height) * width)
        return image.resize((new_width, new_height), Image.ANTIALIAS)
    return image

def run_inference(model, category_index, image_path):
    image_np = load_image_into_numpy_array(image_path)
    input_tensor = tf.convert_to_tensor(image_np)
    input_tensor = input_tensor[tf.newaxis, ...]
    output_dict = model(input_tensor)
    num_detections = int(output_dict.pop("num_detections"))
    output_dict = {key: value[0, :num_detections].numpy() for key, value in output_dict.items()}
    output_dict["num_detections"] = num_detections
    output_dict["detection_classes"] = output_dict["detection_classes"].astype(np.int64)

    detected_objects = []
    for i in range(num_detections):
        if output_dict['detection_scores'][i] > 0.5:
            ymin, xmin, ymax, xmax = output_dict['detection_boxes'][i]
            class_id = output_dict['detection_classes'][i]
            class_name = category_index[class_id]['name'] if class_id in category_index else 'N/A'
            detected_objects.append({
                'class_name': class_name,
                'ymin': ymin,
                'xmin': xmin,
                'ymax': ymax,
                'xmax': xmax
            })

    return detected_objects

def visualize_boxes(image_path, detected_objects, output_path):
    image = Image.open(image_path)
    image = resize_image(image)  # Resize the image if necessary
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    for obj in detected_objects:
        ymin = obj['ymin'] * image.height
        xmin = obj['xmin'] * image.width
        ymax = obj['ymax'] * image.height
        xmax = obj['xmax'] * image.width

        draw.rectangle([(xmin, ymin), (xmax, ymax)], outline="red", width=3)
        draw.text((xmin, ymin), obj['class_name'], fill="red", font=font)

    image.save(output_path)

def run_inference_and_visualize(model, category_index, image_path, output_path):
    detected_objects = run_inference(model, category_index, image_path)
    visualize_boxes(image_path, detected_objects, output_path)
    return detected_objects
