from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.admin_login_view, name='admin_login'),
    path('dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    path('users/', views.admin_users_view, name='admin_users'),
    path('users/deactivate/<int:user_id>/', views.admin_deactivate_user_view, name='admin_deactivate_user'),
    path('users/activate/<int:user_id>/', views.admin_activate_user_view, name='admin_activate_user'),
    path('users/delete/<int:user_id>/', views.admin_delete_user_view, name='admin_delete_user'),
]
