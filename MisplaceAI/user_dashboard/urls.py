# MisplaceAI/user_dashboard/urls.py
from django.urls import path
from .views import UserDashboardView

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
]
