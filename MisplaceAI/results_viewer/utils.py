# MisplaceAi/results_viewer/utils.py
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os
from item_detector.utils import run_inference
from placement_rules.utils import PlacementRules
from PIL import Image, ImageDraw, ImageFont

import cv2

def visualize_misplaced_objects(image_path, detected_objects, misplaced_objects):
    """Visualize misplaced objects with annotations."""
    image = Image.open(image_path)
    width, height = image.size

    plt.figure(figsize=(12, 8))
    plt.imshow(image)

    ax = plt.gca()

    misplaced_names = [obj["class_name"] for obj in misplaced_objects]
    print(f"Misplaced object names: {misplaced_names}")  # Debugging

    for obj in detected_objects:
        ymin, xmin, ymax, xmax = [
            obj["ymin"] * height,
            obj["xmin"] * width,
            obj["ymax"] * height,
            obj["xmax"] * width,
        ]

        rect = patches.Rectangle(
            (xmin, ymin),
            xmax - xmin,
            ymax - ymin,
            linewidth=2,
            edgecolor="green" if obj["class_name"] not in misplaced_names else "red",
            facecolor="none",
        )
        ax.add_patch(rect)

        ax.text(
            xmin,
            ymin,
            f"{'Misplaced: ' if obj['class_name'] in misplaced_names else ''}{obj['class_name']}",
            color="red" if obj["class_name"] in misplaced_names else "green",
            fontsize=12,
            verticalalignment="bottom",
        )

    plt.axis("off")

    output_image_path = os.path.join("media", os.path.splitext(os.path.basename(image_path))[0] + "_annotated.png")
    plt.savefig(output_image_path, bbox_inches='tight', pad_inches=0.0)
    plt.close()

    print(f"Output image saved at: {output_image_path}")  # Debugging
    return output_image_path






 

def visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects, frame_number):
    """Visualize misplaced objects with annotations on a PIL image."""
    draw = ImageDraw.Draw(image_pil)
    width, height = image_pil.size

    misplaced_names = [obj["class_name"] for obj in misplaced_objects]

    # Draw frame number on the top-left corner with a larger font size
    frame_text = f"Frame {frame_number}"
    font_size = 300  # Set a larger font size
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()  # Fallback to default font

    draw.text((10, 10), frame_text, fill="yellow", font=font)

    for obj in detected_objects:
        ymin, xmin, ymax, xmax = [
            obj["ymin"] * height,
            obj["xmin"] * width,
            obj["ymax"] * height,
            obj["xmax"] * width,
        ]

        color = "green" if obj["class_name"] not in misplaced_names else "red"
        draw.rectangle([xmin, ymin, xmax, ymax], outline=color, width=2)
        draw.text((xmin, ymin), f"{'Misplaced: ' if obj['class_name'] in misplaced_names else ''}{obj['class_name']}", fill=color, font=font)

    return image_pil
