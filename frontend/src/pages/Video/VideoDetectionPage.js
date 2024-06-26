// src/pages/VideoDetection/VideoDetectionPage.js

import React, { useState } from 'react';
import { uploadVideo, getVideoResults } from '../../services/processMisplacedManagerApi';
import '../../styles/main.css';
import LoadingIndicator from '../../components/detection/LoadingIndicator';
import DetectionResults from '../../components/detection/DetectionResults';
import UploadForm from '../../components/detection/UploadForm';
import DetectionContainer from '../../components/detection/DetectionContainer';

const VideoDetectionPage = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [frameInterval, setFrameInterval] = useState(1); // Added state for frame interval
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleFrameIntervalChange = (event) => {
        setFrameInterval(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (videoFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('frame_interval', frameInterval); // Added frame interval to form data

            console.log('Uploading video file:', videoFile);

            try {
                const uploadResponse = await uploadVideo(formData);
                console.log('Response from server:', uploadResponse);

                if (uploadResponse.id) {
                    const videoResults = await getVideoResults(uploadResponse.id);
                    console.log('Video results:', videoResults); // Added log for video results
                    setResult(videoResults);
                } else {
                    throw new Error('Upload response did not contain video ID.');
                }
            } catch (error) {
                console.error('Upload failed', error);
                setResult({ error: 'Failed to process the video. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please select a video to upload.');
        }
    };

    return (
        <DetectionContainer title="Upload Video for Misplaced Items Detection">
            <LoadingIndicator isLoading={isLoading} message="Your video is being processed, please wait..." />
            {!isLoading && (
                <UploadForm
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    handleFrameIntervalChange={handleFrameIntervalChange}
                    handleCameraClick={() => { }}
                    handleGalleryClick={() => { }}
                    isLoading={isLoading}
                />
            )}
            <DetectionResults result={result} />
            <div className="text-center mt-4">
                <a href="/detection-options" className="btn btn-link">
                    <i className="fas fa-arrow-left"></i> Back to Detection Options
                </a>
            </div>
        </DetectionContainer>
    );
};

export default VideoDetectionPage;
