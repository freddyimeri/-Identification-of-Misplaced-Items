// src/components/Common/buttons/TakePhotoButton.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/main.css';

const TakePhotoButton = ({ handleClick, isLoading }) => {
    return (
        <button
            type="button"
            className="btn btn-primary btn-lg mt-3 upload-btn"
            onClick={handleClick}
            disabled={isLoading}
        >
            <i className="fas fa-camera-retro fa-3x mb-3"></i> Take Photo
        </button>
    );
};

export default TakePhotoButton;
