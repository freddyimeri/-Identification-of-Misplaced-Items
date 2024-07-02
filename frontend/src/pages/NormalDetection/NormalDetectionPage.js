/* src/pages/NormalDetection/NormalDetectionPage.js */
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { normalDetection } from '../../services/processMisplacedManagerApi';
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
        if (imageFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const response = await normalDetection(formData);
                setResultImageUrl(response.output_image_url);
                setMisplacedObjects(response.misplaced_objects);
            } catch (error) {
                console.error('Upload failed', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert('Please select an image to upload.');
        }
    };

    const handleImageClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <DetectionContainer title="Upload Image for Normal Detection">
            <LoadingIndicator isLoading={isLoading} message="Your photo is being processed, please wait..." />
            {!isLoading && (
                <ImageUploadForm
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    handleCameraClick={handleCameraClick}
                    handleGalleryClick={handleGalleryClick}
                    isLoading={isLoading}
                />
            )}
            <DetectionResults result={{ output_image_url: resultImageUrl, misplaced_objects: misplacedObjects }} />
            <div className="text-center mt-4">
                <a href="/detection-options" className="btn btn-link">
                    <i className="fas fa-arrow-left"></i> Back to Detection Options
                </a>
            </div>
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
