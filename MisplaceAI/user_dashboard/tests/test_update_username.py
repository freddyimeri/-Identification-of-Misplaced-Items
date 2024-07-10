# MisplaceAI/user_dashboard/tests/test_update_username.py

"""
Test 1: Ensure an authenticated user can update their username.
Test 2: Ensure an unauthenticated user cannot update their username.
Test 3: Ensure username updates fail with invalid data.
Test 4: Ensure username updates fail without providing a password.
Test 5: Ensure username updates fail with an incorrect password.
Test 6: Ensure username updates respect case sensitivity.
Test 7: Ensure username updates fail if the username is too long.
Test 8: Ensure username updates fail if the username is too short.
Test 9: Ensure a user cannot update their username to a username that already exists.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class UpdateUsernameViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.other_user = User.objects.create_user(username='otheruser', password='otherpassword')  # For duplicate username test

    def test_update_username_view_authenticated(self):
        """
        Test 1: Ensure an authenticated user can update their username.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'newusername', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newusername')

    def test_update_username_view_unauthenticated(self):
        """
        Test 2: Ensure an unauthenticated user cannot update their username.
        """
        url = reverse('user-update-username')
        data = {'username': 'newusername', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_username_with_invalid_data(self):
        """
        Test 3: Ensure username updates fail with invalid data.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': '', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_username_without_password(self):
        """
        Test 4: Ensure username updates fail without providing a password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'newusername', 'password': ''}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_username_with_incorrect_password(self):
        """
        Test 5: Ensure username updates fail with an incorrect password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'newusername', 'password': 'wrongpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_username_case_sensitivity(self):
        """
        Test 6: Ensure username updates respect case sensitivity.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'NewUsername', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'NewUsername')

    def test_update_username_too_long(self):
        """
        Test 7: Ensure username updates fail if the username is too long.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'a' * 151, 'password': 'testpassword'}  # Assuming the max length is 150
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_username_too_short(self):
        """
        Test 8: Ensure username updates fail if the username is too short.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'ab', 'password': 'testpassword'}  # Assuming the min length is 3
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_username_to_existing_username(self):
        """
        Test 9: Ensure a user cannot update their username to a username that already exists.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-username')
        data = {'username': 'otheruser', 'password': 'testpassword'}  # 'otheruser' already exists
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Username already exists')
