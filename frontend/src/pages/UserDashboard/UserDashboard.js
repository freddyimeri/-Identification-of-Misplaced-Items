// src/pages/UserDashboard/UserDashboard.js
import React, { useEffect, useState } from 'react';
import '../../styles/main.css';
import '../../styles/dashboard.css';
import ButtonLink from '../../components/Common/buttons/ButtonLink';

const UserDashboard = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Simulate fetching user data from localStorage or an API
        const user = localStorage.getItem('username');
        if (user) {
            setUsername(user);
        } else {
            setUsername('User'); // Default if no username found
        }
    }, []);

    return (
        <div className="pages-container-center">
            <h1 className="dashboard-title">User Dashboard</h1>
            <h2 className="dashboard-greeting">Hello, {username}</h2>
            <div className="dashboard-buttons-container">
                <ButtonLink to="/user/profile" label="User Profile" />
                <ButtonLink to="/user/manage-rules" label="Manage Rules" />
                {/* Add more ButtonLink components here as needed */}
            </div>
        </div>
    );
};

export default UserDashboard;
