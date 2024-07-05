# MisplaceAI/user_dashboard/urls.py

# This file defines the URL patterns for the user_dashboard app.
# It includes routes for viewing and updating user information.

from django.urls import path
from .views import UserDashboardView, UserUpdateView, UpdateEmailView, CurrentUserEmailView, CurrentUserUsernameView, UpdateUsernameView, UpdatePasswordView

# Define the URL patterns for the user_dashboard app
urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('update_email/', UpdateEmailView.as_view(), name='user-update-email'),
    path('email/', CurrentUserEmailView.as_view(), name='user-current-email'),
    path('username/', CurrentUserUsernameView.as_view(), name='user-current-username'),
    path('update_username/', UpdateUsernameView.as_view(), name='user-update-username'),
    path('update_password/', UpdatePasswordView.as_view(), name='user-update-password'),
]
