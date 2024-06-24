// src/pages/UserProfile/UserProfile.js

import React, { useState } from 'react';
import ChangeEmailSection from '../../components/UserProfile/ChangeEmailSection';
import '../../styles/main.css';

const UserProfile = () => {
    const [currentEmail, setCurrentEmail] = useState('freddy.imeri1@gmail.com'); // Placeholder, should be fetched from API

    const handleUpdateEmail = async ({ newEmail, password }) => {
        // Implement the API call to update the email here
        console.log('Updating email to:', newEmail);
        console.log('Password for verification:', password);
        setCurrentEmail(newEmail);
    };

    return (
        <div className="container">
            <h1>User Profile</h1>
            <ChangeEmailSection
                currentEmail={currentEmail}
                onUpdateEmail={handleUpdateEmail}
            />
        </div>
    );
};

export default UserProfile;
