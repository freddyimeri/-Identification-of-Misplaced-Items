# misplaceAI/rules/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Location, Item, Rule
from .serializers import LocationSerializer, ItemSerializer, RuleSerializer, UserSerializer
from django.shortcuts import get_object_or_404

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminManageItemView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        items = Item.objects.all().order_by('name')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, item_id, *args, **kwargs):
        item = get_object_or_404(Item, id=item_id)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, item_id, *args, **kwargs):
        item = get_object_or_404(Item, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminManageLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        locations = Location.objects.all().order_by('name')
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, location_id, *args, **kwargs):
        location = get_object_or_404(Location, id=location_id)
        serializer = LocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, location_id, *args, **kwargs):
        location = get_object_or_404(Location, id=location_id)
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





class AdminManageRuleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filter rules based on the authenticated user
        rules = Rule.objects.filter(user=request.user).order_by('id')
        serializer = RuleSerializer(rules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        item_id = data.get('item')
        location_ids = data.get('locations', [])

        user = request.user
        item = get_object_or_404(Item, id=item_id)
        locations = Location.objects.filter(id__in=location_ids)

        if not locations.exists():
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        rule = Rule(user=user, item=item)
        rule.save()
        rule.locations.set(locations)
        rule.save()

        serializer = RuleSerializer(rule)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, rule_id, *args, **kwargs):
        rule = get_object_or_404(Rule, id=rule_id)
        data = request.data
        item_id = data.get('item')
        location_ids = data.get('locations', [])

        item = get_object_or_404(Item, id=item_id)
        locations = Location.objects.filter(id__in=location_ids)

        if not locations.exists():
            return Response({'error': 'One or more locations are invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        rule.item = item
        rule.locations.set(locations)
        rule.save()

        serializer = RuleSerializer(rule)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, rule_id, *args, **kwargs):
        rule = get_object_or_404(Rule, id=rule_id)
        rule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
