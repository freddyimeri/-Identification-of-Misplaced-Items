# misplaceAI/rules/tests/test_locations.py


"""
Test ID-> LT1: test_create_location_as_admin - Test that an admin user can create a new location.
Test ID-> LT2: test_create_location_as_normal_user - Test that a normal user cannot create a new location.
Test ID-> LT3: test_delete_location_as_admin - Test that an admin user can delete an existing location.
Test ID-> LT4: test_delete_location_as_normal_user - Test that a normal user cannot delete an existing location.
Test ID-> LT5: test_get_locations_as_normal_user - Test that a normal user can retrieve the list of locations.
Test ID-> LT6: test_update_location_as_admin - Test that an admin user can update an existing location.
Test ID-> LT7: test_update_location_as_normal_user - Test that a normal user cannot update an existing location.
Test ID-> LT8: test_create_location_with_invalid_data - Test that creating a location with invalid data returns validation errors.
Test ID-> LT9: test_get_location_detail_as_admin - Test that an admin user can retrieve the details of a specific location.
Test ID-> LT10: test_get_location_detail_as_normal_user - Test that a normal user can retrieve the details of a specific location.
Test ID-> LT11: test_partial_update_location_as_admin - Test that an admin user can perform partial updates on a location.
Test ID-> LT12: test_partial_update_location_as_normal_user - Test that a normal user cannot perform partial updates on a location.
"""


from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rules.models import Location

class AdminManageLocationViewTest(APITestCase):
    """
    Test suite for the AdminManageLocationView.
    """

    def setUp(self):
        """
        Set up the test environment.
        """
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpassword')
        self.normal_user = User.objects.create_user(username='testuser', password='testpassword')
        self.location = Location.objects.create(name='Test Location')
        self.url = reverse('rules:admin_manage_location')
        self.detail_url = lambda location_id: reverse('rules:admin_manage_location_detail', args=[location_id])

    def test_create_location_as_admin(self):
        """
        Test ID-> LT1: Ensure admin users can create a new location.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'name': 'New Location'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 2)
        self.assertEqual(Location.objects.get(id=response.data['id']).name, 'New Location')

    def test_create_location_as_normal_user(self):
        """
        Test ID-> LT2: Ensure normal users cannot create a new location.
        """
        self.client.force_authenticate(user=self.normal_user)
        data = {'name': 'New Location'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_location_as_admin(self):
        """
        Test ID-> LT3: Ensure admin users can delete an existing location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = self.detail_url(self.location.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Location.objects.count(), 0)

    def test_delete_location_as_normal_user(self):
        """
        Test ID-> LT4: Ensure normal users cannot delete an existing location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = self.detail_url(self.location.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_locations_as_normal_user(self):
        """
        Test ID-> LT5: Ensure normal users can retrieve the list of locations.
        """
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Location')

    def test_update_location_as_admin(self):
        """
        Test ID-> LT6: Ensure admin users can update an existing location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = self.detail_url(self.location.id)
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=self.location.id).name, 'Updated Location')

    def test_update_location_as_normal_user(self):
        """
        Test ID-> LT7: Ensure normal users cannot update an existing location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = self.detail_url(self.location.id)
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_location_with_invalid_data(self):
        """
        Test ID-> LT8: Ensure creating a location with invalid data returns validation errors.
        """
        self.client.force_authenticate(user=self.admin_user)
        data = {'invalid_field': 'invalid_data'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_location_detail_as_admin(self):
        """
        Test ID-> LT9: Ensure admin users can retrieve the details of a specific location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = self.detail_url(self.location.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Location')

    def test_get_location_detail_as_normal_user(self):
        """
        Test ID-> LT10: Ensure normal users can retrieve the details of a specific location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = self.detail_url(self.location.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Location')

    def test_partial_update_location_as_admin(self):
        """
        Test ID-> LT11: Ensure admin users can perform partial updates on a location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = self.detail_url(self.location.id)
        data = {'name': 'Partially Updated Location'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=self.location.id).name, 'Partially Updated Location')

    def test_partial_update_location_as_normal_user(self):
        """
        Test ID-> LT12: Ensure normal users cannot perform partial updates on a location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = self.detail_url(self.location.id)
        data = {'name': 'Partially Updated Location'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
