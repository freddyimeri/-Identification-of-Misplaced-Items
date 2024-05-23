# MisplaceAI/rules/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Item, Rule

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name']

class RuleSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    item = ItemSerializer()
    locations = LocationSerializer(many=True)

    class Meta:
        model = Rule
        fields = ['id', 'user', 'item', 'locations']
