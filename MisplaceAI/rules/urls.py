# MisplaceAI/rules/urls.py

# This file defines the URL patterns for the rules app.
# It includes routes for managing users, items, locations, and rules.

from django.urls import path
from .views import (
    UserListView, AdminManageItemView, AdminManageLocationView, AdminManageRuleView
)

# Define the app name for namespacing URL names
app_name = 'rules'

# Define the URL patterns for the rules app
urlpatterns = [
    # Route for listing all users
    path('users/', UserListView.as_view(), name='user-list'),

    # Route for managing items (list, create)
    path('admin_manage_item/', AdminManageItemView.as_view(), name='admin_manage_item'),

    # Route for managing a specific item (retrieve, update, delete)
    path('admin_manage_item/<int:item_id>/', AdminManageItemView.as_view(), name='admin_manage_item_detail'),

    # Route for managing locations (list, create)
    path('admin_manage_location/', AdminManageLocationView.as_view(), name='admin_manage_location'),

    # Route for managing a specific location (retrieve, update, delete)
    path('admin_manage_location/<int:location_id>/', AdminManageLocationView.as_view(), name='admin_manage_location_detail'),

    # Route for managing rules (list, create)
    path('admin_manage_rule/', AdminManageRuleView.as_view(), name='admin_manage_rule'),

    # Route for managing a specific rule (retrieve, update, delete)
    path('admin_manage_rule/<int:rule_id>/', AdminManageRuleView.as_view(), name='admin_manage_rule_detail'),
]
