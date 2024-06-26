/* src/components/detection/UploadForm.js */

import React from 'react';

const UploadForm = ({ handleFileChange, handleSubmit, handleFrameIntervalChange, handleCameraClick, handleGalleryClick, isLoading }) => {
    return (
        <form id="uploadForm" className="text-center" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
                <label className="h5 d-block">
                    <input
                        type="file"
                        accept="video/*"
                        className="form-control-file"
                        onChange={handleFileChange}
                    />
                </label>
                <label className="h5 d-block mt-3">
                    Frame Interval (seconds):
                    <input
                        type="number"
                        className="form-control"
                        onChange={handleFrameIntervalChange}
                    />
                </label>
            </div>
            <button type="submit" className="btn btn-success btn-lg mt-4" disabled={isLoading}>
                <i className="fas fa-upload"></i> Upload
            </button>
        </form>
    );
};

export default UploadForm;
