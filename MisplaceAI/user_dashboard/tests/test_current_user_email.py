# MisplaceAI/user_dashboard/tests/test_current_user_email.py

"""
Test ID-> E1: Ensure an authenticated user can retrieve their current email.
Test ID-> E2: Ensure an unauthenticated user cannot retrieve their current email.
Test ID-> E3: Ensure the email retrieval returns the correct email format.
Test ID-> E4: Ensure an authenticated user with a different email can retrieve their current email.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class CurrentUserEmailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        self.user2 = User.objects.create_user(username='otheruser', password='otherpassword', email='other@example.com')

    def test_current_user_email_view_authenticated(self):
        """
        Test ID-> E1: Ensure an authenticated user can retrieve their current email.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-current-email')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_current_user_email_view_unauthenticated(self):
        """
        Test ID-> E2: Ensure an unauthenticated user cannot retrieve their current email.
        """
        url = reverse('user-current-email')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_email_retrieval_correct_format(self):
        """
        Test ID-> E3: Ensure the email retrieval returns the correct email format.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-current-email')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertRegex(response.data['email'], r"[^@]+@[^@]+\.[^@]+")

    def test_current_user_email_view_different_user(self):
        """
        Test ID-> E4: Ensure an authenticated user with a different email can retrieve their current email.
        """
        self.client.force_authenticate(user=self.user2)
        url = reverse('user-current-email')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user2.email)
