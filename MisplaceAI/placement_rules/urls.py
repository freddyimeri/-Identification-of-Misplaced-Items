# placement_rules/urls.py
from django.urls import path
from . import views

app_name = 'placement_rules'  # Ensure app_name is set for namespacing

urlpatterns = [
    path('live-detection/', views.live_detection, name='live_detection'),
    path('check_placement/', views.check_placement, name='check_placement'),
]
