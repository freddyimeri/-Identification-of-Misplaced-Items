// src/pages/NormalDetection/NormalDetectionPage.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { normalDetection, downloadImage, deleteImageByName } from '../../services/processMisplacedManagerApi';
import { checkDailyLimit, incrementDetection } from '../../services/dailyLimitApi';
import '../../styles/main.css';
import LoadingIndicator from '../../components/detection/LoadingIndicator';
import DetectionResults from '../../components/detection/DetectionResults';
import ImageUploadForm from '../../components/detection/image/ImageUploadForm';
import DetectionContainer from '../../components/detection/DetectionContainer';

const NormalDetectionPage = () => {
    const [imageFile, setImageFile] = useState(null);
    const [resultImageUrl, setResultImageUrl] = useState(null);
    const [misplacedObjects, setMisplacedObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detectionComplete, setDetectionComplete] = useState(false);
    const [imageName, setImageName] = useState(null);
    const [limitInfo, setLimitInfo] = useState({ remaining: 0, limit: 0 });
    const location = useLocation();

    useEffect(() => {
        const fetchLimitInfo = async () => {
            const data = await checkDailyLimit('image');
            setLimitInfo(data);
        };
        fetchLimitInfo();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            console.log('Navigation or route change detected:');
            if (imageName) {
                console.log('Image name detected:', imageName);
                try {
                    const response = await deleteImageByName(imageName);
                    console.log('Delete image response:', response);
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload();
        };
    }, [imageName, location]);

    const handleCameraClick = () => {
        document.getElementById('cameraInput').click();
    };

    const handleGalleryClick = () => {
        document.getElementById('galleryInput').click();
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (limitInfo.remaining <= 0) {
            alert('You have reached your daily limit for image detection.');
            return;
        }

        if (imageFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const response = await normalDetection(formData);
                console.log('Normal detection response:', response);
                setResultImageUrl(response.output_image_url);
                setMisplacedObjects(response.misplaced_objects);
                setDetectionComplete(true);
                setImageName(response.output_image_url.split('/').pop()); // Set the image name
                await incrementDetection('image'); // Increment the detection count
                const data = await checkDailyLimit('image'); // Fetch updated limit info
                setLimitInfo(data);
            } catch (error) {
                console.error('Upload failed', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please select an image to upload.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleReset = () => {
        setImageFile(null);
        setResultImageUrl(null);
        setMisplacedObjects([]);
        setDetectionComplete(false);
        setImageName(null);
    };

    const handleDownload = async () => {
        try {
            const filePath = resultImageUrl.split('/').pop();
            const response = await downloadImage(filePath);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `detection_result${resultImageUrl.substring(resultImageUrl.lastIndexOf('.'))}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <DetectionContainer title="Upload Image for Normal Detection">
            <LoadingIndicator isLoading={isLoading} message="Your photo is being processed, please wait..." />
            {!isLoading && !detectionComplete && (
                <>
                    <p>You have {limitInfo.remaining} out of {limitInfo.limit} image detections remaining today.</p>
                    <ImageUploadForm
                        handleFileChange={handleFileChange}
                        handleSubmit={handleSubmit}
                        handleCameraClick={handleCameraClick}
                        handleGalleryClick={handleGalleryClick}
                        isLoading={isLoading}
                    />
                </>
            )}
            {!isLoading && detectionComplete && (
                <>
                    <DetectionResults result={{ output_image_url: resultImageUrl, misplaced_objects: misplacedObjects }} />
                    <div className="text-center mt-4">
                        <Button onClick={handleDownload} className="btn btn-success mr-2">
                            Download Image
                        </Button>
                        <Button onClick={handleReset} className="btn btn-primary">
                            Detect Another Image
                        </Button>
                    </div>
                </>
            )}
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Full-Size Image</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '20px', textAlign: 'center' }}>
                    <img src={resultImageUrl} alt="Full Size Detected Objects" className="img-fluid" style={{ maxWidth: '100%' }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </DetectionContainer>
    );
};

export default NormalDetectionPage;
