// src/components/UserProfile/EditableInfoForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PasswordInputField from '../Common/Password/PasswordInputField';
import SubmitButton from '../Common/buttons/SubmitButton';
import CancelButton from '../Common/buttons/CancelButton';

const EditableInfoForm = ({ label, type, onSubmit, onCancel, loading, error }) => {
    const [newInfo, setNewInfo] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ newInfo, password });
        setNewInfo('');
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit} role="form">
            <div className="form-group">
                <label htmlFor="new-info-input">New {label}</label>
                <input
                    id="new-info-input"
                    type={type}
                    className="form-control"
                    value={newInfo}
                    onChange={(e) => setNewInfo(e.target.value)}
                    required
                />
            </div>
            <PasswordInputField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="text-danger">{error}</p>}
            <div className="form-buttons">
                <SubmitButton className="submit-button" label={loading ? 'Updating...' : `Update ${label}`} disabled={loading} />
                <CancelButton className="action-button" label="Cancel" onClick={onCancel} />
            </div>
        </form>
    );
};

EditableInfoForm.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};

export default EditableInfoForm;
