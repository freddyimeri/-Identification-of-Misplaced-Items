from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rules.models import Item, Location

class PermissionsTest(APITestCase):
    """
    Test suite for permissions to ensure only authenticated users can access item and location endpoints.
    """

    def setUp(self):
        # Create a normal user and an admin user
        self.normal_user = User.objects.create_user(username='normaluser', password='testpassword')
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpassword')
        
        # Create an item and a location
        self.item = Item.objects.create(name='Test Item')
        self.location = Location.objects.create(name='Test Location')

    def test_normal_user_cannot_access_items(self):
        """
        Ensure a normal user cannot access the item management endpoints.
        """
        self.client.force_authenticate(user=self.normal_user)
        
        # Attempt to access item list
        url = reverse('rules:admin_manage_item')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Attempt to create an item
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to update an item
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        data = {'name': 'Updated Item'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to delete an item
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_normal_user_cannot_access_locations(self):
        """
        Ensure a normal user cannot access the location management endpoints.
        """
        self.client.force_authenticate(user=self.normal_user)
        
        # Attempt to access location list
        url = reverse('rules:admin_manage_location')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Attempt to create a location
        data = {'name': 'New Location'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to update a location
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to delete a location
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_can_access_items_and_locations(self):
        """
        Ensure an admin user can access the item and location management endpoints.
        """
        self.client.force_authenticate(user=self.admin_user)
        
        # Access item list
        url = reverse('rules:admin_manage_item')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Create an item
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Update an item
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        data = {'name': 'Updated Item'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete an item
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Access location list
        url = reverse('rules:admin_manage_location')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Create a location
        data = {'name': 'New Location'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Update a location
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete a location
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_normal_user_can_access_rules(self):
        """
        Ensure a normal user can access the rules management endpoints.
        """
        self.client.force_authenticate(user=self.normal_user)
        
        # Access rule list
        url = reverse('rules:admin_manage_rule')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Create a rule
        data = {'item': self.item.id, 'locations': [self.location.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Update a rule
        url = reverse('rules:admin_manage_rule_detail', args=[self.item.id])
        new_item = Item.objects.create(name='New Item')
        new_location = Location.objects.create(name='New Location')
        data = {'item': new_item.id, 'locations': [new_location.id]}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Delete a rule
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
