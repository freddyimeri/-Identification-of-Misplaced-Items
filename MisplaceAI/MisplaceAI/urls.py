from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('detection/', include('detection.urls')),
    path('rules/', include('rules.urls')),
    path('auth/', include('authentication.urls')), 
    path('', include('core.urls')),
]
