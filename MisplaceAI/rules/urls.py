from django.urls import path
from .views import (
    UserListView, AdminManageItemView, AdminManageLocationView, AdminManageRuleView
)

app_name = 'rules'
urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('admin_manage_item/', AdminManageItemView.as_view(), name='admin_manage_item'),
    path('admin_manage_item/<int:item_id>/', AdminManageItemView.as_view(), name='admin_manage_item_detail'),
    path('admin_manage_location/', AdminManageLocationView.as_view(), name='admin_manage_location'),
    path('admin_manage_location/<int:location_id>/', AdminManageLocationView.as_view(), name='admin_manage_location_detail'),
    path('admin_manage_rule/', AdminManageRuleView.as_view(), name='admin_manage_rule'),
    path('admin_manage_rule/<int:rule_id>/', AdminManageRuleView.as_view(), name='admin_manage_rule_detail'),
]
