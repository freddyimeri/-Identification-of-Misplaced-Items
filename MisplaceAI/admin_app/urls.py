# MisplaceAI/admin_app/urls.py

# This file defines the URL patterns for the admin_app.
# It includes routes for the admin dashboard, user management, and user status updates.

from django.urls import path
from .views import (
    admin_dashboard_view,
    admin_users_view,
    admin_deactivate_user_view,
    admin_activate_user_view,
    admin_delete_user_view
)

# Define the URL patterns for the admin_app
urlpatterns = [
    # Route for the admin dashboard
    path('dashboard/', admin_dashboard_view, name='admin_dashboard'),

    # Route for listing all users
    path('users/', admin_users_view, name='admin_users'),

    # Route for deactivating a specific user
    path('users/deactivate/<int:user_id>/', admin_deactivate_user_view, name='admin_deactivate_user'),

    # Route for activating a specific user
    path('users/activate/<int:user_id>/', admin_activate_user_view, name='admin_activate_user'),

    # Route for deleting a specific user
    path('users/delete/<int:user_id>/', admin_delete_user_view, name='admin_delete_user'),
]
