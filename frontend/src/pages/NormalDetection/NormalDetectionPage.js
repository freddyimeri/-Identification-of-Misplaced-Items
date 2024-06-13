// src/pages/NormalDetection/NormalDetectionPage.js

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { normalDetection } from '../../services/processMisplacedManagerApi';
import './NormalDetectionPage.css';
import loadingGif from '../../assets/loading.gif'; // Import your downloaded GIF

const NormalDetectionPage = () => {
    const [imageFile, setImageFile] = useState(null);
    const [resultImageUrl, setResultImageUrl] = useState(null);
    const [misplacedObjects, setMisplacedObjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
            setIsLoading(true); // Set loading to true when processing starts
            const formData = new FormData();
            formData.append('image', imageFile);

            try {
                const response = await normalDetection(formData);
                setResultImageUrl(response.output_image_url);
                setMisplacedObjects(response.misplaced_objects);
            } catch (error) {
                console.error('Upload failed', error);
            } finally {
                setIsLoading(false); // Set loading to false when processing is complete
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header text-center bg-primary text-white py-4">
                            <h1 className="mb-0">Upload Image for Normal Detection</h1>
                        </div>
                        <div className="card-body p-5">
                            {isLoading ? ( // Show loading GIF or message while loading
                                <div className="text-center">
                                    <img src={loadingGif} alt="Loading..." className="img-fluid" />
                                    <p>Your photo is being processed, please wait...</p>
                                </div>
                            ) : (
                                <form id="uploadForm" className="text-center" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="h5 d-block">
                                            <button type="button" id="openCameraBtn" className="btn btn-primary btn-lg" onClick={handleCameraClick}>
                                                <i className="fas fa-camera-retro fa-3x mb-3"></i> Take Photo
                                            </button>
                                        </label>
                                        <input type="file" id="cameraInput" name="image" accept="image/*" capture="environment"
                                            className="form-control-file d-none" onChange={handleFileChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="h5 d-block">
                                            <button type="button" id="openGalleryBtn" className="btn btn-secondary btn-lg" onClick={handleGalleryClick}>
                                                <i className="fas fa-folder-open fa-3x mb-3"></i> Choose from Gallery
                                            </button>
                                        </label>
                                        <input type="file" id="galleryInput" name="image" accept="image/*"
                                            className="form-control-file d-none" onChange={handleFileChange} />
                                    </div>

                                    <button type="submit" className="btn btn-success btn-lg mt-4">
                                        <i className="fas fa-upload"></i> Upload
                                    </button>
                                </form>
                            )}
                            {resultImageUrl && !isLoading && ( // Show results if not loading
                                <div className="mt-5">
                                    <h2>Detection Results</h2>
                                    <img
                                        src={resultImageUrl}
                                        alt="Detected Objects"
                                        className="img-fluid"
                                        onClick={handleImageClick}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <h3 className="mt-4">Misplaced Objects</h3>
                                    <ul className="list-group">
                                        {misplacedObjects.map((obj, index) => (
                                            <li key={index} className="list-group-item">
                                                {obj.class_name} is misplaced. Allowed locations: {obj.allowed_locations.join(", ")}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="text-center mt-4">
                                <a href="/detection-options" className="btn btn-link">
                                    <i className="fas fa-arrow-left"></i> Back to Detection Options
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for full-size image */}
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
        </div>
    );
};

export default NormalDetectionPage;
