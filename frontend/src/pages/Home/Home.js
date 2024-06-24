// src/pages/Home/Home.js

import React from 'react';
import '../../styles/main.css';

const Home = () => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">Welcome to MisplaceAI</h1>
                    <p className="card-text">This is the home page of the MisplaceAI application. Use this tool to detect and manage misplaced items efficiently.</p>
                    <a href="/detection-options" className="btn btn-primary">Get Started</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
