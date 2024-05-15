from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('rules/', include('rules.urls')),
    path('auth/', include('authentication.urls')), 
    path('admin-app/', include('admin_app.urls')),
   
]
