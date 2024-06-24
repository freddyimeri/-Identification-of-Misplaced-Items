# MisplaceAI/user_dashboard/urls.py
from django.urls import path
from .views import UserDashboardView, UserUpdateView, UpdateEmailView

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('dashboard/update/', UserUpdateView.as_view(), name='user-update'),
    path('dashboard/update_email/', UpdateEmailView.as_view(), name='user-update-email'),

]
