// src/pages/VideoDetection/VideoDetectionPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadVideo, getVideoResults, deleteVideo, downloadMedia } from '../../services/processMisplacedManagerApi';
import { checkDailyLimit, incrementDetection } from '../../services/dailyLimitApi';
import '../../styles/main.css';
import LoadingIndicator from '../../components/detection/LoadingIndicator';
import DetectionResults from '../../components/detection/DetectionResults';
import VideoUploadForm from '../../components/detection/video/VideoUploadForm';
import DetectionContainer from '../../components/detection/DetectionContainer';
import { Button } from 'react-bootstrap';
import { getVideoDuration, calculateMinimumDelay, calculateMaximumDelay, calculateExpectedLength, isValidVideoLength } from '../../components/detection/video/videoUtils';

const VideoDetectionPage = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [framesJump, setFramesJump] = useState(1);
    const [frameDelay, setFrameDelay] = useState(1);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [videoName, setVideoName] = useState(null);
    const [annotatedVideoName, setAnnotatedVideoName] = useState(null);
    const [limitInfo, setLimitInfo] = useState({ remaining: 0, limit: 0 });
    const navigate = useNavigate();
    const location = useLocation();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchLimitInfo = async () => {
            const data = await checkDailyLimit('video');
            setLimitInfo(data);
        };
        fetchLimitInfo();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            if (!isDeleting && annotatedVideoName) {
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

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload();
        };
    }, [annotatedVideoName, isDeleting]);

    useEffect(() => {
        const handleRouteChange = async () => {
            if (!isDeleting && annotatedVideoName) {
                setIsDeleting(true);
                console.log('Route change detected:');
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
    }, [annotatedVideoName, location, isDeleting]);

    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleFramesJumpChange = (event) => {
        setFramesJump(parseInt(event.target.value));
    };

    const handleFrameDelayChange = (event) => {
        setFrameDelay(parseInt(event.target.value));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (limitInfo.remaining <= 0) {
            alert('You have reached your daily limit for video detection.');
            return;
        }

        if (videoFile) {
            // Validate video duration here before proceeding
            const videoDuration = await getVideoDuration(videoFile);
            if (!isValidVideoLength(videoDuration)) {
                alert('The video length must be between 3 seconds and 10 minutes.');
                return;
            }

            // Calculate the minimum and maximum delay to ensure the output video is within the required length
            const minDelay = calculateMinimumDelay(videoDuration, framesJump);
            const maxDelay = calculateMaximumDelay(videoDuration, framesJump);
            const expectedLength = calculateExpectedLength(videoDuration, framesJump, frameDelay);

            if (frameDelay < minDelay || frameDelay > maxDelay || expectedLength < 30 || expectedLength > 600) {
                alert(`The delay per frame must be between ${minDelay} and ${maxDelay} seconds, and the expected output video length must be between 30 seconds and 10 minutes.`);
                return;
            }

            setIsLoading(true);
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('frames_jump', framesJump);
            formData.append('frame_delay', frameDelay);

            try {
                const uploadResponse = await uploadVideo(formData);
                console.log('Response from server:', uploadResponse);

                if (uploadResponse.id) {
                    const videoResults = await getVideoResults(uploadResponse.id);
                    console.log('Video results:', videoResults);
                    setResult(videoResults);
                    setVideoName(uploadResponse.video.split('/').pop()); // Extract original video name from the response
                    setAnnotatedVideoName(videoResults.output_video_url.split('/').pop()); // Extract annotated video name from the results
                    await incrementDetection('video'); // Increment the detection count
                    const data = await checkDailyLimit('video'); // Fetch updated limit info
                    setLimitInfo(data);
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

    const handleDownload = async () => {
        try {
            const filePath = result.output_video_url.split('/').pop();
            const response = await downloadMedia(filePath);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `detection_result${result.output_video_url.substring(result.output_video_url.lastIndexOf('.'))}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading video:', error);
        }
    };

    return (
        <DetectionContainer title="Upload Video for Misplaced Items Detection">
            <LoadingIndicator isLoading={isLoading} message="Your video is being processed, please wait..." />
            {!isLoading && (
                <>
                    <p>You have {limitInfo.remaining} out of {limitInfo.limit} video detections remaining today.</p>
                    <VideoUploadForm
                        handleFileChange={handleFileChange}
                        handleSubmit={handleSubmit}
                        handleFramesJumpChange={handleFramesJumpChange}
                        handleFrameDelayChange={handleFrameDelayChange}
                        framesJump={framesJump}
                        frameDelay={frameDelay}
                        isLoading={isLoading}
                    />
                </>
            )}
            <DetectionResults result={result} />
            <div className="text-center mt-4">
                {result && result.output_video_url && (
                    <Button onClick={handleDownload} className="btn btn-success mr-2">
                        Download Video
                    </Button>
                )}
                <a href="/detection-options" className="btn btn-link">
                    <i className="fas fa-arrow-left"></i> Back to Detection Options
                </a>
            </div>
        </DetectionContainer>
    );
};

export default VideoDetectionPage;
