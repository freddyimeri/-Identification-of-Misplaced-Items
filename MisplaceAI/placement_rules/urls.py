from django.urls import path
from .views import check_placement_view

app_name = 'placement_rules'
urlpatterns = [
    path('check/', check_placement_view, name='check_placement'),
]
