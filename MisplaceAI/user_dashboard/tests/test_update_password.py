# MisplaceAI/user_dashboard/tests/test_update_password.py


"""
Test 1: Ensure an authenticated user can update their password.
Test 2: Ensure an unauthenticated user cannot update their password.
Test 3: Ensure password updates with the correct current password.
Test 4: Ensure password updates fail with the wrong current password.
Test 5: Ensure password updates fail when new passwords do not match.
Test 6: Ensure password updates fail with invalid new password format.
"""


from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

class UpdatePasswordViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_update_password_view_authenticated(self):
        """
        Test 1: Ensure an authenticated user can update their password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-password')
        data = {
            'current_password': 'testpassword',
            'new_password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_password_view_unauthenticated(self):
        """
        Test 2: Ensure an unauthenticated user cannot update their password.
        """
        url = reverse('user-update-password')
        data = {
            'current_password': 'testpassword',
            'new_password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_update_password_with_correct_current_password(self):
        """
        Test 3: Ensure password updates with the correct current password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-password')
        data = {
            'current_password': 'testpassword',
            'new_password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_password_with_wrong_current_password(self):
        """
        Test 4: Ensure password updates fail with the wrong current password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-password')
        data = {
            'current_password': 'wrongpassword',
            'new_password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Current password is incorrect')

    def test_update_password_with_mismatched_new_passwords(self):
        """
        Test 5: Ensure password updates fail when new passwords do not match.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-password')
        data = {
            'current_password': 'testpassword',
            'new_password': 'newpassword123',
            'confirm_password': 'differentpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'New passwords do not match')

    def test_update_password_with_invalid_new_password_format(self):
        """
        Test 6: Ensure password updates fail with invalid new password format.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-password')
        data = {
            'current_password': 'testpassword',
            'new_password': 'short',
            'confirm_password': 'short'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
        self.assertIn('This password is too short. It must contain at least 8 characters.', response.data['new_password'])
