// src/services/processMisplacedManagerApi.js
import api from './api';

// Function to get all images
export const getImages = async () => {
    try {
        const response = await api.get('/api/process_misplaced_manager/images/');
        return response.data;
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
};

// Function to get a single image by ID
export const getImage = async (id) => {
    try {
        const response = await api.get(`/api/process_misplaced_manager/images/${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching image with ID ${id}:`, error);
        throw error;
    }
};

// Function to create a new image
export const createImage = async (data) => {
    try {
        const response = await api.post('/api/process_misplaced_manager/images/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating image:", error);
        throw error;
    }
};

// Function to get all videos
export const getVideos = async () => {
    try {
        const response = await api.get('/api/process_misplaced_manager/videos/');
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
};

// Function to get a single video by ID
export const getVideo = async (id) => {
    try {
        const response = await api.get(`/api/process_misplaced_manager/videos/${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching video with ID ${id}:`, error);
        throw error;
    }
};

// Function to create a new video
export const createVideo = async (data) => {
    try {
        const response = await api.post('/api/process_misplaced_manager/videos/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating video:", error);
        throw error;
    }
};

// Function for normal detection
export const normalDetection = async (data) => {
    try {
        const response = await api.post('/api/process_misplaced_manager/normal-detection/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error in normal detection:", error);
        throw error;
    }
};


// Function to upload a video
export const uploadVideo = async (data) => {
    try {
        const response = await api.post('/api/process_misplaced_manager/upload-video/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

// Function to check placement rules
export const checkPlacement = async (data) => {
    try {
        const response = await api.post('/api/placement_rules/check_placement/', data);
        return response.data;
    } catch (error) {
        console.error("Error in checking placement:", error);
        throw error;
    }
};


// Function to get video results
export const getVideoResults = async (id) => {
    try {
        const response = await api.get(`/api/process_misplaced_manager/video-results/${id}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching video results with ID ${id}:`, error);
        throw error;
    }
};


// Function to download an image
export const downloadImage = async (filePath) => {
    try {
        const response = await api.get(`/api/process_misplaced_manager/download/${filePath}/`, {
            responseType: 'blob', // Important for handling file downloads
        });
        return response;
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

export const deleteImageByName = async (imageName) => {
    try {
        const response = await api.delete(`/api/process_misplaced_manager/delete-image/${imageName}/`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting image with name ${imageName}:`, error);
        throw error;
    }
};