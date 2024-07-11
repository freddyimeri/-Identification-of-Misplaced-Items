# MisplaceAI/user_dashboard/tests/test_user_dashboard.py

"""
Test ID-> UD1: Ensure an authenticated user can retrieve their dashboard information.
Test ID-> UD2: Ensure an unauthenticated user cannot retrieve dashboard information.
Test ID-> UD3: Ensure an authenticated user can retrieve their full profile details.
Test ID-> UD4: Ensure retrieving the dashboard information includes the user's email.
Test ID-> UD5: Ensure retrieving the dashboard information includes the user's first name and last name.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class UserDashboardViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpassword',
            email='testuser@example.com',
            first_name='Test',
            last_name='User'
        )

    def test_user_dashboard_view_authenticated(self):
        """
        Test ID-> UD1: Ensure an authenticated user can retrieve their dashboard information.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_user_dashboard_view_unauthenticated(self):
        """
        Test ID-> UD2: Ensure an unauthenticated user cannot retrieve dashboard information.
        """
        url = reverse('user-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_dashboard_view_full_profile(self):
        """
        Test ID-> UD3: Ensure an authenticated user can retrieve their full profile details.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)

    def test_user_dashboard_includes_email(self):
        """
        Test ID-> UD4: Ensure retrieving the dashboard information includes the user's email.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'], self.user.email)

    def test_user_dashboard_includes_name(self):
        """
        Test ID-> UD5: Ensure retrieving the dashboard information includes the user's first name and last name.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('first_name', response.data)
        self.assertIn('last_name', response.data)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)
