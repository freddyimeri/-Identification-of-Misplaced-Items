// src/forms/UserProfile/ChangeEmailForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditableInfoForm from '../../components/UserProfile/EditableInfoForm';
import { updateUserEmail } from '../../services/userApi';
import ActionButton from '../../components/Common/buttons/ActionButton';

const ChangeEmailForm = ({ currentEmail, onUpdateEmail }) => {
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
            const response = await updateUserEmail({ email: newInfo, password });
            console.log('Email updated:', response);
            onUpdateEmail({ newInfo }); // Update the parent state
            setShowForm(false);
        } catch (err) {
            console.error('Failed to update email:', err);
            setError('Failed to update email. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-card">
            <div className="card card-wide">
                <div className="card-body">
                    <h3 className="card-title">Current Email: {currentEmail}</h3>
                    <ActionButton className="action-button" label={showForm ? 'Cancel' : 'Change Email'} onClick={handleActionClick} />
                </div>
            </div>
            {showForm && (
                <div className="card card-wide">
                    <div className="card-body">
                        <EditableInfoForm
                            label="New Email"
                            type="email"
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

ChangeEmailForm.propTypes = {
    currentEmail: PropTypes.string.isRequired,
    onUpdateEmail: PropTypes.func.isRequired,
};

export default ChangeEmailForm;
