# misplaceAI/rules/views.py

from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Item, Location, Rule
from .serializers import ItemSerializer, LocationSerializer, UserSerializer, RuleSerializer
from .decorators import admin_required

class UserListView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all users from the database
        users = User.objects.all()
        # Serialize the user objects
        serializer = UserSerializer(users, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminManageItemView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all items from the database, ordered by name
        items = Item.objects.all().order_by('name')
        # Serialize the item objects
        serializer = ItemSerializer(items, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    @method_decorator(admin_required)
    def post(self, request, *args, **kwargs):
        # Deserialize the request data into an ItemSerializer
        serializer = ItemSerializer(data=request.data)
        # Check if the data is valid
        if serializer.is_valid():
            # Save the new item to the database
            serializer.save()
            # Return the serialized data with a 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return the errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(admin_required)
    def put(self, request, item_id, *args, **kwargs):
        # Retrieve the existing item or return 404 if not found
        item = get_object_or_404(Item, id=item_id)
        # Deserialize the request data into an ItemSerializer
        serializer = ItemSerializer(item, data=request.data)
        # Check if the data is valid
        if serializer.is_valid():
            # Save the updated item to the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Return the errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(admin_required)
    def delete(self, request, item_id, *args, **kwargs):
        # Retrieve the existing item or return 404 if not found
        item = get_object_or_404(Item, id=item_id)
        # Delete the item from the database
        item.delete()
        # Return a 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminManageLocationView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve all locations from the database, ordered by name
        locations = Location.objects.all().order_by('name')
        # Serialize the location objects
        serializer = LocationSerializer(locations, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    @method_decorator(admin_required)
    def post(self, request, *args, **kwargs):
        # Deserialize the request data into a LocationSerializer
        serializer = LocationSerializer(data=request.data)
        # Check if the data is valid
        if serializer.is_valid():
            # Save the new location to the database
            serializer.save()
            # Return the serialized data with a 201 Created status
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return the errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(admin_required)
    def put(self, request, location_id, *args, **kwargs):
        # Retrieve the existing location or return 404 if not found
        location = get_object_or_404(Location, id=location_id)
        # Deserialize the request data into a LocationSerializer
        serializer = LocationSerializer(location, data=request.data)
        # Check if the data is valid
        if serializer.is_valid():
            # Save the updated location to the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Return the errors with a 400 Bad Request status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(admin_required)
    def delete(self, request, location_id, *args, **kwargs):
        # Retrieve the existing location or return 404 if not found
        location = get_object_or_404(Location, id=location_id)
        # Delete the location from the database
        location.delete()
        # Return a 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)






class AdminManageRuleView(APIView):
    """
    View to manage rules. Only accessible by authenticated users.
    """
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get(self, request, rule_id=None, *args, **kwargs):
        """
        Retrieve a list of rules for the authenticated user or a specific rule.
        """
        # Check if a specific rule ID is provided
        if rule_id:
            # Retrieve the rule or return 404 if not found
            rule = get_object_or_404(Rule, id=rule_id)
            # Ensure the rule belongs to the authenticated user
            if rule.user != request.user:
                # Return 403 Forbidden if the user does not own the rule
                return Response(status=status.HTTP_403_FORBIDDEN)
            # Serialize the rule object
            serializer = RuleSerializer(rule)
        else:
            # Retrieve all rules for the authenticated user
            rules = Rule.objects.filter(user=request.user).order_by('id')
            # Serialize the list of rule objects
            serializer = RuleSerializer(rules, many=True)
        # Return the serialized data with 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Create a new rule associated with the authenticated user.
        """
        # Get the data from the request
        data = request.data
        # Get the item ID from the data
        item_id = data.get('item')
        # Get the list of location IDs from the data
        location_ids = data.get('locations', [])

        # Check if both item ID and location IDs are provided
        if not item_id or not location_ids:
            # Return 400 Bad Request if not
            return Response({'error': 'Item and locations are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the authenticated user
        user = request.user
        # Retrieve the item object or return 404 if not found
        item = get_object_or_404(Item, id=item_id)
        # Retrieve the location objects for the provided IDs
        locations = Location.objects.filter(id__in=location_ids)

        # Check if the locations exist
        if not locations.exists():
            # Return 400 Bad Request if not
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new rule object
        rule = Rule(user=user, item=item)
        # Save the rule object to the database
        rule.save()
        # Associate the locations with the rule
        rule.locations.set(locations)
        # Save the rule object again to update the associations
        rule.save()

        # Serialize the rule object
        serializer = RuleSerializer(rule)
        # Return the serialized data with 201 Created status
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, rule_id, *args, **kwargs):
        """
        Update an existing rule for the authenticated user.
        """
        # Retrieve the existing rule object from the database and ensure it belongs to the user
        rule = get_object_or_404(Rule, id=rule_id)
        # Ensure the rule belongs to the authenticated user
        if rule.user != request.user:
            # Return 403 Forbidden if the user does not own the rule
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        # Get the data from the request
        data = request.data
        # Get the item ID from the data
        item_id = data.get('item')
        # Get the list of location IDs from the data
        location_ids = data.get('locations', [])

        # Retrieve the item object or return 404 if not found
        item = get_object_or_404(Item, id=item_id)
        # Retrieve the location objects for the provided IDs
        locations = Location.objects.filter(id__in=location_ids)

        # Check if the locations exist
        if not locations.exists():
            # Return 400 Bad Request if not
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the item associated with the rule
        rule.item = item
        # Update the locations associated with the rule
        rule.locations.set(locations)
        # Save the updated rule object to the database
        rule.save()

        # Serialize the rule object
        serializer = RuleSerializer(rule)
        # Return the serialized data with 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, rule_id, *args, **kwargs):
        """
        Delete an existing rule for the authenticated user.
        """
        # Retrieve the rule object or return 404 if not found
        rule = get_object_or_404(Rule, id=rule_id)
        # Ensure the rule belongs to the authenticated user
        if rule.user != request.user:
            # Return 403 Forbidden if the user does not own the rule
            return Response(status=status.HTTP_403_FORBIDDEN)
        # Delete the rule object from the database
        rule.delete()
        # Return 204 No Content status to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
