# MisplaceAI/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('', include('core.urls')),
    path('api/rules/', include('rules.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/admin-app/', include('admin_app.urls')),
    path('api/process_misplaced_manager/', include('process_misplaced_manager.urls', namespace='process_misplaced_manager')),
    path('api/results_viewer/', include('results_viewer.urls', namespace='results_viewer')),
    path('api/placement_rules/', include('placement_rules.urls')),
    path('api/user_dashboard/', include('user_dashboard.urls')),   

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
