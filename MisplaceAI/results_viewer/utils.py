# MisplaceAi/results_viewer/utils.py
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os
from item_detector.utils import run_inference
from placement_rules.utils import PlacementRules

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



def visualize_video_misplaced_objects(video_path, detection_model, category_index):
    cap = cv2.VideoCapture(video_path)
    misplaced_objects_list = []
    detected_objects_list = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_pil = Image.fromarray(frame_rgb)

        # Detect objects in the frame
        detected_objects = run_inference(detection_model, category_index, frame_pil)
        detected_objects_list.extend(detected_objects)

        # Check for misplaced objects
        placement_rules = PlacementRules()
        misplaced_objects = placement_rules.check_placement(detected_objects)
        misplaced_objects_list.extend(misplaced_objects)

        # Draw bounding boxes on the frame (optional for visualization purposes)
        for obj in detected_objects:
            ymin, xmin, ymax, xmax = [
                obj["ymin"] * frame_pil.height,
                obj["xmin"] * frame_pil.width,
                obj["ymax"] * frame_pil.height,
                obj["xmax"] * frame_pil.width,
            ]

            rect = patches.Rectangle(
                (xmin, ymin),
                xmax - xmin,
                ymax - ymin,
                linewidth=2,
                edgecolor="green" if obj["class_name"] not in misplaced_objects else "red",
                facecolor="none",
            )
            plt.gca().add_patch(rect)

            plt.text(
                xmin,
                ymin,
                f"{'Misplaced: ' if obj['class_name'] in misplaced_objects else ''}{obj['class_name']}",
                color="red" if obj["class_name"] in misplaced_objects else "green",
                fontsize=12,
                verticalalignment="bottom",
            )

        plt.imshow(frame_pil)
        plt.axis("off")
        plt.show()  # or save frame

    cap.release()
    return detected_objects_list, misplaced_objects_list