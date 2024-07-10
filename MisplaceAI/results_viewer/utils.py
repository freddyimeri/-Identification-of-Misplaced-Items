# MisplaceAI/results_viewer/utils.py

# This file contains utility functions for the results_viewer app.
# These functions handle visualization tasks such as annotating images with misplaced objects.

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont
import os
from django.conf import settings

def visualize_misplaced_objects(image_path, detected_objects, misplaced_objects):
    """
    Visualize misplaced objects with annotations on an image.

    Args:
        image_path (str): Path to the image file.
        detected_objects (list): List of detected objects with their bounding box coordinates and class names.
        misplaced_objects (list): List of misplaced objects with their class names.

    Returns:
        str: Path to the annotated image.
    """
    # Open the image file
    image = Image.open(image_path)
    width, height = image.size

    plt.figure(figsize=(12, 8))
    plt.imshow(image)

    ax = plt.gca()

    # List of class names for misplaced objects
    misplaced_names = [obj["class_name"] for obj in misplaced_objects]
    print(f"Misplaced object names: {misplaced_names}")  # Debugging

    for obj in detected_objects:
        # Get the bounding box coordinates
        ymin, xmin, ymax, xmax = [
            obj["ymin"] * height,
            obj["xmin"] * width,
            obj["ymax"] * height,
            obj["xmax"] * width,
        ]

        # Draw the bounding box around the object
        rect = patches.Rectangle(
            (xmin, ymin),
            xmax - xmin,
            ymax - ymin,
            linewidth=2,
            edgecolor="green" if obj["class_name"] not in misplaced_names else "red",
            facecolor="none",
        )
        ax.add_patch(rect)

        # Annotate the object
        ax.text(
            xmin,
            ymin,
            f"{'Misplaced: ' if obj['class_name'] in misplaced_names else ''}{obj['class_name']}",
            color="red" if obj["class_name"] in misplaced_names else "green",
            fontsize=12,
            verticalalignment="bottom",
        )

    plt.axis("off")

    # Define the output path for the annotated image
    output_image_path = os.path.join("media", os.path.splitext(os.path.basename(image_path))[0] + "_annotated.png")
    # Save the annotated image
    plt.savefig(output_image_path, bbox_inches='tight', pad_inches=0.0)
    plt.close()

    print(f"Output image saved at: {output_image_path}")  # Debugging
    return output_image_path

def visualize_pil_misplaced_objects(image_pil, detected_objects, misplaced_objects, frame_number):
    """
    Visualize misplaced objects with annotations on a PIL image.

    Args:
        image_pil (PIL.Image.Image): PIL image object.
        detected_objects (list): List of detected objects with their bounding box coordinates and class names.
        misplaced_objects (list): List of misplaced objects with their class names.
        frame_number (int): Frame number for the annotated image.

    Returns:
        PIL.Image.Image: Annotated PIL image object.
    """
    # Create a drawing context for the image
    draw = ImageDraw.Draw(image_pil)
    
    # Get the dimensions of the image
    width, height = image_pil.size

    # List of class names for misplaced objects
    misplaced_names = [obj["class_name"] for obj in misplaced_objects]

    # Load a font using absolute path to the static directory
    font_size = 25  # Set the font size (increase if needed)
    font_path = os.path.join(settings.BASE_DIR, 'core/static/core/fonts/Arial.ttf')  # Path to the font file
    try:
        font = ImageFont.truetype(font_path, font_size)
        print("Font loaded successfully.")
    except IOError:
        print("Font file not found. Using default font.")
        font = ImageFont.load_default()

    # Draw frame number on the top-left corner
    frame_text = f"Frame {frame_number}"
    text_width, text_height = draw.textsize(frame_text, font=font)
    draw.rectangle([(0, 0), (text_width + 20, text_height + 20)], fill="black")
    draw.text((10, 10), frame_text, fill="yellow", font=font)

    # Iterate over all detected objects to draw their annotations
    for obj in detected_objects:
        ymin, xmin, ymax, xmax = [
            obj["ymin"] * height,
            obj["xmin"] * width,
            obj["ymax"] * height,
            obj["xmax"] * width,
        ]

        # Determine the color of the bounding box and text based on whether the object is misplaced
        color = "green" if obj["class_name"] not in misplaced_names else "red"
        draw.rectangle([xmin, ymin, xmax, ymax], outline=color, width=3)

        text = f"{'Misplaced: ' if obj['class_name'] in misplaced_names else ''}{obj['class_name']}"
        text_width, text_height = draw.textsize(text, font=font)
        
        # Check available space above and below the bounding box
        space_above = ymin - text_height - 10
        space_below = height - ymax - text_height - 10

        if space_above > 0:
            # Place the label above the bounding box
            draw.rectangle([(xmin, ymin - text_height - 10), (xmin + text_width + 10, ymin)], fill="black")
            draw.text((xmin + 5, ymin - text_height - 5), text, fill=color, font=font)
        elif space_below > 0:
            # Place the label below the bounding box
            draw.rectangle([(xmin, ymax), (xmin + text_width + 10, ymax + text_height + 10)], fill="black")
            draw.text((xmin + 5, ymax + 5), text, fill=color, font=font)
        else:
            # Place the label inside the bounding box as a fallback
            draw.rectangle([(xmin, ymin), (xmin + text_width + 10, ymin + text_height + 10)], fill="black")
            draw.text((xmin + 5, ymin + 5), text, fill=color, font=font)

    return image_pil
