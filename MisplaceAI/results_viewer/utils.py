import os
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def visualize_misplaced_objects(image_path, dataLocation, misplaced_objects):
    """Visualize misplaced objects with annotations."""
    image = Image.open(image_path)
    width, height = image.size

    plt.figure(figsize=(12, 8))
    plt.imshow(image)

    ax = plt.gca()

    misplaced_names = [obj["class_name"] for obj in misplaced_objects]

    for obj in dataLocation:
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
            edgecolor="red" if obj["class_name"] in misplaced_names else "green",
            facecolor="none",
        )
        ax.add_patch(rect)

        if obj["class_name"] in misplaced_names:
            ax.text(
                xmin,
                ymin,
                f"Misplaced: {obj['class_name']}",
                color="red",
                fontsize=12,
                verticalalignment="bottom",
            )

    plt.axis("off")
    output_annotated_image_path = os.path.join("media", "annotated_" + os.path.basename(image_path))
    plt.savefig(output_annotated_image_path, bbox_inches='tight', pad_inches=0.0)
    plt.close()

    return output_annotated_image_path
