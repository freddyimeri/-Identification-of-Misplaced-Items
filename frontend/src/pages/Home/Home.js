// src/pages/Home/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="container home-container">
            <h1>Welcome to MisplaceAI</h1>
            <p>AThis is the home page of the MisplaceAI application. Use this tool to detect and manage misplaced items efficiently.</p>
            <a href="/detection-options" className="btn btn-primary">Get Started</a>
        </div>
    );
};

export default Home;
