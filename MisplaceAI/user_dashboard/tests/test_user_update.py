# MisplaceAI/user_dashboard/tests/test_user_update.py

"""
Test ID-> UU1: Ensure an authenticated user can update their information.
Test ID-> UU2: Ensure an unauthenticated user cannot update information.
Test ID-> UU3: Ensure invalid data returns appropriate errors.
Test ID-> UU4: Ensure partial updates work correctly for authenticated users.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class UserUpdateViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_user_update_view_authenticated(self):
        """
        Test ID-> UU1: Ensure an authenticated user can update their information.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update')
        data = {'username': 'updateduser'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'updateduser')

    def test_user_update_view_unauthenticated(self):
        """
        Test ID-> UU2: Ensure an unauthenticated user cannot update information.
        """
        url = reverse('user-update')
        data = {'username': 'updateduser'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_update_view_invalid_data(self):
        """
        Test ID-> UU3: Ensure invalid data returns appropriate errors.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update')
        data = {'username': ''}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_update_view_partial_update(self):
        """
        Test ID-> UU4: Ensure partial updates work correctly for authenticated users.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update')
        data = {'first_name': 'Updated'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
