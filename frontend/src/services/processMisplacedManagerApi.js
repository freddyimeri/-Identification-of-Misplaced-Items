// src/services/processMisplacedManagerApi.js
import api from './api';

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

// Function to delete a video
export const deleteVideo = async (videoName) => {
    try {
        const response = await api.delete(`/api/process_misplaced_manager/delete-video/${videoName}/`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting video ${videoName}:`, error);
        throw error;
    }
};

export const downloadMedia = async (filePath) => {
    try {
        const response = await api.get(`/api/process_misplaced_manager/download_video/${filePath}/`, {
            responseType: 'blob' // Important for handling file downloads
        });
        return response;
    } catch (error) {
        console.error('Error downloading media:', error);
        throw error;
    }
};