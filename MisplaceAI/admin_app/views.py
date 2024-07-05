# MisplaceAI/admin_app/views.py

# This file defines the views for the admin_app.
# Views are used to handle the logic for different endpoints, providing appropriate responses
# based on the request and the business logic.

from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_view(request):
    """
    View for the admin dashboard. Only accessible by superusers.
    """
    if not request.user.is_superuser:
        return Response({'error': 'You do not have the necessary permissions to access this page.'}, status=status.HTTP_403_FORBIDDEN)
    return Response({'message': 'Welcome to the admin dashboard.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_view(request):
    """
    View to list all users. Only accessible by staff users.
    """
    if not request.user.is_staff:
        return Response({'error': 'You do not have the necessary permissions to access this page.'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_deactivate_user_view(request, user_id):
    """
    View to deactivate a user. Only accessible by staff users.
    """
    if not request.user.is_staff:
        return Response({'error': 'You do not have the necessary permissions to access this page.'}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user.is_active = False
    user.save()
    return Response({'message': f'User {user.username} has been deactivated.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_activate_user_view(request, user_id):
    """
    View to activate a user. Only accessible by staff users.
    """
    if not request.user.is_staff:
        return Response({'error': 'You do not have the necessary permissions to access this page.'}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user.is_active = True
    user.save()
    return Response({'message': f'User {user.username} has been activated.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user_view(request, user_id):
    """
    View to delete a user. Only accessible by staff users.
    """
    if not request.user.is_staff:
        return Response({'error': 'You do not have the necessary permissions to access this page.'}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response({'message': f'User {user.username} has been deleted.'}, status=status.HTTP_200_OK)
