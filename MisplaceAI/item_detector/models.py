#item_detector/models.py
from django.db import models

class DetectedObject(models.Model):
    class_name = models.CharField(max_length=255)
    ymin = models.FloatField()
    xmin = models.FloatField()
    ymax = models.FloatField()
    xmax = models.FloatField()
    image = models.ForeignKey('process_misplaced_manager.UploadedImage', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.class_name} ({self.ymin}, {self.xmin}, {self.ymax}, {self.xmax})"
