// src/components/detection/LoadingIndicator.js
import React from 'react';
import loadingGif from '../../assets/loading.gif';
import '../../styles/main.css';

const LoadingIndicator = ({ isLoading, message }) => {
    return (
        isLoading && (
            <div className="text-center">
                <img src={loadingGif} alt="Loading..." className="img-fluid" />
                <p>{message}</p>
            </div>
        )
    );
};

export default LoadingIndicator;
