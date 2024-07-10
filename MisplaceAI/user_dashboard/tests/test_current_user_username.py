# MisplaceAI/user_dashboard/tests/test_current_user_username.py

"""
Test 1: Ensure an authenticated user can retrieve their current username.
Test 2: Ensure an unauthenticated user cannot retrieve their current username.
Test 3: Ensure the username retrieval returns the correct username format.
Test 4: Ensure an authenticated user with a different username can retrieve their current username.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.urls import reverse

class CurrentUserUsernameViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(username='otheruser', password='otherpassword')
        self.client.force_authenticate(user=self.user)

    def test_current_user_username_view_authenticated(self):
        """
        Test 1: Ensure an authenticated user can retrieve their current username.
        """
        url = reverse('user-current-username')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

    def test_current_user_username_view_unauthenticated(self):
        """
        Test 2: Ensure an unauthenticated user cannot retrieve their current username.
        """
        self.client.logout()
        url = reverse('user-current-username')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_username_retrieval_correct_format(self):
        """
        Test 3: Ensure the username retrieval returns the correct username format.
        """
        self.client.force_authenticate(user=self.user)
        url = reverse('user-current-username')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertRegex(response.data['username'], r"^[a-zA-Z0-9_]+$")

    def test_current_user_username_view_different_user(self):
        """
        Test 4: Ensure an authenticated user with a different username can retrieve their current username.
        """
        self.client.force_authenticate(user=self.user2)
        url = reverse('user-current-username')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user2.username)
