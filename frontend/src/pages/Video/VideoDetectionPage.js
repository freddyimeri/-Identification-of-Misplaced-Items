// src/pages/VideoDetection/VideoDetectionPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadVideo, getVideoResults, deleteVideo } from '../../services/processMisplacedManagerApi';
import '../../styles/main.css';
import LoadingIndicator from '../../components/detection/LoadingIndicator';
import DetectionResults from '../../components/detection/DetectionResults';
import UploadForm from '../../components/detection/UploadForm';
import DetectionContainer from '../../components/detection/DetectionContainer';

const VideoDetectionPage = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [frameInterval, setFrameInterval] = useState(1);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [videoName, setVideoName] = useState(null);
    const [annotatedVideoName, setAnnotatedVideoName] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleUnload = async () => {
            if (annotatedVideoName && !isDeleting) {
                setIsDeleting(true);
                console.log('Navigation event detected:');
                console.log('Annotated video name detected:', annotatedVideoName);
                try {
                    const response = await deleteVideo(annotatedVideoName);
                    console.log('Delete video response:', response);
                } catch (error) {
                    console.error('Error deleting video:', error);
                }
                setIsDeleting(false);
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [annotatedVideoName, isDeleting]);

    useEffect(() => {
        const handleRouteChange = async () => {
            if (annotatedVideoName && !isDeleting) {
                setIsDeleting(true);
                console.log('Route change detected:');
                console.log('Annotated video name detected:', annotatedVideoName);
                try {
                    const response = await deleteVideo(annotatedVideoName);
                    console.log('Delete video response:', response);
                } catch (error) {
                    console.error('Error deleting video:', error);
                }
                setIsDeleting(false);
            }
        };

        return () => {
            handleRouteChange();
        };
    }, [annotatedVideoName, isDeleting, location]);

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
            formData.append('frame_interval', frameInterval);

            try {
                const uploadResponse = await uploadVideo(formData);
                console.log('Response from server:', uploadResponse);

                if (uploadResponse.id) {
                    const videoResults = await getVideoResults(uploadResponse.id);
                    console.log('Video results:', videoResults);
                    setResult(videoResults);
                    setVideoName(uploadResponse.video.split('/').pop()); // Extract original video name from the response
                    setAnnotatedVideoName(videoResults.output_video_url.split('/').pop()); // Extract annotated video name from the results
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
