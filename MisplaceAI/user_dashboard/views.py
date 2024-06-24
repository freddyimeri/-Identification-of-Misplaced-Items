# MisplaceAI/user_dashboard/views.py
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserUpdateSerializer, UserUpdateEmailSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

class UserDashboardView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UpdateEmailView(APIView):
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