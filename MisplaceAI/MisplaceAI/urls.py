# MisplaceAI/MisplaceAI/urls.py

# This file defines the URL patterns for the entire MisplaceAI Django project.
# It includes routes for the admin interface and various applications within the project.

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

# Define the URL patterns for the project
urlpatterns = [
    # Admin interface URL
    path('admin/', admin.site.urls),
    
    # Core application URLs
    path('api/', include('core.urls')),
    path('', include('core.urls')),

    # Rules application URLs
    path('api/rules/', include('rules.urls')),

    # Authentication application URLs
    path('api/auth/', include('authentication.urls')),

    # Admin app URLs for managing the application
    path('api/admin-app/', include('admin_app.urls')),

    # Process misplaced manager URLs with namespace
    path('api/process_misplaced_manager/', include('process_misplaced_manager.urls', namespace='process_misplaced_manager')),

    # Results viewer URLs with namespace
    path('api/results_viewer/', include('results_viewer.urls', namespace='results_viewer')),

    # Placement rules URLs
    path('api/placement_rules/', include('placement_rules.urls')),

    # User dashboard URLs
    path('api/user_dashboard/', include('user_dashboard.urls')),
]

# Media URL configuration
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
