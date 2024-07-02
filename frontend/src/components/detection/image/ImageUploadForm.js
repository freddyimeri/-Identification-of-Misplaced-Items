// src/components/detection/image/ImageUploadForm.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/main.css';
import '../../../styles/buttons/uploadButton.css';
import UploadButton from '../../common/buttons/UploadButton';
import TakePhotoButton from '../../common/buttons/TakePhotoButton';

const ImageUploadForm = ({ handleFileChange, handleSubmit, handleCameraClick, handleGalleryClick, isLoading }) => {

    const validateFileType = (file) => {
        const validTypes = ['image/jpeg', 'image/png'];
        return validTypes.includes(file.type);
    };

    const handleFileValidation = (event) => {
        const file = event.target.files[0];
        if (file && validateFileType(file)) {
            handleFileChange(event);
        } else {
            alert('Invalid file type. Please select a PNG or JPG image.');
        }
    };

    return (
        <form id="uploadForm" className="text-center" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
                <TakePhotoButton handleClick={handleCameraClick} isLoading={isLoading} />
                <input
                    type="file"
                    accept="image/*"
                    id="cameraInput"
                    className="d-none"
                    onChange={handleFileValidation}
                />
                <button
                    type="button"
                    className="btn btn-secondary btn-lg mt-3 upload-btn"
                    id="openGalleryBtn"
                    onClick={handleGalleryClick}
                    disabled={isLoading}
                >
                    <i className="fas fa-folder-open fa-3x mb-3"></i> Choose from Gallery
                </button>
                <input
                    type="file"
                    accept="image/*"
                    id="galleryInput"
                    className="d-none"
                    onChange={handleFileValidation}
                />
            </div>
            <UploadButton handleClick={handleSubmit} isLoading={isLoading} />
        </form>
    );
};

export default ImageUploadForm;
