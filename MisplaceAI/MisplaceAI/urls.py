# MisplaceAI/urls.py

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('rules/', include('rules.urls')),
    path('auth/', include('authentication.urls')),
    path('admin-app/', include('admin_app.urls')),
    path('process_misplaced_manager/', include('process_misplaced_manager.urls', namespace='process_misplaced_manager')),
    path('results_viewer/', include('results_viewer.urls', namespace='results_viewer')),
    path('placement_rules/', include('placement_rules.urls')),  # Ensure placement_rules URLs are included
 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)