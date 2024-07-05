# MisplaceAI/user_dashboard/views.py

# This file defines the views for the user_dashboard app.
# Views handle the logic for different endpoints, providing appropriate responses
# based on the request and the business logic. This includes viewing and updating user information.

from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserUpdateSerializer, UserUpdateEmailSerializer, UserUpdateUsernameSerializer, UserUpdatePasswordSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class UserDashboardView(generics.RetrieveAPIView):
    """
    View for retrieving the current user's information.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current authenticated user
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    """
    View for updating the current user's information.
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current authenticated user
        return self.request.user

class UpdateEmailView(APIView):
    """
    View for updating the current user's email address.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserUpdateEmailSerializer(data=request.data)

        if serializer.is_valid():
            new_email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            if not user.check_password(password):
                return Response({'error': 'Password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            user.email = new_email
            user.save()
            return Response({'message': 'Email updated successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUsernameView(APIView):
    """
    View for updating the current user's username.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserUpdateUsernameSerializer(data=request.data)

        if serializer.is_valid():
            new_username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            if not user.check_password(password):
                return Response({'error': 'Password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            user.username = new_username
            user.save()
            return Response({'message': 'Username updated successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserEmailView(APIView):
    """
    View for retrieving the current user's email address.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({'email': user.email}, status=status.HTTP_200_OK)

class CurrentUserUsernameView(APIView):
    """
    View for retrieving the current user's username.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({'username': user.username}, status=status.HTTP_200_OK)

class UpdatePasswordView(APIView):
    """
    View for updating the current user's password.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserUpdatePasswordSerializer(data=request.data)

        if serializer.is_valid():
            current_password = serializer.validated_data.get('current_password')
            new_password = serializer.validated_data.get('new_password')
            confirm_password = serializer.validated_data.get('confirm_password')

            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password != confirm_password:
                return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
