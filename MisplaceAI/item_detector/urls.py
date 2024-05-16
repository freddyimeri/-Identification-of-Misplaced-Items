from django.urls import path
from .views import detect_items

app_name = 'item_detector'

urlpatterns = [
    path('detect/<int:image_id>/', detect_items, name='detect_items'),
]
