// src/pages/UserProfile/UserProfile.js

import React, { useState, useEffect } from 'react';
import ChangeEmailForm from '../../forms/UserProfile/ChangeEmailForm';
import ChangeUsernameForm from '../../forms/UserProfile/ChangeUsernameForm';
import { getCurrentUserEmail, getCurrentUserUsername } from '../../services/userApi';
import '../../styles/main.css';
import '../../styles/dashboard.css';

const UserProfile = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        const fetchCurrentUserDetails = async () => {
            try {
                const emailResponse = await getCurrentUserEmail();
                setCurrentEmail(emailResponse.email);
                const usernameResponse = await getCurrentUserUsername();
                setCurrentUsername(usernameResponse.username);
            } catch (error) {
                console.error('Failed to fetch current user details:', error);
            }
        };

        fetchCurrentUserDetails();
    }, []);

    const handleUpdateEmail = async (data) => {
        setCurrentEmail(data.newInfo);
    };

    const handleUpdateUsername = async (data) => {
        setCurrentUsername(data.newInfo);
    };

    return (
        <div className="pages-container-center">
            <h1 className="dashboard-title">User Profile</h1>
            <ChangeEmailForm
                currentEmail={currentEmail}
                onUpdateEmail={handleUpdateEmail}
            />
            <ChangeUsernameForm
                currentUsername={currentUsername}
                onUpdateUsername={handleUpdateUsername}
            />
        </div>
    );
};

export default UserProfile;
