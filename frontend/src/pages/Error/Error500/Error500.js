// src/pages/Error/Error500/Error500.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Error500.css';

const Error500 = () => {
    return (
        <div className="error500-page">
            <div className="error500-container">
                <div className="error500-header">
                    <h1 className="error500-title">500</h1>
                    <h2 className="error500-subtitle">Internal Server Error</h2>
                </div>
                <div className="error500-body">
                    <p className="error500-message">Oops! Something went wrong on our end. Please try again later or go back to the homepage.</p>
                    <Link to="/" className="error500-link" onClick={() => console.log('Go Home clicked')}>Go Home</Link>
                </div>
                <div className="error500-animation">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>
            </div>
        </div>
    );
};

export default Error500;
