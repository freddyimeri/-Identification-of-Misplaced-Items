# misplaceAI/rules/views.py

# This file defines the views for the rules app.
# Views handle the logic for different endpoints, providing appropriate responses
# based on the request and the business logic. This includes managing users, items, locations, and rules.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Location, Item, Rule
from .serializers import LocationSerializer, ItemSerializer, RuleSerializer, UserSerializer
from django.shortcuts import get_object_or_404

class UserListView(APIView):
    """
    View to list all users. Only accessible by authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all user objects from the database
        users = User.objects.all()
        # Serialize the user objects into JSON format
        serializer = UserSerializer(users, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminManageItemView(APIView):
    """
    View to manage items. Only accessible by authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all item objects from the database, ordered by name
        items = Item.objects.all().order_by('name')
        # Serialize the item objects into JSON format
        serializer = ItemSerializer(items, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Deserialize the incoming data into an ItemSerializer
        serializer = ItemSerializer(data=request.data)
        # Validate the data
        if serializer.is_valid():
            # Save the new item object to the database
            serializer.save()
            # Return the serialized data with a 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return validation errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, item_id, *args, **kwargs):
        # Retrieve the existing item object from the database
        item = get_object_or_404(Item, id=item_id)
        # Deserialize the incoming data into an ItemSerializer
        serializer = ItemSerializer(item, data=request.data)
        # Validate the data
        if serializer.is_valid():
            # Update the existing item object in the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Return validation errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, item_id, *args, **kwargs):
        # Retrieve the existing item object from the database
        item = get_object_or_404(Item, id=item_id)
        # Delete the item object from the database
        item.delete()
        # Return a 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminManageLocationView(APIView):
    """
    View to manage locations. Only accessible by authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all location objects from the database, ordered by name
        locations = Location.objects.all().order_by('name')
        # Serialize the location objects into JSON format
        serializer = LocationSerializer(locations, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Deserialize the incoming data into a LocationSerializer
        serializer = LocationSerializer(data=request.data)
        # Validate the data
        if serializer.is_valid():
            # Save the new location object to the database
            serializer.save()
            # Return the serialized data with a 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return validation errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, location_id, *args, **kwargs):
        # Retrieve the existing location object from the database
        location = get_object_or_404(Location, id=location_id)
        # Deserialize the incoming data into a LocationSerializer
        serializer = LocationSerializer(location, data=request.data)
        # Validate the data
        if serializer.is_valid():
            # Update the existing location object in the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Return validation errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, location_id, *args, **kwargs):
        # Retrieve the existing location object from the database
        location = get_object_or_404(Location, id=location_id)
        # Delete the location object from the database
        location.delete()
        # Return a 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminManageRuleView(APIView):
    """
    View to manage rules. Only accessible by authenticated users.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filter rules based on the authenticated user
        rules = Rule.objects.filter(user=request.user).order_by('id')
        # Serialize the rule objects into JSON format
        serializer = RuleSerializer(rules, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Extract the item ID and location IDs from the request data
        data = request.data
        item_id = data.get('item')
        location_ids = data.get('locations', [])

        # Get the authenticated user
        user = request.user
        # Retrieve the item object from the database
        item = get_object_or_404(Item, id=item_id)
        # Retrieve the location objects from the database
        locations = Location.objects.filter(id__in=location_ids)

        # Check if the locations exist
        if not locations.exists():
            # Return an error if one or more locations are invalid
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new rule object
        rule = Rule(user=user, item=item)
        # Save the rule object to the database
        rule.save()
        # Set the locations for the rule
        rule.locations.set(locations)
        # Save the rule object to the database
        rule.save()

        # Serialize the rule object into JSON format
        serializer = RuleSerializer(rule)
        # Return the serialized data with a 201 Created status
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, rule_id, *args, **kwargs):
        # Retrieve the existing rule object from the database
        rule = get_object_or_404(Rule, id=rule_id)
        # Extract the item ID and location IDs from the request data
        data = request.data
        item_id = data.get('item')
        location_ids = data.get('locations', [])

        # Retrieve the item object from the database
        item = get_object_or_404(Item, id=item_id)
        # Retrieve the location objects from the database
        locations = Location.objects.filter(id__in=location_ids)

        # Check if the locations exist
        if not locations.exists():
            # Return an error if one or more locations are invalid
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the rule object with the new item and locations
        rule.item = item
        rule.locations.set(locations)
        # Save the updated rule object to the database
        rule.save()

        # Serialize the rule object into JSON format
        serializer = RuleSerializer(rule)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, rule_id, *args, **kwargs):
        # Retrieve the existing rule object from the database
        rule = get_object_or_404(Rule, id=rule_id)
        # Delete the rule object from the database
        rule.delete()
        # Return a 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
