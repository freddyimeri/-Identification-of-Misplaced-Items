from django.db import models

class PlacementRule(models.Model):
    object_name = models.CharField(max_length=100)
    allowed_locations = models.JSONField()

    def __str__(self):
        return self.object_name
