# misplaceAI/rules/tests/test_locations.py


"""
Test 1: test_create_location_as_admin - Test that an admin user can create a new location.
Test 2: test_create_location_as_normal_user - Test that a normal user cannot create a new location.
Test 3: test_delete_location_as_admin - Test that an admin user can delete an existing location.
Test 4: test_delete_location_as_normal_user - Test that a normal user cannot delete an existing location.
Test 5: test_get_locations_as_normal_user - Test that a normal user can retrieve the list of locations.
Test 6: test_update_location_as_admin - Test that an admin user can update an existing location.
Test 7: test_update_location_as_normal_user - Test that a normal user cannot update an existing location.
Test 8: test_create_location_with_invalid_data - Test that creating a location with invalid data returns validation errors.
Test 9: test_get_location_detail_as_admin - Test that an admin user can retrieve the details of a specific location.
Test 10: test_get_location_detail_as_normal_user - Test that a normal user can retrieve the details of a specific location.
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
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpassword')
        self.normal_user = User.objects.create_user(username='testuser', password='testpassword')
        self.location = Location.objects.create(name='Test Location')

    def test_create_location_as_admin(self):
        """
        Ensure admin users can create a new location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_location')
        data = {'name': 'New Location'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 2)
        self.assertEqual(Location.objects.get(id=response.data['id']).name, 'New Location')

    def test_create_location_as_normal_user(self):
        """
        Ensure normal users cannot create a new location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_location')
        data = {'name': 'New Location'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_location_as_admin(self):
        """
        Ensure admin users can delete an existing location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Location.objects.count(), 0)

    def test_delete_location_as_normal_user(self):
        """
        Ensure normal users cannot delete an existing location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_locations_as_normal_user(self):
        """
        Ensure normal users can retrieve the list of locations.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_location')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Location')

    def test_update_location_as_admin(self):
        """
        Ensure admin users can update an existing location.
        """
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=self.location.id).name, 'Updated Location')

    def test_update_location_as_normal_user(self):
        """
        Ensure normal users cannot update an existing location.
        """
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    def test_create_location_with_invalid_data(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_location')
        data = {'invalid_field': 'invalid_data'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_location_detail_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_get_location_detail_as_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK
