from django.db import models

# Assuming we have models similar to the ones in the rules app.
class PlacementRule(models.Model):
    item = models.ForeignKey('rules.Item', on_delete=models.CASCADE)
    location = models.ForeignKey('rules.Location', on_delete=models.CASCADE)

    def __str__(self):
        return f"Rule: {self.item.name} should be on {self.location.name}"
