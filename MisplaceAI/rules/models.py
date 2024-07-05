# MisplaceAI/rules/models.py

# This file defines the models for the rules app.
# Models are used to define the structure of the database tables and the relationships between them.
# Each model maps to a single table in the database.

from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    """
    Model to represent a location.
    """
    # Field to store the name of the location, must be unique
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        """
        String representation of the Location model.
        """
        return self.name

class Item(models.Model):
    """
    Model to represent an item.
    """
    # Field to store the name of the item, must be unique
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        """
        String representation of the Item model.
        """
        return self.name

class Rule(models.Model):
    """
    Model to represent a rule linking users, items, and locations.
    """
    # ForeignKey field to create a relationship with the User model
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # ForeignKey field to create a relationship with the Item model
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    # ManyToManyField to create a relationship with the Location model
    locations = models.ManyToManyField(Location)

    def __str__(self):
        """
        String representation of the Rule model.
        """
        return f"{self.item.name} Rule"
