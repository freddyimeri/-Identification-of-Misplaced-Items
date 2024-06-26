// src/components/detection/FileUploadForm.js
import React from 'react';
import '../../styles/main.css';

const FileUploadForm = ({ handleFileChange, handleSubmit, isLoading, children }) => {
    return (
        <form id="uploadForm" className="text-center" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
                {children}
                <label className="h5 d-block mt-3">
                    <input
                        type="file"
                        accept="video/*,image/*"
                        className="form-control-file"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </label>
            </div>
            <button type="submit" className="btn btn-success btn-lg mt-4" disabled={isLoading}>
                <i className="fas fa-upload"></i> Upload
            </button>
        </form>
    );
};

export default FileUploadForm;
