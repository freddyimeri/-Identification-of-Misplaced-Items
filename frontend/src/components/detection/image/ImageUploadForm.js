// src/components/detection/image/ImageUploadForm.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/main.css';
import '../../../styles/buttons/uploadButton.css';
import UploadButton from '../../common/buttons/UploadButton';
import TakePhotoButton from '../../common/buttons/TakePhotoButton';


const ImageUploadForm = ({ handleFileChange, handleSubmit, handleCameraClick, handleGalleryClick, isLoading }) => {
    return (
        <form id="uploadForm" className="text-center" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
                <TakePhotoButton handleClick={handleCameraClick} isLoading={isLoading} />
                <input
                    type="file"
                    accept="image/*"
                    id="cameraInput"
                    className="d-none"
                    onChange={handleFileChange}
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
                    onChange={handleFileChange}
                />
            </div>
            <UploadButton handleClick={handleSubmit} isLoading={isLoading} />
        </form>
    );
};

export default ImageUploadForm;
