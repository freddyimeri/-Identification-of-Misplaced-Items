// src/components/common/buttons/UploadButton.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/main.css';

const UploadButton = ({ handleClick, isLoading }) => {
    return (
        <button
            type="button"
            className="btn btn-primary btn-lg mt-3 upload-btn"
            onClick={handleClick}
            disabled={isLoading}
        >
            <i className="fas fa-upload fa-3x mb-3"></i> Upload
        </button>
    );
};

export default UploadButton;
