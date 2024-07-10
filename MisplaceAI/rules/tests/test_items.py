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
"""
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rules.models import Item

class AdminManageItemViewTest(APITestCase):
    """
    Test suite for the AdminManageItemView.
    """

    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpassword')
        self.normal_user = User.objects.create_user(username='testuser', password='testpassword')
        self.item = Item.objects.create(name='Test Item')

    def test_create_item_as_admin(self):
        """
        Ensure admin users can create a new item.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_item')
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Item.objects.count(), 2)
        self.assertEqual(Item.objects.get(id=response.data['id']).name, 'New Item')

    def test_create_item_as_normal_user(self):
        """
        Ensure normal users cannot create a new item.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_item')
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_item_as_admin(self):
        """
        Ensure admin users can delete an existing item.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Item.objects.count(), 0)

    def test_delete_item_as_normal_user(self):
        """
        Ensure normal users cannot delete an existing item.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_items_as_normal_user(self):
        """
        Ensure normal users can retrieve the list of items.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_item')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Item')

    def test_update_item_as_admin(self):
        """
        Ensure admin users can update an existing item.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        data = {'name': 'Updated Item'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Item.objects.get(id=self.item.id).name, 'Updated Item')

    def test_update_item_as_normal_user(self):
        """
        Ensure normal users cannot update an existing item.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        data = {'name': 'Updated Item'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_item_with_invalid_data(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_item')
        data = {'invalid_field': 'invalid_data'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_item_detail_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_get_item_detail_as_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK

            
