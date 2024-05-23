from django.urls import path
from .views import ObjectDetectionView, index

urlpatterns = [
    path('detect/', ObjectDetectionView.as_view(), name='object_detection'),
    path('', index, name='index'),
]
