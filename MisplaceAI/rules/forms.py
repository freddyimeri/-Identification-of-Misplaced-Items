# MisplaceAI/rules/forms.py

from django import forms
from .models import Rule, Location, Item

class RuleForm(forms.ModelForm):
    class Meta:
        model = Rule
        fields = ['user', 'item', 'locations']

class LocationForm(forms.ModelForm):
    class Meta:
        model = Location
        fields = ['name']

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name']
