# MisplaceAI/process_misplaced_manager/tests/misplacedTestAlgorithm/test_Misplaced_Items_Image.py

"""
This file tests the accuracy of the misplaced item detection algorithm by uploading images
containing various items and verifying if the system correctly identifies items that are 
misplaced according to predefined rules. It includes three tests:
Test ID-> MI1: Verify that a remote is detected as misplaced in the image 'test1.jpg'.
Test ID-> MI2: Verify that a handbag is detected as misplaced in the image 'test2.jpg'.
Test ID-> MI3: Verify that no items are detected as misplaced in the image 'test3.jpg'.
Additionally, it ensures that the uploaded images are deleted after the tests.
"""

import os
import base64
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from process_misplaced_manager.models import DetectionLimitSetting, DailyDetectionLimit

class TestAlgorithmAccuracy(APITestCase):
    def setUp(self):
        # Create and login an admin user
        self.admin_user = User.objects.create_superuser(username='admin2', password='adminpassword')
        self.client.login(username='admin2', password='adminpassword')
        
        # Create items
        # Create an item named 'remote'
        self.item_remote = self.client.post(reverse('rules:admin_manage_item'), {'name': 'remote'}).data['id']
        # Create an item named 'handbag'
        self.item_handbag = self.client.post(reverse('rules:admin_manage_item'), {'name': 'handbag'}).data['id']
        # Create an item named 'wine glass'
        self.item_wine_glass = self.client.post(reverse('rules:admin_manage_item'), {'name': 'wine glass'}).data['id']
        
        # Create locations
        # Create a location named 'dining table'
        self.location_dining_table = self.client.post(reverse('rules:admin_manage_location'), {'name': 'dining table'}).data['id']
        # Create a location named 'coffee table'
        self.location_coffee_table = self.client.post(reverse('rules:admin_manage_location'), {'name': 'coffee table'}).data['id']

        # Create rules
        # Create a rule that the 'remote' is allowed on the 'dining table'
        self.client.post(reverse('rules:admin_manage_rule'), {
            'item': self.item_remote,
            'locations': [self.location_dining_table]
        })
        # Create a rule that the 'handbag' is allowed on the 'dining table'
        self.client.post(reverse('rules:admin_manage_rule'), {
            'item': self.item_handbag,
            'locations': [self.location_dining_table]
        })
        # Create a rule that the 'wine glass' is allowed on the 'dining table'
        self.client.post(reverse('rules:admin_manage_rule'), {
            'item': self.item_wine_glass,
            'locations': [self.location_dining_table]
        })

        # Create and login the test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        
        # Set up the test image paths
        self.test_image_paths = {
            'test1.jpg': '/app/process_misplaced_manager/tests/test_files/pictures/test1.jpg',
            'test2.jpg': '/app/process_misplaced_manager/tests/test_files/pictures/test2.jpg',
            'test3.jpg': '/app/process_misplaced_manager/tests/test_files/pictures/test3.jpg'
        }
        
        # Set up the URL for the normal detection endpoint
        self.detection_url = reverse('process_misplaced_manager:normal_detection')
        
        # Set up the URL for the delete image endpoint
        self.delete_url = lambda image_name: reverse('process_misplaced_manager:delete_image_by_name', args=[image_name])
        
        # Set up a detection limit setting
        DetectionLimitSetting.objects.create(daily_image_limit=10, daily_video_limit=5)
        DailyDetectionLimit.objects.create(user=self.user)

    def test_remote_misplaced_detection(self):
        """
        Test ID-> MI1: Verify that a remote is detected as misplaced in the image 'test1.jpg'.
        """
        test_image_path = self.test_image_paths['test1.jpg']
        
        # Verify the test image path exists
        assert os.path.exists(test_image_path), f"Test image not found at {test_image_path}"

        # Open the image file and encode it to base64
        with open(test_image_path, 'rb') as image_file:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            # Prepare the data to be sent in the request
            data = {
                'capturedImageData': f'data:image/jpeg;base64,{base64_image}'
            }
            # Send the POST request to the normal detection endpoint
            response = self.client.post(self.detection_url, data, format='json')

        # Check that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve the misplaced objects from the response
        misplaced_objects = response.data['misplaced_objects']

        # Check the structure of misplaced_objects
        print(f"Misplaced objects FROM test_remote_misplaced_detection : {misplaced_objects}")
        misplaced_item_names = [obj['class_name'] for obj in misplaced_objects if 'class_name' in obj]

        # Check that the remote is detected as misplaced
        self.assertIn('remote', misplaced_item_names)

        # Delete the uploaded image
        uploaded_image_url = response.data['output_image_url']
        uploaded_image_name = uploaded_image_url.split('/')[-1]
        delete_url = self.delete_url(uploaded_image_name)
        delete_response = self.client.delete(delete_url)

        # Check that the delete response status is 204 No Content
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify that the image file is deleted
        self.assertFalse(os.path.exists(os.path.join('/app/media/images', uploaded_image_name)), f"Image still exists at {uploaded_image_name}")

    def test_handbag_misplaced_detection(self):
        """
        Test ID-> MI2: Verify that a handbag is detected as misplaced in the image 'test2.jpg'.
        """
        test_image_path = self.test_image_paths['test2.jpg']
        
        # Verify the test image path exists
        assert os.path.exists(test_image_path), f"Test image not found at {test_image_path}"

        # Open the image file and encode it to base64
        with open(test_image_path, 'rb') as image_file:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            # Prepare the data to be sent in the request
            data = {
                'capturedImageData': f'data:image/jpeg;base64,{base64_image}'
            }
            # Send the POST request to the normal detection endpoint
            response = self.client.post(self.detection_url, data, format='json')

        # Check that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve the misplaced objects from the response
        misplaced_objects = response.data['misplaced_objects']

        # Check the structure of misplaced_objects
        print(f"Misplaced objects FROM test_handbag_misplaced_detection : {misplaced_objects}")
        misplaced_item_names = [obj['class_name'] for obj in misplaced_objects if 'class_name' in obj]

        # Check that the handbag is detected as misplaced
        self.assertIn('handbag', misplaced_item_names)

        # Delete the uploaded image
        uploaded_image_url = response.data['output_image_url']
        uploaded_image_name = uploaded_image_url.split('/')[-1]
        delete_url = self.delete_url(uploaded_image_name)
        delete_response = self.client.delete(delete_url)

        # Check that the delete response status is 204 No Content
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify that the image file is deleted
        self.assertFalse(os.path.exists(os.path.join('/app/media/images', uploaded_image_name)), f"Image still exists at {uploaded_image_name}")

    def test_no_misplaced_items_detection(self):
        """
        Test ID-> MI3: Verify that no items are detected as misplaced in the image 'test3.jpg'.
        """
        test_image_path = self.test_image_paths['test3.jpg']
        
        # Verify the test image path exists
        assert os.path.exists(test_image_path), f"Test image not found at {test_image_path}"

        # Open the image file and encode it to base64
        with open(test_image_path, 'rb') as image_file:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            # Prepare the data to be sent in the request
            data = {
                'capturedImageData': f'data:image/jpeg;base64,{base64_image}'
            }
            # Send the POST request to the normal detection endpoint
            response = self.client.post(self.detection_url, data, format='json')

        # Check that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Retrieve the misplaced objects from the response
        misplaced_objects = response.data['misplaced_objects']

        # Check the structure of misplaced_objects
        print(f"Misplaced objects FROM test_no_misplaced_items_detection : {misplaced_objects}")
        misplaced_item_names = [obj['class_name'] for obj in misplaced_objects if 'class_name' in obj]

        # Check that no items are detected as misplaced
        self.assertEqual(len(misplaced_item_names), 0)

        # Delete the uploaded image
        uploaded_image_url = response.data['output_image_url']
        uploaded_image_name = uploaded_image_url.split('/')[-1]
        delete_url = self.delete_url(uploaded_image_name)
        delete_response = self.client.delete(delete_url)

        # Check that the delete response status is 204 No Content
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        # Verify that the image file is deleted
        self.assertFalse(os.path.exists(os.path.join('/app/media/images', uploaded_image_name)), f"Image still exists at {uploaded_image_name}")
