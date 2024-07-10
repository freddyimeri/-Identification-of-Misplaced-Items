# MisplaceAI/user_dashboard/tests/test_update_email.py

"""
Test 1: Ensure an authenticated user can update their email.
Test 2: Ensure an unauthenticated user cannot update their email.
Test 3: Ensure email updates with the correct password.
Test 4: Ensure email updates fail with the incorrect password.
Test 5: Ensure invalid email format returns an error.
Test 6: Ensure updating to an already used email returns an error.
Test 7: Ensure an email update request without a password fails.
Test 8: Ensure an email update request with an empty email field fails.
Test 9: Ensure an email update request with an empty password field fails.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class UpdateEmailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        self.other_user = User.objects.create_user(username='otheruser', password='otherpassword', email='other@example.com')

    def test_update_email_view_authenticated(self):
        """
        Test 1: Ensure an authenticated user can update their email.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_email_view_unauthenticated(self):
        """
        Test 2: Ensure an unauthenticated user cannot update their email.
        """
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_email_with_correct_password(self):
        """
        Test 3: Ensure email updates with the correct password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_email_with_wrong_password(self):
        """
        Test 4: Ensure email updates fail with the incorrect password.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': 'wrongpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_email_with_invalid_email(self):
        """
        Test 5: Ensure invalid email format returns an error.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'invalid-email', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_email_to_existing_email(self):
        """
        Test 6: Ensure updating to an already used email returns an error.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'other@example.com', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_email_without_password(self):
        """
        Test 7: Ensure an email update request without a password fails.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': ''}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_email_with_empty_email_field(self):
        """
        Test 8: Ensure an email update request with an empty email field fails.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': '', 'password': 'testpassword'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_email_with_empty_password_field(self):
        """
        Test 9: Ensure an email update request with an empty password field fails.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-update-email')
        data = {'email': 'newemail@example.com', 'password': ''}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
