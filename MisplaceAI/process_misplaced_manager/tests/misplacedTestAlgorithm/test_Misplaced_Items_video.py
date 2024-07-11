# MisplaceAI/process_misplaced_manager/tests/misplacedTestAlgorithm/test_Misplaced_Items_video.py

"""
This file contains tests for video detection functionality in the MisplaceAI application.
It includes tests to:
Test ID-> MV1: Verify that a specific item ('potted plant') is detected as misplaced in an uploaded video.
Test ID-> MV2: Ensure that the uploaded video can be deleted successfully.
Test ID-> MV3: Check that the length of the processed video is as expected (30 seconds).
"""

import os
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from process_misplaced_manager.models import DetectionLimitSetting, DailyDetectionLimit
from moviepy.editor import VideoFileClip

class TestVideoAlgorithmAccuracy(APITestCase):
    def setUp(self):
        """
        Set up the initial conditions for the tests, including creating an admin user, a test user,
        and setting up necessary items, locations, rules, and detection limits.
        """
        # Create and login an admin user
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpassword')
        self.client.login(username='admin', password='adminpassword')
        
        # Create item 'potted plant' for the test and get its ID
        self.item_potted_plant = self.client.post(reverse('rules:admin_manage_item'), {'name': 'potted plant'}).data['id']
        
        # Create location 'chair' for the test and get its ID
        self.location_chair = self.client.post(reverse('rules:admin_manage_location'), {'name': 'chair'}).data['id']
        
        # Create rule associating the 'potted plant' item with the 'chair' location
        self.client.post(reverse('rules:admin_manage_rule'), {
            'item': self.item_potted_plant,
            'locations': [self.location_chair]
        })

        # Create and login the test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')
        
        # Set up the path to the test video file
        self.test_video_path = '/app/process_misplaced_manager/tests/test_files/videos/videoTest1.mp4'
        
        # Set up the URL for the video detection endpoint
        self.detection_url = reverse('process_misplaced_manager:upload_video')
        
        # Set up the URL for the delete video endpoint using a lambda function to insert the video name
        self.delete_url = lambda video_name: reverse('process_misplaced_manager:delete_video', args=[video_name])
        
        # Create detection limit settings with limits for image and video detections
        DetectionLimitSetting.objects.create(daily_image_limit=10, daily_video_limit=5)
        
        # Create daily detection limit record for the test user
        DailyDetectionLimit.objects.create(user=self.user)

    def test_potted_plant_misplaced_detection(self):
        """
        Test ID-> MV1: Verify that a specific item ('potted plant') is detected as misplaced in an uploaded video.
        """
        # Get the path to the test video
        test_video_path = self.test_video_path

        # Verify the test video path exists
        assert os.path.exists(test_video_path), f"Test video not found at {test_video_path}"

        # Open the test video file in binary read mode
        with open(test_video_path, 'rb') as video_file:
            # Prepare form data for the POST request, including the video file, frames_jump, and frame_delay
            form_data = {
                'video': video_file,
                'frames_jump': 30,
                'frame_delay': 15
            }
            # Send the POST request to the video detection endpoint
            response = self.client.post(self.detection_url, form_data, format='multipart')

        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the video results by getting the video ID from the response data
        video_id = response.data['id']
        results_url = reverse('process_misplaced_manager:display_video_results', args=[video_id])
        results_response = self.client.get(results_url)

        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(results_response.status_code, status.HTTP_200_OK)

        # Get the misplaced objects from the response data
        misplaced_objects = results_response.data['misplaced_objects']

        # Print the misplaced objects for debugging purposes
        print(f"Misplaced objects FROM test_potted_plant_misplaced_detection: {misplaced_objects}")
        
        # Extract the names of misplaced items from the response data
        misplaced_item_names = [obj['class_name'] for frame in misplaced_objects for obj in frame if 'class_name' in obj]

        # Check that 'potted plant' is detected as misplaced
        self.assertIn('potted plant', misplaced_item_names)

    def test_video_deletion(self):
        """
        Test ID-> MV2: Ensure that the uploaded video can be deleted successfully.
        """
        # Get the path to the test video
        test_video_path = self.test_video_path

        # Verify the test video path exists
        assert os.path.exists(test_video_path), f"Test video not found at {test_video_path}"

        # Open the test video file in binary read mode
        with open(test_video_path, 'rb') as video_file:
            # Prepare form data for the POST request, including the video file, frames_jump, and frame_delay
            form_data = {
                'video': video_file,
                'frames_jump': 30,
                'frame_delay': 15
            }
            # Send the POST request to the video detection endpoint
            response = self.client.post(self.detection_url, form_data, format='multipart')

        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Get the video name from the response data
        video_name = response.data['video'].split('/')[-1]

        # Generate the URL for the delete video endpoint using the video name
        delete_url = self.delete_url(video_name)
        
        # Send the DELETE request to the delete video endpoint
        delete_response = self.client.delete(delete_url)

        # Assert that the response status code is HTTP 204 No Content
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Assert that the video file no longer exists in the specified path
        self.assertFalse(os.path.exists(os.path.join('/app/media/videos', video_name)), f"Video still exists at {video_name}")

    def test_processed_video_length(self):
        """
        Test ID-> MV3: Check that the length of the processed video is as expected (30 seconds).
        """
        # Get the path to the test video
        test_video_path = self.test_video_path

        # Verify the test video path exists
        assert os.path.exists(test_video_path), f"Test video not found at {test_video_path}"

        # Open the test video file in binary read mode
        with open(test_video_path, 'rb') as video_file:
            # Prepare form data for the POST request, including the video file, frames_jump, and frame_delay
            form_data = {
                'video': video_file,
                'frames_jump': 30,
                'frame_delay': 15
            }
            # Send the POST request to the video detection endpoint
            response = self.client.post(self.detection_url, form_data, format='multipart')

        # Assert that the response status code is HTTP 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Fetch the video results by getting the video ID from the response data
        video_id = response.data['id']
        results_url = reverse('process_misplaced_manager:display_video_results', args=[video_id])
        results_response = self.client.get(results_url)

        # Assert that the response status code is HTTP 200 OK
        self.assertEqual(results_response.status_code, status.HTTP_200_OK)

        # Get the output video URL from the response data
        output_video_url = results_response.data['output_video_url']
        
        # Construct the output video path from the URL
        output_video_path = os.path.join('/app/media/videos', output_video_url.split('/')[-1])

        # Load the output video file
        video_clip = VideoFileClip(output_video_path)
        
        # Get the duration of the video in seconds
        video_length = video_clip.duration

        # Print the processed video length for debugging purposes
        print(f"Processed video length: {video_length} seconds")
        
        # Assert that the video length is approximately 30 seconds (with a tolerance of 1 second)
        self.assertTrue(abs(video_length - 30) < 1, f"Video length is not as expected: {video_length} seconds")
