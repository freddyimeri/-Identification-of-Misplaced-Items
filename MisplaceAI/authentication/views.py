# MisplaceAI/authentication/views.py

# This file defines the views for the authentication app.
# Views handle the logic for different endpoints, providing appropriate responses
# based on the request and the business logic. This includes user registration, login, and logout.

from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    """
    View for user registration.
    """
    queryset = User.objects.all()  # Queryset of all users
    serializer_class = RegisterSerializer  # Serializer class for user registration

class LoginView(APIView):
    """
    View for user login.
    """
    def post(self, request, *args, **kwargs):
        # Deserialize the incoming data
        serializer = LoginSerializer(data=request.data)
        # Validate the data
        serializer.is_valid(raise_exception=True)
        # Authenticate the user
        user = authenticate(
            username=serializer.validated_data['username'], 
            password=serializer.validated_data['password']
        )
        if user:
            # Prevent admin users from logging in here
            if user.is_superuser:
                return Response({'error': 'Admins cannot log in here'}, status=status.HTTP_403_FORBIDDEN)
            # Generate JWT tokens for the authenticated user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    """
    View for admin user login.
    """
    def post(self, request, *args, **kwargs):
        # Deserialize the incoming data
        serializer = LoginSerializer(data=request.data)
        # Validate the data
        serializer.is_valid(raise_exception=True)
        # Authenticate the user
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user and user.is_superuser:
            # Generate JWT tokens for the authenticated admin user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': True,
                'is_authenticated': True
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid username or password or you do not have the necessary permissions to access this page.'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    View for user logout.
    """
    def post(self, request):
        try:
            # Extract the refresh token from the request
            refresh_token = request.data["refresh_token"]
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
