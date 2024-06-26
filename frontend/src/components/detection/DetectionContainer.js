// src/components/detection/DetectionContainer.js

import React from 'react';
import '../../styles/main.css'; // Ensure this path is correct based on your project structure

const DetectionContainer = ({ title, children }) => {
    return (
        <div className="pages-container-center">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header text-center bg-primary text-white py-4">
                            <h1 className="mb-0">{title}</h1>
                        </div>
                        <div className="card-body p-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetectionContainer;
