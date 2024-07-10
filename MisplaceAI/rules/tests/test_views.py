from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from rules.models import Location, Item, Rule

class UserListViewTest(APITestCase):
    """
    Test suite for the UserListView.
    """

    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_list_users(self):
        """
        Ensure we can list all users.
        """
        url = reverse('rules:user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'testuser')

class AdminManageItemViewTest(APITestCase):
    """
    Test suite for the AdminManageItemView.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.item = Item.objects.create(name='Test Item')

    def test_get_items(self):
        """
        Ensure we can retrieve the list of items.
        """
        url = reverse('rules:admin_manage_item')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Item')

    def test_create_item(self):
        """
        Ensure we can create a new item.
        """
        url = reverse('rules:admin_manage_item')
        data = {'name': 'New Item'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Item.objects.count(), 2)
        self.assertEqual(Item.objects.get(id=response.data['id']).name, 'New Item')

    def test_update_item(self):
        """
        Ensure we can update an existing item.
        """
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        data = {'name': 'Updated Item'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Item.objects.get(id=self.item.id).name, 'Updated Item')

    def test_delete_item(self):
        """
        Ensure we can delete an existing item.
        """
        url = reverse('rules:admin_manage_item_detail', args=[self.item.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Item.objects.count(), 0)

class AdminManageLocationViewTest(APITestCase):
    """
    Test suite for the AdminManageLocationView.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.location = Location.objects.create(name='Test Location')

    def test_get_locations(self):
        """
        Ensure we can retrieve the list of locations.
        """
        url = reverse('rules:admin_manage_location')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Location')

    def test_create_location(self):
        """
        Ensure we can create a new location.
        """
        url = reverse('rules:admin_manage_location')
        data = {'name': 'New Location'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Location.objects.count(), 2)
        self.assertEqual(Location.objects.get(id=response.data['id']).name, 'New Location')

    def test_update_location(self):
        """
        Ensure we can update an existing location.
        """
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        data = {'name': 'Updated Location'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Location.objects.get(id=self.location.id).name, 'Updated Location')

    def test_delete_location(self):
        """
        Ensure we can delete an existing location.
        """
        url = reverse('rules:admin_manage_location_detail', args=[self.location.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Location.objects.count(), 0)

class AdminManageRuleViewTest(APITestCase):
    """
    Test suite for the AdminManageRuleView.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.item = Item.objects.create(name='Test Item')
        self.location = Location.objects.create(name='Test Location')
        self.rule = Rule.objects.create(user=self.user, item=self.item)
        self.rule.locations.add(self.location)

    def test_get_rules(self):
        """
        Ensure we can retrieve the list of rules.
        """
        url = reverse('rules:admin_manage_rule')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['item']['id'], self.item.id)

    def test_create_rule(self):
        """
        Ensure we can create a new rule.
        """
        url = reverse('rules:admin_manage_rule')
        data = {'item': self.item.id, 'locations': [self.location.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Rule.objects.count(), 2)
        self.assertEqual(Rule.objects.get(id=response.data['id']).item.id, self.item.id)

    def test_update_rule(self):
        """
        Ensure we can update an existing rule.
        """
        url = reverse('rules:admin_manage_rule_detail', args=[self.rule.id])
        new_item = Item.objects.create(name='New Item')
        new_location = Location.objects.create(name='New Location')
        data = {'item': new_item.id, 'locations': [new_location.id]}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_rule = Rule.objects.get(id=self.rule.id)
        self.assertEqual(updated_rule.item.id, new_item.id)
        self.assertEqual(updated_rule.locations.first().id, new_location.id)

    def test_delete_rule(self):
        """
        Ensure we can delete an existing rule.
        """
        url = reverse('rules:admin_manage_rule_detail', args=[self.rule.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Rule.objects.count(), 0)