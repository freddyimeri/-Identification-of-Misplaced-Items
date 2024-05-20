from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

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
