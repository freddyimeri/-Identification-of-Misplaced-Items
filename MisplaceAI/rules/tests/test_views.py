# misplaceAI/rules/tests/test_views.py

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rules.models import Item

class AdminManageItemViewTest(APITestCase):

    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_create_item(self):
        """
        Ensure we can create a new item.
        """
        url = reverse('rules:admin_manage_item')
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        
        # Check if the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check if the item was actually created
        self.assertEqual(Item.objects.count(), 1)
        self.assertEqual(Item.objects.get().name, 'New Item')
