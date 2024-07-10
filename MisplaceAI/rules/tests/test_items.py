# misplaceAI/rules/tests/test_items.py

"""
Test 1: test_create_item_as_admin - Test that an admin user can create a new item.
Test 2: test_create_item_as_normal_user - Test that a normal user cannot create a new item.
Test 3: test_delete_item_as_admin - Test that an admin user can delete an existing item.
Test 4: test_delete_item_as_normal_user - Test that a normal user cannot delete an existing item.
Test 5: test_get_items_as_normal_user - Test that a normal user can retrieve the list of items.
Test 6: test_update_item_as_admin - Test that an admin user can update an existing item.
Test 7: test_update_item_as_normal_user - Test that a normal user cannot update an existing item.
Test 8: test_create_item_with_invalid_data - Test that creating an item with invalid data returns validation errors.
Test 9: test_get_item_detail_as_admin - Test that an admin user can retrieve the details of a specific item.
Test 10: test_get_item_detail_as_normal_user - Test that a normal user can retrieve the details of a specific item.
Test 11: test_create_duplicate_item_as_admin - Test that creating a duplicate item as admin returns an error.
Test 12: test_partial_update_item_as_admin - Test that an admin user can perform partial updates on an item.
Test 13: test_unauthenticated_access - Test that unauthenticated users cannot access any item endpoints.
"""

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rules.models import Item

class AdminManageItemViewTest(APITestCase):
    def setUp(self):
        """
        Set up test data for the test cases.
        """
        self.admin_user = User.objects.create_superuser(username='admin', password='password')
        self.normal_user = User.objects.create_user(username='user', password='password')
        
        self.item = Item.objects.create(name='Test Item')
        
        self.url = reverse('rules:admin_manage_item')
        self.detail_url = lambda item_id: reverse('rules:admin_manage_item_detail', args=[item_id])

    def test_create_item_as_admin(self):
        """
        Test 1: test_create_item_as_admin - Test that an admin user can create a new item.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'New Item'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_item_as_normal_user(self):
        """
        Test 2: test_create_item_as_normal_user - Test that a normal user cannot create a new item.
        """
        self.client.force_authenticate(user=self.normal_user)
        data = {'name': 'New Item'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_item_as_admin(self):
        """
        Test 3: test_delete_item_as_admin - Test that an admin user can delete an existing item.
        """
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.detail_url(self.item.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_item_as_normal_user(self):
        """
        Test 4: test_delete_item_as_normal_user - Test that a normal user cannot delete an existing item.
        """
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.delete(self.detail_url(self.item.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_items_as_normal_user(self):
        """
        Test 5: test_get_items_as_normal_user - Test that a normal user can retrieve the list of items.
        """
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_item_as_admin(self):
        """
        Test 6: test_update_item_as_admin - Test that an admin user can update an existing item.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'Updated Item'}
        response = self.client.put(self.detail_url(self.item.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_item_as_normal_user(self):
        """
        Test 7: test_update_item_as_normal_user - Test that a normal user cannot update an existing item.
        """
        self.client.force_authenticate(user=self.normal_user)
        data = {'name': 'Updated Item'}
        response = self.client.put(self.detail_url(self.item.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_item_with_invalid_data(self):
        """
        Test 8: test_create_item_with_invalid_data - Test that creating an item with invalid data returns validation errors.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': ''}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_item_detail_as_admin(self):
        """
        Test 9: test_get_item_detail_as_admin - Test that an admin user can retrieve the details of a specific item.
        """
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.detail_url(self.item.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_item_detail_as_normal_user(self):
        """
        Test 10: test_get_item_detail_as_normal_user - Test that a normal user can retrieve the details of a specific item.
        """
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(self.detail_url(self.item.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_duplicate_item_as_admin(self):
        """
        Test 11: test_create_duplicate_item_as_admin - Test that creating a duplicate item as admin returns an error.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'Test Item'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_partial_update_item_as_admin(self):
        """
        Test 12: test_partial_update_item_as_admin - Test that an admin user can perform partial updates on an item.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'Partially Updated Item'}
        response = self.client.patch(self.detail_url(self.item.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.name, 'Partially Updated Item')


    def test_unauthenticated_access(self):
        """
        Test 13: test_unauthenticated_access - Test that unauthenticated users cannot access any item endpoints.
        """
        data = {'name': 'Unauthenticated Item'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.put(self.detail_url(self.item.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.delete(self.detail_url(self.item.id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
