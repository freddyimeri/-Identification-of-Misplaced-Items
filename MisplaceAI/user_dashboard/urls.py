# MisplaceAI/user_dashboard/urls.py
from django.urls import path
from .views import UserDashboardView, UserUpdateView, UpdateEmailView,CurrentUserEmailView,CurrentUserUsernameView,UpdateUsernameView

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('update_email/', UpdateEmailView.as_view(), name='user-update-email'),
    path('email/', CurrentUserEmailView.as_view(), name='user-current-email'),
    path('username/', CurrentUserUsernameView.as_view(), name='user-current-username'),
    path('update_username/', UpdateUsernameView.as_view(), name='user-update-username'),

]
