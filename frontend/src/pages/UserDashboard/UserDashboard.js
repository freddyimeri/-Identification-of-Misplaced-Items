// src/pages/UserDashboard/UserDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css';

const UserDashboard = () => {
    return (
        <div className="user-dashboard-container">
            <h1>User Dashboard</h1>
            <Link to="/user/profile" className="btn btn-primary">User Profile</Link>
        </div>
    );
};

export default UserDashboard;
