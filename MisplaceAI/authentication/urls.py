# MisplaceAI/authentication/urls.py

# This file defines the URL patterns for the authentication app.
# It includes routes for user registration, login, and logout.

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LoginView, AdminLoginView, LogoutView

# Define the URL patterns for the authentication app
urlpatterns = [
    # Route for user registration
    path('register/', RegisterView.as_view(), name='register'),

    # Route for user login
    path('login/', LoginView.as_view(), name='login'),

    # Route for admin user login
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),

    # Route for obtaining JWT tokens
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Route for refreshing JWT tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Route for user logout
    path('logout/', LogoutView.as_view(), name='logout'),
]
