from django.db import models

class Rule(models.Model):
    name = models.CharField(max_length=255, unique=True)
    condition = models.TextField()
    action = models.TextField()

    def __str__(self):
        return self.name
