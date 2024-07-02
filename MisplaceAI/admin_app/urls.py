# MisplaceAI/admin_app/urls.py
from django.urls import path
from .views import (
    admin_dashboard_view,
    admin_users_view,
    admin_deactivate_user_view,
    admin_activate_user_view,
    admin_delete_user_view
)

urlpatterns = [
    path('dashboard/', admin_dashboard_view, name='admin_dashboard'),
    path('users/', admin_users_view, name='admin_users'),
    path('users/deactivate/<int:user_id>/', admin_deactivate_user_view, name='admin_deactivate_user'),
    path('users/activate/<int:user_id>/', admin_activate_user_view, name='admin_activate_user'),
    path('users/delete/<int:user_id>/', admin_delete_user_view, name='admin_delete_user'),
]
