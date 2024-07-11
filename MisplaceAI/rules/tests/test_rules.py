# misplaceAI/rules/tests/test_rules.py

"""
Test ID-> RT1: test_create_rule - Test that a rule can be created with valid data by the owner.
Test ID-> RT2: test_create_rule_with_invalid_data - Test that creating a rule with invalid data fails.
Test ID-> RT3: test_create_rule_without_association - Test that creating a rule without locations fails.
Test ID-> RT4: test_delete_rule_as_non_owner - Test that a non-owner cannot delete a rule.
Test ID-> RT5: test_delete_rule_as_owner - Test that the owner can delete their rule.
Test ID-> RT6: test_get_rule_detail_as_non_owner - Test that a non-owner cannot access the details of a rule.
Test ID-> RT7: test_get_rule_detail_as_owner - Test that the owner can access the details of their rule.
Test ID-> RT8: test_get_rules_as_non_owner - Test that a non-owner cannot access the list of rules of the owner.
Test ID-> RT9: test_get_rules_as_owner - Test that the owner can access the list of their rules.
Test ID-> RT10: test_rule_association_with_multiple_locations - Test that a rule can be associated with multiple locations.
Test ID-> RT11: test_update_rule_as_non_owner - Test that a non-owner cannot update a rule.
Test ID-> RT12: test_update_rule_as_owner - Test that the owner can update their rule.
"""

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rules.models import Item, Location, Rule

