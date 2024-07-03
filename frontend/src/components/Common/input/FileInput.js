import React, { useRef } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import '../../../styles/input/FileInput.css';

const FileInput = ({ label, onChange, fileName, disabled, onRemove }) => {
    const fileInputRef = useRef(null);

    const handleFileRemove = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        onRemove();
        console.log('File input remove clicked');
    };

    return (
        <div className="file-input-container">
            <label className="file-input-label">{label}</label>
            <div className="file-input-wrapper">
                {!fileName && (
                    <>
                        <input
                            type="file"
                            className="file-input-field"
                            onChange={onChange}
                            ref={fileInputRef}
                            disabled={disabled}
                            accept="video/*"
                        />
                        <button
                            type="button"
                            className="file-input-upload-button"
                            onClick={() => fileInputRef.current.click()}
                            disabled={disabled}
                        >
                            <FaUpload className="upload-icon" /> Upload Video
                        </button>
                    </>
                )}
            </div>
            {fileName && (
                <div className="file-details">
                    <span className="file-name">{fileName}</span>
                    <button
                        type="button"
                        className="file-remove-button"
                        onClick={handleFileRemove}
                        disabled={disabled}
                    >
                        <FaTrash className="remove-icon" /> Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileInput;
