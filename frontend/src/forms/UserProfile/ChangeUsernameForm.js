// src/forms/UserProfile/ChangeUsernameForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditableInfoForm from '../../components/UserProfile/EditableInfoForm';
import { updateUsername } from '../../services/userApi';
import ActionButton from '../../components/Common/buttons/ActionButton';

const ChangeUsernameForm = ({ currentUsername, onUpdateUsername }) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleActionClick = () => {
        setShowForm(!showForm);
    };

    const handleCancel = () => {
        setShowForm(false);
        setError(null);
    };

    const handleSubmit = async ({ newInfo, password }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateUsername({ username: newInfo, password });
            console.log('Username updated:', response);
            onUpdateUsername({ newInfo }); // Update the parent state
            setShowForm(false);
        } catch (err) {
            console.error('Failed to update username:', err);
            setError('Failed to update username. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-card">
            <div className="card card-wide">
                <div className="card-body">
                    <h3 className="card-title">Current Username: {currentUsername}</h3>
                    <ActionButton className="action-button" label={showForm ? 'Cancel' : 'Change Username'} onClick={handleActionClick} />
                </div>
            </div>
            {showForm && (
                <div className="card card-wide">
                    <div className="card-body">
                        <EditableInfoForm
                            label="New Username"
                            type="text"
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

ChangeUsernameForm.propTypes = {
    currentUsername: PropTypes.string.isRequired,
    onUpdateUsername: PropTypes.func.isRequired,
};

export default ChangeUsernameForm;