class TestAdminManageRuleView(APITestCase):
    def setUp(self):
        """
        Set up test data for the test cases.
        """
        # Create users
        self.owner = User.objects.create_user(username='owner', password='password')
        self.non_owner = User.objects.create_user(username='non_owner', password='password')
        
        # Create an item
        self.item = Item.objects.create(name='Test Item')
        
        # Create a location
        self.location = Location.objects.create(name='Test Location')
        
        # Create a rule associated with the owner
        self.rule = Rule.objects.create(user=self.owner, item=self.item)
        self.rule.locations.set([self.location])
        
        # Define URLs for rule management
        self.url = reverse('rules:admin_manage_rule')
        self.detail_url = lambda rule_id: reverse('rules:admin_manage_rule_detail', args=[rule_id])

    def test_create_rule(self):
        """
        Test ID-> RT1: test_create_rule - Test that a rule can be created with valid data by the owner.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Define the data for the new rule
        data = {
            'item': self.item.id,
            'locations': [self.location.id]
        }
        
        # Send a POST request to create the rule
        response = self.client.post(self.url, data, format='json')
        
        # Assert that the rule is created successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_rule_with_invalid_data(self):
        """
        Test ID-> RT2: test_create_rule_with_invalid_data - Test that creating a rule with invalid data fails.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Define invalid data for the new rule
        data = {
            'item': '',
            'locations': []
        }
        
        # Send a POST request with invalid data
        response = self.client.post(self.url, data, format='json')
        
        # Assert that the request fails with a 400 Bad Request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_rule_without_association(self):
        """
        Test ID-> RT3: test_create_rule_without_association - Test that creating a rule without locations fails.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Define data for the new rule without locations
        data = {
            'item': self.item.id,
            'locations': []
        }
        
        # Send a POST request with incomplete data
        response = self.client.post(self.url, data, format='json')
        
        # Assert that the request fails with a 400 Bad Request status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_rule_as_non_owner(self):
        """
        Test ID-> RT4: test_delete_rule_as_non_owner - Test that a non-owner cannot delete a rule.
        """
        # Authenticate as the non-owner
        self.client.force_authenticate(user=self.non_owner)
        
        # Send a DELETE request for the rule
        response = self.client.delete(self.detail_url(self.rule.id))
        
        # Assert that the request fails with a 403 Forbidden status
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_rule_as_owner(self):
        """
        Test ID-> RT5: test_delete_rule_as_owner - Test that the owner can delete their rule.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Send a DELETE request for the rule
        response = self.client.delete(self.detail_url(self.rule.id))
        
        # Assert that the rule is deleted successfully with a 204 No Content status
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_rule_detail_as_non_owner(self):
        """
        Test ID-> RT6: test_get_rule_detail_as_non_owner - Test that a non-owner cannot access the details of a rule.
        """
        # Authenticate as the non-owner
        self.client.force_authenticate(user=self.non_owner)
        
        # Send a GET request for the rule detail
        response = self.client.get(self.detail_url(self.rule.id))
        
        # Assert that the request fails with a 403 Forbidden status
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_rule_detail_as_owner(self):
        """
        Test ID-> RT7: test_get_rule_detail_as_owner - Test that the owner can access the details of their rule.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Send a GET request for the rule detail
        response = self.client.get(self.detail_url(self.rule.id))
        
        # Assert that the request is successful with a 200 OK status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the returned rule ID matches the rule's ID
        self.assertEqual(response.data['id'], self.rule.id)

    def test_get_rules_as_non_owner(self):
        """
        Test ID-> RT8: test_get_rules_as_non_owner - Test that a non-owner cannot access the list of rules of the owner.
        """
        # Authenticate as the non-owner
        self.client.force_authenticate(user=self.non_owner)
        
        # Send a GET request for the list of rules
        response = self.client.get(self.url)
        
        # Assert that the request is successful with a 200 OK status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the non-owner sees an empty list
        self.assertEqual(response.data, [])

    def test_get_rules_as_owner(self):
        """
        Test ID-> RT9: test_get_rules_as_owner - Test that the owner can access the list of their rules.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Send a GET request for the list of rules
        response = self.client.get(self.url)
        
        # Assert that the request is successful with a 200 OK status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the returned list contains one rule
        self.assertEqual(len(response.data), 1)
        
        # Assert that the returned rule ID matches the rule's ID
        self.assertEqual(response.data[0]['id'], self.rule.id)

    def test_rule_association_with_multiple_locations(self):
        """
        Test ID-> RT10: test_rule_association_with_multiple_locations - Test that a rule can be associated with multiple locations.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Create a new location
        new_location = Location.objects.create(name='New Location')
        
        # Define the data for updating the rule with multiple locations
        data = {
            'item': self.item.id,
            'locations': [self.location.id, new_location.id]
        }
        
        # Send a PUT request to update the rule
        response = self.client.put(self.detail_url(self.rule.id), data, format='json')
        
        # Assert that the request is successful with a 200 OK status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the rule is associated with two locations
        self.assertEqual(len(response.data['locations']), 2)

    def test_update_rule_as_non_owner(self):
        """
        Test ID-> RT11: test_update_rule_as_non_owner - Test that a non-owner cannot update a rule.
        """
        # Authenticate as the non-owner
        self.client.force_authenticate(user=self.non_owner)
        
        # Create a new item and location
        new_item = Item.objects.create(name='New Item')
        new_location = Location.objects.create(name='New Location')
        
        # Define the data for updating the rule
        data = {
            'item': new_item.id,
            'locations': [new_location.id]
        }
        
        # Send a PUT request to update the rule
        response = self.client.put(self.detail_url(self.rule.id), data, format='json')
        
        # Assert that the request fails with a 403 Forbidden status
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_rule_as_owner(self):
        """
        Test ID-> RT12: test_update_rule_as_owner - Test that the owner can update their rule.
        """
        # Authenticate as the owner
        self.client.force_authenticate(user=self.owner)
        
        # Create a new item and location
        new_item = Item.objects.create(name='New Item')
        new_location = Location.objects.create(name='New Location')
        
        # Define the data for updating the rule
        data = {
            'item': new_item.id,
            'locations': [new_location.id]
        }
        
        # Send a PUT request to update the rule
        response = self.client.put(self.detail_url(self.rule.id), data, format='json')
        
        # Assert that the request is successful with a 200 OK status
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the returned rule ID matches the rule's ID
        self.assertEqual(response.data['id'], self.rule.id)
