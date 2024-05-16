from django.urls import path
from .views import (
    list_rules, add_rule, get_rule, remove_rule, update_rule,
    admin_add_location, admin_add_item, edit_item, delete_item,edit_location, delete_location
)

app_name = 'rules'
urlpatterns = [
    path('', list_rules, name='list_rules'),
    path('add/', add_rule, name='add_rule'),
    path('<int:rule_id>/', get_rule, name='get_rule'),
    path('remove/<int:rule_id>/', remove_rule, name='remove_rule'),
    path('update/<int:rule_id>/', update_rule, name='update_rule'),
    path('admin_add_location/', admin_add_location, name='admin_add_location'),
    path('admin_add_item/', admin_add_item, name='admin_add_item'),
    
    path('edit_item/<int:item_id>/', edit_item, name='edit_item'),
    path('delete_item/<int:item_id>/', delete_item, name='delete_item'),
    path('edit_location/<int:location_id>/', edit_location, name='edit_location'),
    path('delete_location/<int:location_id>/', delete_location, name='delete_location'),


]
