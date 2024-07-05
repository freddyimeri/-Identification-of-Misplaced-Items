# MisplaceAI/rules/forms.py

# This file defines forms for the rules app.
# Forms are used to handle user input and validate the data before it is saved to the database.

from django import forms
from .models import Rule, Location, Item

class RuleForm(forms.ModelForm):
    """
    Form for creating and updating rules.
    """
    class Meta:
        model = Rule
        fields = ['user', 'item', 'locations']

class LocationForm(forms.ModelForm):
    """
    Form for creating and updating locations.
    """
    class Meta:
        model = Location
        fields = ['name']

class ItemForm(forms.ModelForm):
    """
    Form for creating and updating items.
    """
    class Meta:
        model = Item
        fields = ['name']
