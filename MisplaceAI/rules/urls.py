from django.urls import path
from .views import list_rules, add_rule, get_rule, remove_rule, update_rule

app_name = 'rules'
urlpatterns = [
    path('', list_rules, name='list_rules'),
    path('add/', add_rule, name='add_rule'),
    path('<str:rule_name>/', get_rule, name='get_rule'),
    path('remove/<str:rule_name>/', remove_rule, name='remove_rule'),
    path('update/<str:rule_name>/', update_rule, name='update_rule'),

]
