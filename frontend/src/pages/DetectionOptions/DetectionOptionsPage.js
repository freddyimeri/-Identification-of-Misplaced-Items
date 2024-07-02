// src/pages/DetectionOptions/DetectionOptionsPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css';

const DetectionOptionsPage = () => {
    return (
        <div className="pages-container-center">
            <h1 className="text-center">Select Detection Method</h1>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6 text-center">
                    <Link to="/normal-detection">
                        <button className="btn btn-primary btn-lg mb-3 w-100">Misplaced Items using Normal Object Detection</button>
                    </Link>
                    <Link to="/upload-video">
                        <button className="btn btn-success btn-lg mb-3 w-100">Misplaced Items using Video Detection</button>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default DetectionOptionsPage;
