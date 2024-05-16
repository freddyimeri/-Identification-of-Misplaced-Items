from django.urls import path
from .views import visualize_results

app_name = 'results_viewer'
urlpatterns = [
    path('visualize/<int:image_id>/', visualize_results, name='visualize_results'),
]
